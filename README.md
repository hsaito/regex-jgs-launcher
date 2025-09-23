# regex-jgs-launcher README

This extension lets you quickly launch JGsoft tools — RegexBuddy and RegexMagic — directly from VS Code.

## Features

• Launch RegexBuddy or RegexMagic with a single command or keyboard shortcut
• Pass context from the active editor: selection text, file path, folder, and current line
• Customize executable paths and argument templates with placeholders
• Automatically applies `-appname "Visual Studio Code"`; the clipboard flags are configurable settings with sensible defaults

 

## Requirements

• Windows with RegexBuddy 4 and/or RegexMagic 2 installed
• Defaults used if present:
	- RegexBuddy: C:\\Program Files\\Just Great Software\\RegexBuddy 4\\RegexBuddy4.exe
	- RegexMagic: C:\\Program Files\\Just Great Software\\RegexMagic 2\\RegexMagic2.exe
• You can override paths in Settings (see below)

## Extension Settings

This extension contributes the following settings:

* `regex-jgs-launcher.regexBuddy.path`: Full path to `RegexBuddy.exe`.
* `regex-jgs-launcher.regexBuddy.args`: Array of argument template strings for RegexBuddy.
* `regex-jgs-launcher.regexMagic.path`: Full path to `RegexMagic.exe`.
* `regex-jgs-launcher.regexMagic.args`: Array of argument template strings for RegexMagic.
* `regex-jgs-launcher.regexBuddy.preArgs`: Array of arguments inserted before other args for RegexBuddy (default: `-getfromclipboard`, `-putonclipboard`).
* `regex-jgs-launcher.regexMagic.preArgs`: Array of arguments inserted before other args for RegexMagic (default: `-getfromclipboard`, `-putonclipboard`).
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

- 0.0.1: Initial preview — launch RegexBuddy/RegexMagic with clipboard integration, configurable paths and arguments, enable toggles, and default keybindings.

## Commands

- Regex JGsoft: Launch RegexBuddy (`regex-jgs-launcher.launchRegexBuddy`)
- Regex JGsoft: Launch RegexMagic (`regex-jgs-launcher.launchRegexMagic`)

Default keybindings:

- Ctrl+Alt+Shift+B – Launch RegexBuddy
- Ctrl+Alt+Shift+M – Launch RegexMagic

Both commands also appear in the editor context menu when there is a selection.

Quick start:

1) In Settings, enable the integration(s) you use.
2) Set the executable path(s). If the default path does not exist, you will be prompted to locate the .exe the first time you run a command.
3) Optionally define argument templates using placeholders.
4) Select text or invoke a command and enter a regex when prompted.

## Example argument templates

Examples for RegexBuddy:

```
[
	"-t", "ECMAScript",
	"-e", "{regex}",
	"{file}"
]
```

Examples for RegexMagic:

```
[
	"-open", "{file}",
	"-pattern", "{regex}"
]
```


