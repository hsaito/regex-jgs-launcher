# JGS Regex Launcher

This VS Code extension lets you quickly launch RegexBuddy and RegexMagic from **Quick start:**

1. On first launch, you'll see a prompt to enable RegexBuddy and/or RegexMagic with **auto-detection** of installed versions. The extension will automatically find and configure paths for detected installations.
2. If auto-detection doesn't find your installation, or you want to manually update paths later, use the "Auto-detect Executable Paths" command or manually set paths in Settings.
3. Optionally define argument templates using placeholders.
4. **Use the tools**:
   - **RegexBuddy**: Select text and use as regex pattern to test/edit, or use sample mode to test regex against sample text
   - **RegexMagic**: Select sample text to generate new regex patterns (RegexMagic creates regex, it doesn't edit existing ones)at Software (JGsoft) directly from VS Code, passing the current selection, file, or folder context.

**Publisher:** Hideki Saito  
**Version:** 0.2.4  
**License:** MIT

## Disclaimer

This is an unofficial community extension. It is not affiliated with, endorsed by, or sponsored by Just Great Software. RegexBuddy and RegexMagic are products of Just Great Software.

## Features

- Launch [RegexBuddy](https://www.regexbuddy.com/) or [RegexMagic](https://www.regexmagic.com/) with a single command or keyboard shortcut
- **Auto-detection**: Automatically finds installed RegexBuddy (v5 preferred, then v4) and RegexMagic (v2) during setup
- Pass context from the active editor: selection text, file path, folder, and current line
- Customize executable paths and argument templates with placeholders
- Automatically applies `-appname "Visual Studio Code"`; the clipboard flags are configurable settings with sensible defaults
- Commands are only enabled when the respective tool integration is enabled in settings
- **RegexBuddy**: Two modes - normal (selection as regex pattern to test/edit) and sample mode (selection as sample text to test against)
- **RegexMagic**: Uses selection as sample text to generate regex patterns (RegexMagic specializes in creating regex from samples, not editing existing patterns)

## Requirements

- Windows with [RegexBuddy 4+](https://www.regexbuddy.com/) and/or [RegexMagic 2](https://www.regexmagic.com/) installed
- Auto-detection searches for (in priority order):
	- RegexBuddy 5: C:\\Program Files\\Just Great Software\\RegexBuddy 5\\RegexBuddy5.exe
	- RegexBuddy 4: C:\\Program Files\\Just Great Software\\RegexBuddy 4\\RegexBuddy4.exe
	- RegexMagic 2: C:\\Program Files\\Just Great Software\\RegexMagic 2\\RegexMagic2.exe
- You can override paths in Settings or use the Auto-detect command (see below)

Note on platforms: This extension officially supports Windows only because RegexBuddy and RegexMagic are Windows applications. On macOS or Linux, you might be able to run these tools under WINE or similar compatibility layers, but this is not a supported scenario and behavior may vary (for example, clipboard flags and file path handling).

Get the tools:
- RegexBuddy: https://www.regexbuddy.com/
- RegexMagic: https://www.regexmagic.com/

## Extension Settings

This extension contributes the following settings:

* `regex-jgs-launcher.onboarding.showOnStartup`: Show the setup prompt on startup (profile-specific).
* `regex-jgs-launcher.regexBuddy.path`: Full path to `RegexBuddy4.exe`.
* `regex-jgs-launcher.regexBuddy.args`: Array of argument template strings for RegexBuddy.
* `regex-jgs-launcher.regexMagic.path`: Full path to `RegexMagic2.exe`.
* `regex-jgs-launcher.regexMagic.args`: Array of argument template strings for RegexMagic.
* `regex-jgs-launcher.regexBuddy.preArgs`: Array of arguments inserted before other args for RegexBuddy (default: `-getfromclipboard`, `-putonclipboard`).
* `regex-jgs-launcher.regexMagic.preArgs`: Array of arguments inserted before other args for RegexMagic (default: `-sampleclipboard`, `-putonclipboard`).
* `regex-jgs-launcher.regexBuddy.sample.preArgs`: Array of arguments inserted before other args for RegexBuddy Sample mode (default: `-testclipboard`, `-putonclipboard`).
* `regex-jgs-launcher.regexBuddy.sample.args`: Array of argument template strings for RegexBuddy Sample mode.
* `regex-jgs-launcher.regexBuddy.enabled`: Enable/disable RegexBuddy integration (default: false).
* `regex-jgs-launcher.regexMagic.enabled`: Enable/disable RegexMagic integration (default: false).

You can use these placeholders inside argument templates:

* `{regex}` – current selection or value you enter on prompt
* `{file}` – absolute path of the active file
* `{dir}` – directory of the active file
* `{line}` – 1-based current cursor line
* `{selection}` – same as `{regex}` (for convenience)

## Known Issues

The VS Code API does not expose the Search/Replace widget content to extensions. As a workaround, the extension uses the current selection or asks you to input a regex when needed.

This extension places the regex on the clipboard before launching the external tool so flags `-getfromclipboard` and `-putonclipboard` work as intended.

**RegexMagic usage note**: RegexMagic is designed to create regex patterns from sample text, not to edit existing regex patterns. If you want to edit an existing regex, use RegexBuddy instead.

## Release Notes

- **0.2.4**: Added Japanese UI localization (commands, settings, runtime messages); added traditional `package.nls.*` plus runtime `l10n` bundles; added localization docs section; added `CONTRIBUTORS` and `CODEOWNERS` files.
- **0.2.3**: Added comprehensive unit test suite (18+ tests), GitHub Actions CI pipeline, clarified RegexMagic usage (creates regex from samples, doesn't edit existing patterns).
- **0.2.2**: Clarified reset scope (profile-only), added "Reset Guide" command and link after reset; improved RegexMagic default pre-args docs; minor text polish.  
- **0.2.1**: Patch — Fixed RegexBuddy sample mode default to `-testclipboard`.
- **0.2.0**: Added onboarding, reset command, RegexBuddy sample mode, improved command names and keybindings.
- **0.1.0**: First stable release.
- **0.0.1**: Initial preview.

## Commands

- **RegexBuddy: Use Selection as Regex** (`regex-jgs-launcher.launchRegexBuddy`) - Send selection as regex pattern to test/edit
- **RegexBuddy: Use Selection as Sample** (`regex-jgs-launcher.launchRegexBuddySample`) - Send selection as sample text to test regex against
- **RegexMagic: Use Selection as Sample** (`regex-jgs-launcher.launchRegexMagic`) - Send selection as sample text to generate new regex patterns
- **JGS Regex Launcher: Setup** (`regex-jgs-launcher.showSetup`) - Configure integrations with auto-detection
- **JGS Regex Launcher: Auto-detect Executable Paths** (`regex-jgs-launcher.autodetectPaths`) - Search for and update executable paths
- **JGS Regex Launcher: Reset All Settings** (`regex-jgs-launcher.resetAllSettings`)
- **JGS Regex Launcher: Reset Guide** (`regex-jgs-launcher.showResetGuide`)

**Default keybindings:**

- `Ctrl+Alt+Shift+R` – RegexBuddy: Use Selection as Regex (when enabled and editor focused or find widget visible)
- `Ctrl+Alt+Shift+S` – RegexBuddy: Use Selection as Sample (when enabled and editor focused or find widget visible)
- `Ctrl+Alt+Shift+M` – RegexMagic: Use Selection as Sample (when enabled and editor focused or find widget visible)

**Context menu integration:**

Commands appear in the editor context menu when there is a selection and the respective integration is enabled.

**Quick start:**

1. On first launch, you’ll see a prompt to enable RegexBuddy and/or RegexMagic. You can also enable them later in Settings (`regex-jgs-launcher.regexBuddy.enabled`, `regex-jgs-launcher.regexMagic.enabled`).
2. Set the executable path(s). If the default path does not exist, you will be prompted to locate the .exe the first time you run a command.
3. Optionally define argument templates using placeholders.
4. **Use the tools**:
   - **RegexBuddy**: Select text and use as regex pattern to test/edit, or use sample mode to test regex against sample text
   - **RegexMagic**: Select sample text to generate new regex patterns (RegexMagic creates regex, it doesn't edit existing ones)

## Development

## Localization / Japanese UI Support

This extension now supports localized UI text (commands, settings, titles) in **Japanese (ja)**.

### What is localized
- Command titles (Command Palette / context menu)
- Configuration section title and all setting descriptions / markdown descriptions
- Onboarding, reset dialogs, and runtime messages shown via the VS Code UI (using `vscode.l10n.t`)

### Technologies used
- Traditional VS Code localization: `package.nls.json` (default / English) + `package.nls.ja.json` (Japanese)
- Modern l10n runtime bundle: `l10n/bundle.l10n.json` + `l10n/bundle.l10n.ja.json` for messages coming from TypeScript code
- Fallback order: Japanese → English (default). If a key is missing in Japanese, the English string is shown.

### How to see the Japanese UI
1. Install the official Japanese Language Pack for VS Code (if not already installed).
2. Open Command Palette → type: `Configure Display Language`.
3. Select `ja` and restart VS Code.
4. Open Command Palette and search for `RegexBuddy` or `JGS` — the commands should appear in Japanese.
5. Open Settings and search for `JGS Regex` — setting titles/descriptions will be in Japanese.

### Notes
- Product names (RegexBuddy / RegexMagic) remain in English intentionally.
- File system paths and user-provided argument values are not translated.
- If you switch languages while VS Code is running, you must restart for manifest (package.json) strings to refresh.

### Contributing additional languages
If you would like to add another language:
1. Copy `package.nls.json` to `package.nls.<lang>.json` (e.g. `package.nls.fr.json`).
2. Translate only the values; keep the keys identical.
3. Copy `l10n/bundle.l10n.json` to `l10n/bundle.l10n.<lang>.json` and translate the values.
4. Use UTF-8 encoding without BOM.
5. Submit a PR. (Optional) Add yourself to the CONTRIBUTORS section if one is later added.

### Testing a new locale quickly
You can launch VS Code with a locale override (helpful before installing a language pack):
```
code --locale=ja
```
Replace `ja` with the target language code when testing new translations.

If something appears in English when you expect Japanese, the key is likely missing from `package.nls.ja.json` or the runtime bundle; search for the English phrase to find the source key.


This extension is built with TypeScript and uses the VS Code Extension API.

**Project structure:**
```
src/
├── extension.ts          # Main extension logic
└── test/
    └── extension.test.ts # Test suite
```

**Build and development:**
- `npm run compile` - Compile TypeScript
- `npm run watch` - Watch mode for development
- `npm run test` - Run unit tests (18+ test cases)
- `npm run lint` - Run ESLint
- `npm run pretest` - Run compile + lint (CI preparation)

**Testing:**
- Comprehensive unit test suite with 18+ test cases
- Tests core functions: argument substitution, editor context extraction
- Integration tests for RegexBuddy/RegexMagic command construction
- Edge case testing: Unicode, long values, Windows paths
- Automated CI with GitHub Actions (multi-platform testing)

## Example argument templates

**Examples for RegexBuddy:**

```json
[
	"-t", "ECMAScript",
	"-e", "{regex}",
	"{file}"
]
```

**Examples for RegexMagic:**

```json
[
	"-open", "{file}",
	"-pattern", "{regex}"
]
```

## Repository

- **GitHub:** [hsaito/regex-jgs-launcher](https://github.com/hsaito/regex-jgs-launcher)
- **Issues and feedback:** Please use the GitHub repository for bug reports and feature requests.


