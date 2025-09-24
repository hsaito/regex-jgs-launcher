# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

- No changes yet.

## [0.2.2] - 2025-09-23

### Changed
- Clarified reset confirmation text to state it applies to the current profile only and that other profiles are not affected.

### Added
- New command: "JGS Regex Launcher: Reset Guide" to explain how to reset settings in other profiles and provide a shortcut to switch profiles.

### Docs
- README: Corrected RegexMagic default `preArgs` docs and updated version/commands.

## [0.2.1] - 2025-09-23

### Fixed
- **RegexBuddy sample mode**: Corrected default argument from `-sampleclipboard` to `-testclipboard` for proper RegexBuddy sample mode functionality.

## [0.2.0] - 2025-09-23

### Added
- **First-run onboarding flow**: Welcome dialog appears on first command execution to guide users through enabling RegexBuddy and/or RegexMagic integrations.
- **Settings reset command**: "JGS Regex Launcher: Reset All Settings" command with confirmation dialog to restore all settings to factory defaults.
- **Configure integrations command**: "JGS Regex Launcher: Configure Integrations" command to manually re-run the onboarding flow.
- **RegexBuddy sample mode**: Dedicated support for RegexBuddy's sample mode with `-sampleclipboard` flag and separate argument templates.
- **Enhanced command titles**: More descriptive command names for better user experience.

### Changed
- **Async extension activation**: Improved startup handling for better performance.
- **Command names**: Updated to more descriptive titles (e.g., "RegexBuddy: Use Selection as Regex").
- **Keybindings**: Changed from `Ctrl+Alt+R/S/M` to `Ctrl+Alt+Shift+R/S/M` to avoid conflicts with C# build commands.
- **Settings management**: Moved from checkbox-based reset to command-based reset to prevent settings sync issues.
- **Configuration clearing**: Uses proper VS Code configuration clearing mechanism instead of manually setting default values.

### Fixed
- **Settings sync compatibility**: Removed checkbox-based reset that could interfere with VS Code settings synchronization.
- **Proper configuration reset**: Settings are now properly cleared (removed) rather than set to default values, allowing natural defaults to take effect.

### Technical
- **Improved error handling**: Better user experience with enhanced prompts and confirmations.
- **Code organization**: Cleaner separation of concerns with dedicated functions for onboarding and configuration management.

## [0.1.1] - 2025-09-23

### Changed
- Bumped version to `0.1.1`.
- README: updated version badge; minor formatting tweaks.

### Fixed
- Packaging: ensured only necessary files are included via `.vscodeignore` (no functional changes).

## [0.1.0] - 2025-09-23

### Added
- Extension icon (`logo.png`) and `icon` field in `package.json`.
- Marketplace metadata: `keywords`, `homepage`, and `bugs` URLs.
- Expanded README with features, commands, keybindings, development notes, and examples.
- Documentation notes on command enablement and context menu locations.

### Changed
- Bumped version to `0.1.0`.
- Updated publisher identifier to `hideki` and added `author` field (`Hideki Saito`).
- Packaging setup refined: leveraged `.vscodeignore` to exclude dev files from the VSIX.

### Fixed
- Corrected README to reflect RegexMagic default `preArgs`: `-sampleclipboard`, `-putonclipboard`.
- Resolved packaging errors due to invalid publisher name and conflicting files strategy.

## [0.0.1] - 2025-09-23

### Added
- Initial preview release.
- Commands to launch RegexBuddy and RegexMagic.
- Clipboard integration and configurable argument templates with placeholders (`{regex}`, `{file}`, `{dir}`, `{line}`, `{selection}`).
- Default keybindings and settings for paths, args, preArgs, and enable toggles.
- Editor context and title menu entries when there is a selection.

[Unreleased]: https://github.com/hsaito/regex-jgs-launcher/compare/v0.2.2...HEAD
[0.2.2]: https://github.com/hsaito/regex-jgs-launcher/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/hsaito/regex-jgs-launcher/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/hsaito/regex-jgs-launcher/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/hsaito/regex-jgs-launcher/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/hsaito/regex-jgs-launcher/compare/v0.0.1...v0.1.0
[0.0.1]: https://github.com/hsaito/regex-jgs-launcher/releases/tag/v0.0.1