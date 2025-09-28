# Localization Support

This extension supports Japanese localization in addition to English.

## Supported Languages

- **English** (default): `bundle.l10n.json`
- **Japanese** (日本語): `bundle.l10n.ja.json`

## How VS Code Language Detection Works

VS Code automatically selects the appropriate language based on your VS Code language setting:

1. **To use Japanese UI**: 
   - Open VS Code
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
   - Type "Configure Display Language"
   - Select "日本語 (Japanese)"
   - Restart VS Code

2. **To use English UI**:
   - Follow the same steps but select "English"

## What Gets Localized

The following elements are localized:

- **Command names** in Command Palette (using `contributes.commands.*.title` keys)
- **Command categories** in Command Palette (using `contributes.commands.*.category` keys)
- **Configuration descriptions** in Settings (using `contributes.configuration.properties.*.description` keys)
- **User messages** (dialogs, notifications, error messages) in TypeScript code using `vscode.l10n.t()`
- **Input prompts** and dialog titles

## File Structure

```
l10n/
├── bundle.l10n.json      # English (default)
└── bundle.l10n.ja.json   # Japanese
```

## Localization Key Structure

VS Code uses a specific key structure for package.json localization:

- **Commands**: `contributes.commands.{commandId}.title`
- **Categories**: `contributes.commands.{commandId}.category`
- **Configuration**: `contributes.configuration.properties.{propertyName}.description`
- **Runtime messages**: Custom keys used with `vscode.l10n.t()` in TypeScript code

## Adding More Languages

To add support for additional languages:

1. Create a new file: `l10n/bundle.l10n.[language-code].json`
2. Copy the structure from `bundle.l10n.json`
3. Translate all values to the target language
4. Test with VS Code set to that language

## Technical Implementation

The extension uses:
- VS Code's built-in localization API (`vscode.l10n.t()`) for runtime messages (VS Code 1.73+)
- VS Code's automatic package.json contribution localization using l10n bundle files
- Standard VS Code l10n bundle format with proper key naming conventions