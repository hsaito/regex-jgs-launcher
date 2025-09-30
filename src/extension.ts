// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as cp from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

// Helper function to safely get localized text with fallback
function safeL10n(key: string, fallback: string, ...args: (string | number)[]): string {
	try {
		const result = vscode.l10n.t(key, ...args);
		// If the result is exactly the same as the key, l10n failed to load
		if (result === key) {
			console.warn(`[JGS Regex Launcher] Localization failed for key '${key}', using fallback: ${fallback}`);
			return fallback;
		}
		return result;
	} catch (error) {
		console.warn(`[JGS Regex Launcher] Localization error for key '${key}':`, error);
		return fallback;
	}
}

// Function to check if l10n is properly loaded
function isL10nReady(): boolean {
	try {
		// Test with a known key - if it returns the key itself, l10n isn't ready
		const testResult = vscode.l10n.t('message.onboarding');
		return testResult !== 'message.onboarding';
	} catch (error) {
		return false;
	}
}

// Function to show onboarding with proper l10n initialization
async function showOnboardingIfNeeded() {
	const cfg = vscode.workspace.getConfiguration();
	const showOnStartup = cfg.get<boolean>('regex-jgs-launcher.onboarding.showOnStartup', true);
	if (!showOnStartup) {
		return;
	}

	// Use safe localization with fallbacks
	const onboardingMsg = safeL10n('message.onboarding', 'JGS Regex Launcher is not configured. Open setup?');
	const setupBtn = safeL10n('button.setup', 'Setup');
	const neverShowBtn = safeL10n('button.neverShowAgain', 'Never show again');
	const notNowBtn = safeL10n('button.notNow', 'Not now');

	const choice = await vscode.window.showInformationMessage(
		onboardingMsg,
		setupBtn,
		neverShowBtn,
		notNowBtn
	);

	if (choice === setupBtn) {
		await vscode.commands.executeCommand('regex-jgs-launcher.showSetup');
		await cfg.update('regex-jgs-launcher.onboarding.showOnStartup', false, vscode.ConfigurationTarget.Global);
	} else if (choice === neverShowBtn) {
		await cfg.update('regex-jgs-launcher.onboarding.showOnStartup', false, vscode.ConfigurationTarget.Global);
	}
}

export type ArgTemplateCtx = {
	regex?: string;
	file?: string;
	dir?: string;
	line?: number;
	selection?: string;
};

export function substituteArgs(template: string[], ctx: ArgTemplateCtx): string[] {
	const replacer = (s: string) =>
		s
			.replaceAll('{regex}', ctx.regex ?? '')
			.replaceAll('{file}', ctx.file ?? '')
			.replaceAll('{dir}', ctx.dir ?? '')
			.replaceAll('{line}', ctx.line !== undefined ? String(ctx.line) : '')
			.replaceAll('{selection}', ctx.selection ?? '');
	return template.map(replacer);
}

export function getActiveEditorContext(): ArgTemplateCtx {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		return {};
	}
	const doc = editor.document;
	const file = doc.uri.fsPath;
	const dir = path.dirname(file);
	const selection = editor.selection;
	const selectedText = doc.getText(selection);
	const line = selection.active.line + 1; // 1-based
	return { file, dir, selection: selectedText, line };
}

function getCurrentRegexFromFindWidget(): string | undefined {
	// VS Code does not expose find widget state via public API. As a fallback, we reuse last selection
	// or a stored value from globalState if previously provided by the user.
	return undefined;
}

async function ensureExecutablePath(configKey: string, displayName: string): Promise<string | undefined> {
	const cfg = vscode.workspace.getConfiguration();
	let exePath = cfg.get<string>(configKey);
	if (!exePath || !fs.existsSync(exePath)) {
		const chosen = await vscode.window.showOpenDialog({
			canSelectFiles: true,
			canSelectFolders: false,
			canSelectMany: false,
			title: vscode.l10n.t('dialog.locateExecutable', displayName),
			filters: { 'Executable': ['exe'] }
		});
		if (!chosen || chosen.length === 0) {
			return undefined;
		}
		exePath = chosen[0].fsPath;
		await cfg.update(configKey, exePath, vscode.ConfigurationTarget.Global);
	}
	return exePath;
}

