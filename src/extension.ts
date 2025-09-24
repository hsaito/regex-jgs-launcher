// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as cp from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

type ArgTemplateCtx = {
	regex?: string;
	file?: string;
	dir?: string;
	line?: number;
	selection?: string;
};

function substituteArgs(template: string[], ctx: ArgTemplateCtx): string[] {
	const replacer = (s: string) =>
		s
			.replaceAll('{regex}', ctx.regex ?? '')
			.replaceAll('{file}', ctx.file ?? '')
			.replaceAll('{dir}', ctx.dir ?? '')
			.replaceAll('{line}', ctx.line !== undefined ? String(ctx.line) : '')
			.replaceAll('{selection}', ctx.selection ?? '');
	return template.map(replacer);
}

function getActiveEditorContext(): ArgTemplateCtx {
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
			title: `Locate ${displayName} executable`,
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
		vscode.window.showErrorMessage(`${displayName} failed to launch: ${err?.message ?? String(err)}`);
	}
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "regex-jgs-launcher" is now active!');

	async function runOnboardingOnce() {
		const ONBOARD_KEY = 'onboardingCompletedV1';
		const alreadyCompleted = context.globalState.get<boolean>(ONBOARD_KEY);
		console.log(`Onboarding check: completed=${alreadyCompleted}`);
		if (alreadyCompleted) {
			return;
		}
		const cfg = vscode.workspace.getConfiguration();
		const buddyEnabled = cfg.get<boolean>('regex-jgs-launcher.regexBuddy.enabled') ?? false;
		const magicEnabled = cfg.get<boolean>('regex-jgs-launcher.regexMagic.enabled') ?? false;
		console.log(`Settings check: buddy=${buddyEnabled}, magic=${magicEnabled}`);
		if (buddyEnabled || magicEnabled) {
			await context.globalState.update(ONBOARD_KEY, true);
			console.log('Skipping onboarding - tools already enabled');
			return;
		}

		console.log('Starting onboarding flow');
		const pick = await vscode.window.showQuickPick(
			[
				{ label: 'Enable RegexBuddy', picked: true },
				{ label: 'Enable RegexMagic', picked: false },
			],
			{ canPickMany: true, title: 'Enable JGsoft integrations to get started' }
		);
		if (!pick || pick.length === 0) {
			// User dismissed. Don't mark as completed so we can re-prompt next activation.
			return;
		}
		const enableBuddy = pick.some(p => p.label.includes('RegexBuddy'));
		const enableMagic = pick.some(p => p.label.includes('RegexMagic'));
		if (enableBuddy) {
			await cfg.update('regex-jgs-launcher.regexBuddy.enabled', true, vscode.ConfigurationTarget.Global);
		}
		if (enableMagic) {
			await cfg.update('regex-jgs-launcher.regexMagic.enabled', true, vscode.ConfigurationTarget.Global);
		}

		const locate = await vscode.window.showInformationMessage(
			'Would you like to set executable path(s) now?',
			'Yes', 'Later'
		);
		if (locate === 'Yes') {
			if (enableBuddy) {
				await ensureExecutablePath('regex-jgs-launcher.regexBuddy.path', 'RegexBuddy');
			}
			if (enableMagic) {
				await ensureExecutablePath('regex-jgs-launcher.regexMagic.path', 'RegexMagic');
			}
		}

		await context.globalState.update(ONBOARD_KEY, true);
	}

	// Kick off onboarding in the background (non-blocking)
	runOnboardingOnce();

	// Command to reset all settings with confirmation
	const resetAllSettings = vscode.commands.registerCommand('regex-jgs-launcher.resetAllSettings', async () => {
		const confirmation = await vscode.window.showWarningMessage(
			'Are you sure you want to reset ALL JGS Regex Launcher settings to defaults?\n\nThis will:\n• Disable all integrations\n• Clear executable paths\n• Reset argument templates\n• Clear onboarding state\n\nThis action cannot be undone.',
			{ modal: true },
			'Yes, Reset Everything',
			'Cancel'
		);
		
		if (confirmation === 'Yes, Reset Everything') {
			const cfg = vscode.workspace.getConfiguration();
			
			// Clear the onboarding state
			await context.globalState.update('onboardingCompletedV1', undefined);
			
			// Reset all JGS settings by clearing them (this reverts to defaults)
			await cfg.update('regex-jgs-launcher.regexBuddy.enabled', undefined, vscode.ConfigurationTarget.Global);
			await cfg.update('regex-jgs-launcher.regexBuddy.path', undefined, vscode.ConfigurationTarget.Global);
			await cfg.update('regex-jgs-launcher.regexBuddy.preArgs', undefined, vscode.ConfigurationTarget.Global);
			await cfg.update('regex-jgs-launcher.regexBuddy.args', undefined, vscode.ConfigurationTarget.Global);
			await cfg.update('regex-jgs-launcher.regexBuddy.sample.preArgs', undefined, vscode.ConfigurationTarget.Global);
			await cfg.update('regex-jgs-launcher.regexBuddy.sample.args', undefined, vscode.ConfigurationTarget.Global);
			
			await cfg.update('regex-jgs-launcher.regexMagic.enabled', undefined, vscode.ConfigurationTarget.Global);
			await cfg.update('regex-jgs-launcher.regexMagic.path', undefined, vscode.ConfigurationTarget.Global);
			await cfg.update('regex-jgs-launcher.regexMagic.preArgs', undefined, vscode.ConfigurationTarget.Global);
			await cfg.update('regex-jgs-launcher.regexMagic.args', undefined, vscode.ConfigurationTarget.Global);
			
			vscode.window.showInformationMessage('All JGS Regex Launcher settings have been reset to defaults. Use any regex command to start fresh setup.');
		}
	});

	// Command to re-run onboarding on demand
	const configureIntegrations = vscode.commands.registerCommand('regex-jgs-launcher.configureIntegrations', async () => {
		// Force run onboarding by creating a modified version that skips the "already enabled" check
		const cfg = vscode.workspace.getConfiguration();
		const pick = await vscode.window.showQuickPick(
			[
				{ label: 'Enable RegexBuddy', picked: cfg.get<boolean>('regex-jgs-launcher.regexBuddy.enabled') ?? false },
				{ label: 'Enable RegexMagic', picked: cfg.get<boolean>('regex-jgs-launcher.regexMagic.enabled') ?? false },
			],
			{ canPickMany: true, title: 'Configure JGsoft integrations' }
		);
		if (!pick) {
			return; // User cancelled
		}
		
		const enableBuddy = pick.some(p => p.label.includes('RegexBuddy'));
		const enableMagic = pick.some(p => p.label.includes('RegexMagic'));
		
		await cfg.update('regex-jgs-launcher.regexBuddy.enabled', enableBuddy, vscode.ConfigurationTarget.Global);
		await cfg.update('regex-jgs-launcher.regexMagic.enabled', enableMagic, vscode.ConfigurationTarget.Global);

		if (enableBuddy || enableMagic) {
			vscode.window.showInformationMessage('Integration settings updated! The executable paths will be requested automatically when you first use each tool.');
		}
	});

	const launchRegexBuddy = vscode.commands.registerCommand('regex-jgs-launcher.launchRegexBuddy', async () => {
		const cfg = vscode.workspace.getConfiguration();
		const enabled = cfg.get<boolean>('regex-jgs-launcher.regexBuddy.enabled');
		if (!enabled) {
			vscode.window.showInformationMessage('RegexBuddy integration is disabled in settings.');
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
			regex = await vscode.window.showInputBox({ prompt: 'Enter regex to send to RegexBuddy (optional)', value: '' });
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
			vscode.window.showInformationMessage('RegexMagic integration is disabled in settings.');
			return;
		}
		const exePath = await ensureExecutablePath('regex-jgs-launcher.regexMagic.path', 'RegexMagic');
		if (!exePath) { return; }
		const argsTemplate = cfg.get<string[]>('regex-jgs-launcher.regexMagic.args') ?? [];
		const preArgs = cfg.get<string[]>('regex-jgs-launcher.regexMagic.preArgs') ?? ['-getfromclipboard', '-putonclipboard'];
		const editorCtx = getActiveEditorContext();
		let regex = editorCtx.selection && editorCtx.selection.length > 0 ? editorCtx.selection : undefined;
		if (!regex) {
			regex = await vscode.window.showInputBox({ prompt: 'Enter regex to send to RegexMagic (optional)', value: '' });
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
			vscode.window.showInformationMessage('RegexBuddy integration is disabled in settings.');
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

	context.subscriptions.push(resetAllSettings, configureIntegrations, launchRegexBuddy, launchRegexBuddySample, launchRegexMagic);
}

// This method is called when your extension is deactivated
export function deactivate() {}
