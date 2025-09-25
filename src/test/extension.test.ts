import * as assert from 'assert';
import * as path from 'path';
import * as vscode from 'vscode';
import { substituteArgs, getActiveEditorContext, ArgTemplateCtx } from '../extension';

suite('JGS Regex Launcher Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start JGS Regex Launcher tests.');

	suite('substituteArgs', () => {
		test('should substitute all placeholders correctly', () => {
			const template = ['-e', '{regex}', '-f', '{file}', '-d', '{dir}', '-l', '{line}', '-s', '{selection}'];
			const ctx: ArgTemplateCtx = {
				regex: 'test.*regex',
				file: 'C:\\Users\\test\\file.txt',
				dir: 'C:\\Users\\test',
				line: 42,
				selection: 'selected text'
			};

			const result = substituteArgs(template, ctx);

			assert.deepStrictEqual(result, [
				'-e', 'test.*regex',
				'-f', 'C:\\Users\\test\\file.txt',
				'-d', 'C:\\Users\\test',
				'-l', '42',
				'-s', 'selected text'
			]);
		});

		test('should handle empty/undefined context values', () => {
			const template = ['-e', '{regex}', '-f', '{file}', '-l', '{line}'];
			const ctx: ArgTemplateCtx = {}; // Empty context

			const result = substituteArgs(template, ctx);

			assert.deepStrictEqual(result, ['-e', '', '-f', '', '-l', '']);
		});

		test('should handle partial context', () => {
			const template = ['{regex}', '{file}', '{dir}', '{line}', '{selection}'];
			const ctx: ArgTemplateCtx = {
				regex: 'pattern',
				line: 10
				// file, dir, selection are undefined
			};

			const result = substituteArgs(template, ctx);

			assert.deepStrictEqual(result, ['pattern', '', '', '10', '']);
		});

		test('should handle templates without placeholders', () => {
			const template = ['-static', 'value', '--flag'];
			const ctx: ArgTemplateCtx = {
				regex: 'test',
				file: 'test.txt'
			};

			const result = substituteArgs(template, ctx);

			assert.deepStrictEqual(result, ['-static', 'value', '--flag']);
		});

		test('should handle empty template array', () => {
			const template: string[] = [];
			const ctx: ArgTemplateCtx = {
				regex: 'test'
			};

			const result = substituteArgs(template, ctx);

			assert.deepStrictEqual(result, []);
		});

		test('should handle multiple occurrences of same placeholder', () => {
			const template = ['{regex}', 'and', '{regex}', 'again'];
			const ctx: ArgTemplateCtx = {
				regex: 'pattern'
			};

			const result = substituteArgs(template, ctx);

			assert.deepStrictEqual(result, ['pattern', 'and', 'pattern', 'again']);
		});

		test('should handle line number zero correctly', () => {
			const template = ['-l', '{line}'];
			const ctx: ArgTemplateCtx = {
				line: 0
			};

			const result = substituteArgs(template, ctx);

			assert.deepStrictEqual(result, ['-l', '0']);
		});

		test('should handle special characters in context values', () => {
			const template = ['-regex', '{regex}', '-file', '{file}'];
			const ctx: ArgTemplateCtx = {
				regex: '\\d+\\.\\d+',
				file: 'C:\\Program Files\\Test App\\file (copy).txt'
			};

			const result = substituteArgs(template, ctx);

			assert.deepStrictEqual(result, [
				'-regex', '\\d+\\.\\d+',
				'-file', 'C:\\Program Files\\Test App\\file (copy).txt'
			]);
		});
	});

	suite('getActiveEditorContext', () => {
		test('should return empty context when no active editor', async () => {
			// Close all editors to ensure no active editor
			await vscode.commands.executeCommand('workbench.action.closeAllEditors');

			const result = getActiveEditorContext();

			assert.deepStrictEqual(result, {});
		});

		test('should return context with file information when editor is active', async () => {
			// Create a temporary document for testing
			const doc = await vscode.workspace.openTextDocument({
				content: 'Line 1\nLine 2\nLine 3\nSelected text here\nLine 5',
				language: 'plaintext'
			});
			const editor = await vscode.window.showTextDocument(doc);

			// Set selection to "Selected text here" on line 4
			const startPos = new vscode.Position(3, 0);
			const endPos = new vscode.Position(3, 18);
			editor.selection = new vscode.Selection(startPos, endPos);

			const result = getActiveEditorContext();

			// Verify the context contains expected data
			assert.ok(result.file, 'Should have file path');
			assert.ok(result.dir, 'Should have directory');
			assert.strictEqual(result.line, 4, 'Should be 1-based line number');
			assert.strictEqual(result.selection, 'Selected text here', 'Should have selected text');

			// Clean up
			await vscode.commands.executeCommand('workbench.action.closeAllEditors');
		});

		test('should handle empty selection', async () => {
			const doc = await vscode.workspace.openTextDocument({
				content: 'Test content',
				language: 'plaintext'
			});
			const editor = await vscode.window.showTextDocument(doc);

			// Set cursor position without selection
			const pos = new vscode.Position(0, 5);
			editor.selection = new vscode.Selection(pos, pos);

			const result = getActiveEditorContext();

			assert.ok(result.file, 'Should have file path');
			assert.ok(result.dir, 'Should have directory');
			assert.strictEqual(result.line, 1, 'Should be line 1');
			assert.strictEqual(result.selection, '', 'Should have empty selection');

			// Clean up
			await vscode.commands.executeCommand('workbench.action.closeAllEditors');
		});
	});

	suite('Integration scenarios', () => {
		test('should create proper RegexBuddy command args', () => {
			const preArgs = ['-getfromclipboard', '-putonclipboard'];
			const argsTemplate = ['-t', 'ECMAScript', '-e', '{regex}'];
			const ctx: ArgTemplateCtx = {
				regex: '\\d{3}-\\d{2}-\\d{4}',
				file: 'C:\\test\\file.js',
				dir: 'C:\\test',
				line: 15,
				selection: '123-45-6789'
			};

			// Simulate the command construction
			const requiredFixed = ['-appname', 'Visual Studio Code'];
			const processedArgs = substituteArgs(argsTemplate, ctx);
			const finalArgs = [...preArgs, ...requiredFixed, ...processedArgs];

			const expected = [
				'-getfromclipboard', '-putonclipboard',
				'-appname', 'Visual Studio Code',
				'-t', 'ECMAScript',
				'-e', '\\d{3}-\\d{2}-\\d{4}'
			];

			assert.deepStrictEqual(finalArgs, expected);
		});

		test('should create proper RegexMagic command args', () => {
			const preArgs = ['-sampleclipboard', '-putonclipboard'];
			const argsTemplate = ['-pattern', '{regex}', '-file', '{file}'];
			const ctx: ArgTemplateCtx = {
				regex: 'test pattern',
				file: 'C:\\workspace\\data.txt',
				dir: 'C:\\workspace',
				line: 1,
				selection: 'test pattern'
			};

			const requiredFixed = ['-appname', 'Visual Studio Code'];
			const processedArgs = substituteArgs(argsTemplate, ctx);
			const finalArgs = [...preArgs, ...requiredFixed, ...processedArgs];

			const expected = [
				'-sampleclipboard', '-putonclipboard',
				'-appname', 'Visual Studio Code',
				'-pattern', 'test pattern',
				'-file', 'C:\\workspace\\data.txt'
			];

			assert.deepStrictEqual(finalArgs, expected);
		});

		test('should handle RegexBuddy sample mode args', () => {
			const preArgs = ['-testclipboard', '-putonclipboard'];
			const argsTemplate: string[] = []; // Empty template for sample mode
			const ctx: ArgTemplateCtx = {
				selection: 'sample text to test against',
				file: 'C:\\project\\test.txt',
				dir: 'C:\\project',
				line: 10
			};

			const requiredFixed = ['-appname', 'Visual Studio Code'];
			const processedArgs = substituteArgs(argsTemplate, ctx);
			const finalArgs = [...preArgs, ...requiredFixed, ...processedArgs];

			const expected = [
				'-testclipboard', '-putonclipboard',
				'-appname', 'Visual Studio Code'
			];

			assert.deepStrictEqual(finalArgs, expected);
		});
	});

	suite('Edge cases and error conditions', () => {
		test('should handle null and undefined gracefully in substituteArgs', () => {
			const template = ['{regex}', '{file}', '{selection}'];

			// Test with completely undefined context
			let result = substituteArgs(template, {});
			assert.deepStrictEqual(result, ['', '', '']);

			// Test with undefined and empty string values (should be treated as empty)
			const nullishCtx = {
				regex: undefined,
				file: '',
				selection: undefined
			} as ArgTemplateCtx;

			result = substituteArgs(template, nullishCtx);
			assert.deepStrictEqual(result, ['', '', '']);
		});

		test('should handle very long placeholder values', () => {
			const longValue = 'a'.repeat(1000);
			const template = ['--long-value', '{regex}'];
			const ctx: ArgTemplateCtx = {
				regex: longValue
			};

			const result = substituteArgs(template, ctx);

			assert.strictEqual(result[1], longValue);
			assert.strictEqual(result[1].length, 1000);
		});

		test('should handle Windows file paths correctly', () => {
			const template = ['-file', '{file}', '-dir', '{dir}'];
			const ctx: ArgTemplateCtx = {
				file: 'C:\\Program Files (x86)\\Test\\file with spaces.txt',
				dir: 'C:\\Program Files (x86)\\Test'
			};

			const result = substituteArgs(template, ctx);

			assert.deepStrictEqual(result, [
				'-file', 'C:\\Program Files (x86)\\Test\\file with spaces.txt',
				'-dir', 'C:\\Program Files (x86)\\Test'
			]);
		});

		test('should handle Unicode characters in placeholders', () => {
			const template = ['-pattern', '{regex}', '-text', '{selection}'];
			const ctx: ArgTemplateCtx = {
				regex: '[\\p{L}\\p{N}]+', // Unicode regex pattern
				selection: 'Hello 世界 🌍 Здравствуй мир'
			};

			const result = substituteArgs(template, ctx);

			assert.deepStrictEqual(result, [
				'-pattern', '[\\p{L}\\p{N}]+',
				'-text', 'Hello 世界 🌍 Здравствуй мир'
			]);
		});
	});
});