async function runExternal(displayName: string, exePath: string, preArgs: string[], argsTemplate: string[], ctx: ArgTemplateCtx) {
	// Always identify caller app name; other integration flags are configurable via settings
	const requiredFixed = ['-appname', 'Visual Studio Code'];
	const args = [...preArgs, ...requiredFixed, ...substituteArgs(argsTemplate, ctx)];
	try {
		cp.spawn(exePath, args, { detached: true, stdio: 'ignore' }).unref();
	} catch (err: any) {
		vscode.window.showErrorMessage(vscode.l10n.t('error.launchFailed', displayName, err?.message ?? String(err)));
	}
}

export function autodetectExecutables(): Array<{ name: string; version: string; path: string; configKey: string }> {
	const detected: Array<{ name: string; version: string; path: string; configKey: string }> = [];
	
	// Check for RegexBuddy (version 5 first, then 4)
	const regexBuddy5Path = 'C:\\Program Files\\Just Great Software\\RegexBuddy 5\\RegexBuddy5.exe';
	const regexBuddy4Path = 'C:\\Program Files\\Just Great Software\\RegexBuddy 4\\RegexBuddy4.exe';
	
	if (fs.existsSync(regexBuddy5Path)) {
		detected.push({ name: 'RegexBuddy', version: '5', path: regexBuddy5Path, configKey: 'regex-jgs-launcher.regexBuddy.path' });
	} else if (fs.existsSync(regexBuddy4Path)) {
		detected.push({ name: 'RegexBuddy', version: '4', path: regexBuddy4Path, configKey: 'regex-jgs-launcher.regexBuddy.path' });
	}
	
	// Check for RegexMagic (version 2 only)
	const regexMagic2Path = 'C:\\Program Files\\Just Great Software\\RegexMagic 2\\RegexMagic2.exe';
	if (fs.existsSync(regexMagic2Path)) {
		detected.push({ name: 'RegexMagic', version: '2', path: regexMagic2Path, configKey: 'regex-jgs-launcher.regexMagic.path' });
	}
	
	return detected;
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "regex-jgs-launcher" is now active!');

	// Command: show a guide on resetting in other profiles
	const showResetGuide = vscode.commands.registerCommand('regex-jgs-launcher.showResetGuide', async () => {
		const message = safeL10n('message.resetGuide', 'JGS Regex Launcher reset affects only the current VS Code profile. To reset another profile, switch profiles (Command Palette → Profiles: Switch Profile), then run "JGS Regex Launcher: Reset All Settings" in that profile, or remove "regex-jgs-launcher.*" keys from Settings (JSON). Profiles isolate Global (application) settings per profile; extensions cannot modify settings in other profiles.');
		const choice = await vscode.window.showInformationMessage(message, safeL10n('button.openProfilesSwitch', 'Open Profiles: Switch Profile'), safeL10n('button.close', 'Close'));
		if (choice === safeL10n('button.openProfilesSwitch', 'Open Profiles: Switch Profile')) {
			await vscode.commands.executeCommand('workbench.profiles.actions.switchProfile');
		}
	});

	// Command to reset all settings with confirmation
	const resetAllSettings = vscode.commands.registerCommand('regex-jgs-launcher.resetAllSettings', async () => {
		const confirmation = await vscode.window.showWarningMessage(
			safeL10n('message.resetConfirmation', 'Are you sure you want to reset JGS Regex Launcher settings to defaults for this profile?\n\nThis will (in the current profile):\n• Disable all integrations\n• Clear executable paths\n• Reset argument templates\n• Re-enable the onboarding prompt\n\nOther profiles are not affected. This action cannot be undone.'),
			{ modal: true },
			safeL10n('button.yesReset', 'Yes, Reset Everything'),
			safeL10n('button.cancel', 'Cancel')
		);
		
		const yesResetBtn = safeL10n('button.yesReset', 'Yes, Reset Everything');
		if (confirmation === yesResetBtn) {
			const cfg = vscode.workspace.getConfiguration();
			// Re-enable onboarding prompt so users see setup again after reset
			await cfg.update('regex-jgs-launcher.onboarding.showOnStartup', true, vscode.ConfigurationTarget.Global);
			
			// Reset all JGS settings by clearing them (this reverts to defaults)
			await cfg.update('regex-jgs-launcher.regexBuddy.enabled', undefined, vscode.ConfigurationTarget.Global);
			await cfg.update('regex-jgs-launcher.regexBuddy.path', undefined, vscode.ConfigurationTarget.Global);
			await cfg.update('regex-jgs-launcher.regexBuddy.preArgs', undefined, vscode.ConfigurationTarget.Global);
			await cfg.update('regex-jgs-launcher.regexBuddy.args', undefined, vscode.ConfigurationTarget.Global);
			await cfg.update('regex-jgs-launcher.regexBuddy.sample.args', undefined, vscode.ConfigurationTarget.Global);
			await cfg.update('regex-jgs-launcher.regexBuddy.sample.preArgs', undefined, vscode.ConfigurationTarget.Global);
			
			await cfg.update('regex-jgs-launcher.regexMagic.enabled', undefined, vscode.ConfigurationTarget.Global);
			await cfg.update('regex-jgs-launcher.regexMagic.path', undefined, vscode.ConfigurationTarget.Global);
			await cfg.update('regex-jgs-launcher.regexMagic.preArgs', undefined, vscode.ConfigurationTarget.Global);
			await cfg.update('regex-jgs-launcher.regexMagic.args', undefined, vscode.ConfigurationTarget.Global);
			
			const post = await vscode.window.showInformationMessage(safeL10n('message.resetComplete', 'All JGS Regex Launcher settings have been reset to defaults for this profile. Need help resetting other profiles?'), safeL10n('button.showResetGuide', 'Show Reset Guide'), safeL10n('button.close', 'Close'));
			const showResetGuideBtn = safeL10n('button.showResetGuide', 'Show Reset Guide');
			if (post === showResetGuideBtn) {
				await vscode.commands.executeCommand('regex-jgs-launcher.showResetGuide');
			}
		}
	});

	// Command to re-run onboarding on demand
	const showSetup = vscode.commands.registerCommand('regex-jgs-launcher.showSetup', async () => {
		const cfg = vscode.workspace.getConfiguration();
		
		// Auto-detect executables
		const detected = autodetectExecutables();
		
		// Build quick pick items with detection results
		const rbEnabled = cfg.get<boolean>('regex-jgs-launcher.regexBuddy.enabled') ?? false;
		const rmEnabled = cfg.get<boolean>('regex-jgs-launcher.regexMagic.enabled') ?? false;
		
		const regexBuddyDetected = detected.find(d => d.name === 'RegexBuddy');
		const regexMagicDetected = detected.find(d => d.name === 'RegexMagic');
		
		const rbLabel = regexBuddyDetected 
			? `${safeL10n('quickPick.enableRegexBuddy', 'Enable RegexBuddy')} (v${regexBuddyDetected.version} detected)`
			: safeL10n('quickPick.enableRegexBuddy', 'Enable RegexBuddy');
		const rmLabel = regexMagicDetected 
			? `${safeL10n('quickPick.enableRegexMagic', 'Enable RegexMagic')} (v${regexMagicDetected.version} detected)`
			: safeL10n('quickPick.enableRegexMagic', 'Enable RegexMagic');
		
		const picked = await vscode.window.showQuickPick(
			[
				{ label: rbLabel, picked: rbEnabled },
				{ label: rmLabel, picked: rmEnabled }
			],
			{ canPickMany: true, title: safeL10n('quickPick.enableIntegrations', 'Enable integrations') }
		);
		if (!picked) { return; }
		
		const enableBuddy = picked.some(p => p.label.includes('RegexBuddy'));
		const enableMagic = picked.some(p => p.label.includes('RegexMagic'));
		
		// Update enabled states
		await cfg.update('regex-jgs-launcher.regexBuddy.enabled', enableBuddy, vscode.ConfigurationTarget.Global);
		await cfg.update('regex-jgs-launcher.regexMagic.enabled', enableMagic, vscode.ConfigurationTarget.Global);
		
		// Auto-set paths for detected executables if they were enabled
		if (enableBuddy && regexBuddyDetected) {
			await cfg.update(regexBuddyDetected.configKey, regexBuddyDetected.path, vscode.ConfigurationTarget.Global);
		}
		if (enableMagic && regexMagicDetected) {
			await cfg.update(regexMagicDetected.configKey, regexMagicDetected.path, vscode.ConfigurationTarget.Global);
		}
		
		vscode.window.showInformationMessage(safeL10n('message.settingsUpdated', 'Settings updated. Executable paths will be prompted for as needed.'));
		// Suppress future onboarding prompts after successful setup
		await cfg.update('regex-jgs-launcher.onboarding.showOnStartup', false, vscode.ConfigurationTarget.Global);
	});

	const launchRegexBuddy = vscode.commands.registerCommand('regex-jgs-launcher.launchRegexBuddy', async () => {
		const cfg = vscode.workspace.getConfiguration();
		const enabled = cfg.get<boolean>('regex-jgs-launcher.regexBuddy.enabled');
		if (!enabled) {
			vscode.window.showInformationMessage(safeL10n('message.regexBuddyDisabled', 'RegexBuddy integration is disabled in settings.'));
			return;
		}
		const exePath = await ensureExecutablePath('regex-jgs-launcher.regexBuddy.path', 'RegexBuddy');
		if (!exePath) { return; }
		const argsTemplate = cfg.get<string[]>('regex-jgs-launcher.regexBuddy.args') ?? [];
		const preArgs = cfg.get<string[]>('regex-jgs-launcher.regexBuddy.preArgs') ?? ['-getfromclipboard', '-putonclipboard'];
		const editorCtx = getActiveEditorContext();
		// Best-effort to get a regex: prefer selection, else ask
		let regex = editorCtx.selection && editorCtx.selection.length > 0 ? editorCtx.selection : undefined;
		if (!regex) {
			regex = await vscode.window.showInputBox({ prompt: vscode.l10n.t('input.enterRegexForBuddy'), value: '' });
		}
		// Place regex on clipboard so the tool can read it
		if (regex !== undefined) {
			await vscode.env.clipboard.writeText(regex);
		}
		await runExternal('RegexBuddy', exePath, preArgs, argsTemplate, { ...editorCtx, regex });
	});

	const launchRegexMagic = vscode.commands.registerCommand('regex-jgs-launcher.launchRegexMagic', async () => {
		const cfg = vscode.workspace.getConfiguration();
		const enabled = cfg.get<boolean>('regex-jgs-launcher.regexMagic.enabled');
		if (!enabled) {
			vscode.window.showInformationMessage(vscode.l10n.t('message.regexMagicDisabled'));
			return;
		}
		const exePath = await ensureExecutablePath('regex-jgs-launcher.regexMagic.path', 'RegexMagic');
		if (!exePath) { return; }
		const argsTemplate = cfg.get<string[]>('regex-jgs-launcher.regexMagic.args') ?? [];
		const preArgs = cfg.get<string[]>('regex-jgs-launcher.regexMagic.preArgs') ?? ['-sampleclipboard', '-putonclipboard'];
		const editorCtx = getActiveEditorContext();
		let regex = editorCtx.selection && editorCtx.selection.length > 0 ? editorCtx.selection : undefined;
		if (!regex) {
			regex = await vscode.window.showInputBox({ prompt: vscode.l10n.t('input.enterRegexForMagic'), value: '' });
		}
		if (regex !== undefined) {
			await vscode.env.clipboard.writeText(regex);
		}
		await runExternal('RegexMagic', exePath, preArgs, argsTemplate, { ...editorCtx, regex });
	});

	const launchRegexBuddySample = vscode.commands.registerCommand('regex-jgs-launcher.launchRegexBuddySample', async () => {
		const cfg = vscode.workspace.getConfiguration();
		const enabled = cfg.get<boolean>('regex-jgs-launcher.regexBuddy.enabled');
		if (!enabled) {
			vscode.window.showInformationMessage(safeL10n('message.regexBuddyDisabled', 'RegexBuddy integration is disabled in settings.'));
			return;
		}
		const exePath = await ensureExecutablePath('regex-jgs-launcher.regexBuddy.path', 'RegexBuddy');
		if (!exePath) { return; }
		const argsTemplate = cfg.get<string[]>('regex-jgs-launcher.regexBuddy.sample.args') ?? [];
		const preArgs = cfg.get<string[]>('regex-jgs-launcher.regexBuddy.sample.preArgs') ?? ['-sampleclipboard', '-putonclipboard'];
		const editorCtx = getActiveEditorContext();
		const sample = editorCtx.selection && editorCtx.selection.length > 0 ? editorCtx.selection : '';
		await vscode.env.clipboard.writeText(sample);
		await runExternal('RegexBuddy (Sample)', exePath, preArgs, argsTemplate, { ...editorCtx, regex: undefined });
	});

	// Command to auto-detect executable paths
	const autodetectPaths = vscode.commands.registerCommand('regex-jgs-launcher.autodetectPaths', async () => {
		const cfg = vscode.workspace.getConfiguration();
		
		// Show searching message
		vscode.window.withProgress({
			location: vscode.ProgressLocation.Notification,
			title: safeL10n('message.autodetectSearching', 'Searching for RegexBuddy and RegexMagic installations...'),
			cancellable: false
		}, async () => {
			const detected = autodetectExecutables();
			
			if (detected.length === 0) {
				vscode.window.showInformationMessage(safeL10n('message.autodetectNoneFound', 'No RegexBuddy or RegexMagic installations found in standard locations.\n\nSearched for:\n• RegexBuddy 5: C:\\Program Files\\Just Great Software\\RegexBuddy 5\\RegexBuddy5.exe\n• RegexBuddy 4: C:\\Program Files\\Just Great Software\\RegexBuddy 4\\RegexBuddy4.exe\n• RegexMagic 2: C:\\Program Files\\Just Great Software\\RegexMagic 2\\RegexMagic2.exe'));
				return;
			}
			
			let updatedCount = 0;
			const updateSummary: string[] = [];
			
			for (const item of detected) {
				const currentPath = cfg.get<string>(item.configKey);
				
				if (currentPath !== item.path) {
					const message = vscode.l10n.t('message.autodetectFound', item.name + ' v' + item.version, item.path);
					const choice = await vscode.window.showInformationMessage(
						message,
						vscode.l10n.t('button.updatePath'),
						vscode.l10n.t('button.skipThis')
					);
					
					if (choice === vscode.l10n.t('button.updatePath')) {
						await cfg.update(item.configKey, item.path, vscode.ConfigurationTarget.Global);
						updatedCount++;
						updateSummary.push(`${item.name} v${item.version}: ${item.path}`);
					}
				}
			}
			
			if (updatedCount > 0) {
				vscode.window.showInformationMessage(
					vscode.l10n.t('message.autodetectSummary', updateSummary.join('\n'), updatedCount.toString())
				);
			} else {
				vscode.window.showInformationMessage(safeL10n('message.autodetectNoUpdates', 'Auto-detection complete. No path settings were updated.'));
			}
		});
	});

	context.subscriptions.push(showResetGuide, resetAllSettings, showSetup, autodetectPaths, launchRegexBuddy, launchRegexBuddySample, launchRegexMagic);

	// Defer onboarding until after all commands are registered and l10n system is ready
	// This ensures localization works properly during onboarding
	setTimeout(async () => {
		// Wait a bit more for l10n to be fully loaded
		let attempts = 0;
		const maxAttempts = 10;
		
		while (attempts < maxAttempts && !isL10nReady()) {
			await new Promise(resolve => setTimeout(resolve, 100));
			attempts++;
		}
		
		// Show onboarding (will use safe fallbacks if l10n still isn't ready)
		await showOnboardingIfNeeded();
	}, 500);
}

// This method is called when your extension is deactivated
export function deactivate() {}
