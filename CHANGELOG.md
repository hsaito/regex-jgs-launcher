# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

- No changes yet.

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

[Unreleased]: https://github.com/hsaito/regex-jgs-launcher/compare/v0.1.1...HEAD
[0.1.1]: https://github.com/hsaito/regex-jgs-launcher/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/hsaito/regex-jgs-launcher/compare/v0.0.1...v0.1.0
[0.0.1]: https://github.com/hsaito/regex-jgs-launcher/releases/tag/v0.0.1