# JGS Regex Launcher

This VS Code extension lets you quickly launch JGsoft to**Quick start:**

1. **First-run onboarding**: When you first use any regex command, you'll see a welcome dialog to enable RegexBuddy and/or RegexMagic. You can also enable them later in Settings (`regex-jgs-launcher.regexBuddy.enabled`, `regex-jgs-launcher.regexMagic.enabled`) or use the "Configure Integrations" command.
2. **Set executable paths**: If the default path does not exist, you will be prompted to locate the .exe the first time you run a command.
3. **Customize arguments**: Optionally define argument templates using placeholders in Settings.
4. **Use the tools**: Select text or invoke a command and enter a regex when prompted. Use the "RegexBuddy: Use Selection as Sample" command to send selection as sample text via `-testclipboard`.
5. **Reset if needed**: Use "Reset All Settings" command to restore factory defaults.RegexBuddy and RegexMagic — directly from VS Code.

**Publisher:** Hideki Saito  
**Version:** 0.2.2  
**License:** MIT

## Features

- Launch RegexBuddy or RegexMagic with a single command or keyboard shortcut
- Pass context from the active editor: selection text, file path, folder, and current line
- Customize executable paths and argument templates with placeholders
- Automatically applies `-appname "Visual Studio Code"`; the clipboard flags are configurable settings with sensible defaults
- Commands are only enabled when the respective tool integration is enabled in settings
 - Two RegexBuddy modes: normal (selection as regex) and sample mode (selection as sample text)

 

## Requirements

- Windows with RegexBuddy 4 and/or RegexMagic 2 installed
- Defaults used if present:
	- RegexBuddy: C:\\Program Files\\Just Great Software\\RegexBuddy 4\\RegexBuddy4.exe
	- RegexMagic: C:\\Program Files\\Just Great Software\\RegexMagic 2\\RegexMagic2.exe
- You can override paths in Settings (see below)

## Extension Settings

This extension contributes the following settings:

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

## Release Notes

- **0.2.2**: Clarified reset scope (profile-only), added "Reset Guide" command and link after reset; improved RegexMagic default pre-args docs; minor text polish.
- **0.2.1**: Patch — Fixed RegexBuddy sample mode default to `-testclipboard`.
- **0.2.0**: Added onboarding, reset command, RegexBuddy sample mode, improved command names and keybindings.
- **0.1.0**: First stable release.
- **0.0.1**: Initial preview.

## Commands

- **RegexBuddy: Use Selection as Regex** (`regex-jgs-launcher.launchRegexBuddy`)
- **RegexBuddy: Use Selection as Sample** (`regex-jgs-launcher.launchRegexBuddySample`)
- **RegexMagic: Use Selection as Sample** (`regex-jgs-launcher.launchRegexMagic`)
- **JGS Regex Launcher: Setup** (`regex-jgs-launcher.showSetup`)
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
4. Select text or invoke a command and enter a regex when prompted. Use the "RegexBuddy: Use Selection as Sample" command to send selection as sample text via `-testclipboard`.

## Development

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
- `npm run test` - Run tests
- `npm run lint` - Run ESLint

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


