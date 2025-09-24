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
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "regex-jgs-launcher" is now active!');

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

	context.subscriptions.push(launchRegexBuddy, launchRegexBuddySample, launchRegexMagic);
}

// This method is called when your extension is deactivated
export function deactivate() {}
