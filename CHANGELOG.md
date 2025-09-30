# Change Log

All notable changes to the "regex-jgs-launcher" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [Unreleased]

## [0.2.6] - 2025-09-30

### Added
- (Consolidated) Executable auto-detection, onboarding auto-enable, localization resilience, and expanded tests (carried forward from 0.2.5 cycle)

### Changed
- Consolidated prior doc-only bump (0.2.5.1) into this patch release for Marketplace-compliant semantic versioning.
- Updated README version badge and release notes formatting.

### Notes
- No code changes since 0.2.5 aside from metadata/version; functionality identical.

## [0.2.5] - 2025-09-30

### Added
- **Auto-detection system for RegexBuddy and RegexMagic executables**
  - Automatically searches for RegexBuddy v5 (preferred) or v4 in standard Program Files locations
  - Automatically searches for RegexMagic v2 in standard Program Files locations
  - New command "JGS Regex Launcher: Auto-detect Executable Paths" in Command Palette
- **Enhanced onboarding experience**
  - Auto-detected tools are automatically pre-checked during setup for zero-friction configuration
  - Executable paths are automatically configured when detected tools are enabled
  - Visual indicators show detected versions (e.g., "Enable RegexBuddy (v5 detected)")
- **Robust localization system**
  - Safe localization function with automatic English fallbacks
  - Comprehensive test suite to detect and prevent raw localization key exposure
  - Improved timing for l10n system initialization during extension activation

### Improved
- **Setup workflow**: Streamlined from manual configuration to automatic detection and setup
- **User experience**: Reduced setup friction with intelligent defaults based on detected software
- **Reliability**: Enhanced error handling and fallback mechanisms for localization
- **Test coverage**: Added 24 comprehensive tests including auto-detection and localization validation

### Fixed
- **Localization key exposure**: Resolved issue where raw keys like "message.onboarding" were shown instead of translated text
- **Extension activation timing**: Improved l10n system initialization to prevent timing-related localization failures
- **Onboarding reliability**: Enhanced activation flow to ensure consistent user experience across different VS Code environments

### Technical
- Deferred onboarding until after command registration with l10n readiness checking
- Added comprehensive auto-detection functionality with version priority (RegexBuddy 5 > 4, RegexMagic 2 only)
- Implemented safe localization wrapper with fallback text for all user-facing messages
- Enhanced test suite with localization validation and auto-detection behavior verification

## [0.2.4] - 2025-09-28

### Added
- Japanese UI localization for commands, settings (descriptions & markdownDescription), and runtime messages.
- Dual localization strategy: legacy `package.nls.json` / `package.nls.ja.json` plus runtime `l10n/bundle.l10n.json` / `bundle.l10n.ja.json`.
- Documentation section in README detailing localization, fallback, and how to contribute new languages.
- `CONTRIBUTORS` file and `.github/CODEOWNERS` assigning repository ownership to @hsaito.

### Technical
- Ensured English fallback for unsupported locales (verified packaging includes both NLS and l10n bundles).
- Packaged assets now include localization artifacts without impacting existing behavior for non-ja users.

### Docs
- README updated with version bump and localization notes.

## [0.2.3] - 2025-09-25

### Added
- Comprehensive unit test suite with 18+ test cases covering core functionality
- GitHub Actions CI pipeline with multi-platform testing (Ubuntu, Windows, macOS)
- Automated testing on Node.js 18 and 20
- Security audit and dependency checking in CI
- VSIX packaging validation in CI

### Changed
- Exported core functions (`substituteArgs`, `getActiveEditorContext`, `ArgTemplateCtx`) for testing
- Enhanced README with testing and CI information

### Docs
- Clarified RegexMagic's purpose: creates regex from sample text, doesn't edit existing patterns
- Updated command descriptions to explain RegexBuddy vs RegexMagic usage patterns
- Added usage notes distinguishing between pattern creation (RegexMagic) and pattern editing (RegexBuddy)

### Technical
- CI runs on push/PR to main and develop branches
- Tests core functionality, linting, compilation, and packaging
- Fixed Linux CI tests to run in headless mode with xvfb virtual display

## [0.2.2] - 2025-09-23

### Changed
- Clarified reset confirmation text to state it applies to the current profile only and that other profiles are not affected.

### Added
- New command: "JGS Regex Launcher: Reset Guide" to explain how to reset settings in other profiles and provide a shortcut to switch profiles.

### Docs
- README: Corrected RegexMagic default `preArgs` docs, updated version/commands, added links to official RegexBuddy and RegexMagic websites, added an explicit unofficial-use disclaimer, and clarified Windows-only support (WINE use is unsupported, mileage may vary).

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

[Unreleased]: https://github.com/hsaito/regex-jgs-launcher/compare/v0.2.6...HEAD
[0.2.6]: https://github.com/hsaito/regex-jgs-launcher/compare/v0.2.5...v0.2.6
[0.2.5]: https://github.com/hsaito/regex-jgs-launcher/compare/v0.2.4...v0.2.5
[0.2.4]: https://github.com/hsaito/regex-jgs-launcher/compare/v0.2.3...v0.2.4
[0.2.3]: https://github.com/hsaito/regex-jgs-launcher/compare/v0.2.2...v0.2.3
[0.2.2]: https://github.com/hsaito/regex-jgs-launcher/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/hsaito/regex-jgs-launcher/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/hsaito/regex-jgs-launcher/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/hsaito/regex-jgs-launcher/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/hsaito/regex-jgs-launcher/compare/v0.0.1...v0.1.0
[0.0.1]: https://github.com/hsaito/regex-jgs-launcher/releases/tag/v0.0.1