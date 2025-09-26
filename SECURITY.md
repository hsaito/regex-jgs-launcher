# Security Policy

## Community Project Notice

This is a community-driven open source project. Security assessments and vulnerability management are conducted on a best-effort basis by volunteer maintainers. While we strive to follow industry best practices and employ automated security scanning tools, users should be aware that this project does not have the same security resources or guarantees as commercial software products.

**Important**: This software is provided under the MIT License, which explicitly states that the software is provided "AS IS" without warranty of any kind. The maintainers do not guarantee security fixes or commit to specific timeframes for vulnerability responses. All response timelines mentioned in this document are aspirational goals, not contractual commitments.

## Supported Versions

We actively support and provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 0.2.x   | :white_check_mark: |
| 0.1.x   | :x:                |

Only the latest minor version within the 0.2.x series receives security updates. Please upgrade to the latest 0.2.x release to ensure you have the most recent security fixes.

**Note**: Once a production major version (e.g., 1.0.0) is released, all current preproduction versions (0.x.x series) will be deprecated and will no longer receive security updates. Users will be expected to upgrade to the production release series.

## Security Scanning

This project employs multiple layers of automated security scanning:

- **Dependabot**: Automatically monitors dependencies for known vulnerabilities and creates pull requests to update vulnerable packages
- **Snyk**: Performs regular security scans of dependencies and code to identify potential security issues
- **GitHub Actions CI**: Includes `npm audit` in our continuous integration pipeline to catch security vulnerabilities during development

## Reporting a Vulnerability

If you discover a security vulnerability in this VS Code extension, please report it responsibly:

**Important**: Security issues pertaining to RegexBuddy or RegexMagic applications themselves must **not** be reported to this project. Such issues should be reported directly to [Just Great Software](https://www.just-great-software.com/contact.html), the developer of those applications.

### For Non-Critical Vulnerabilities
- Open an issue on our [GitHub Issues](https://github.com/hsaito/regex-jgs-launcher/issues) page
- Include as much detail as possible about the vulnerability
- Provide steps to reproduce if applicable

### For Critical Vulnerabilities
- **Do not** create a public issue for critical security vulnerabilities
- Send an email to the project maintainer with details about the vulnerability
- Allow reasonable time for the issue to be addressed before public disclosure

## Security Considerations

This extension:
- Launches external applications (RegexBuddy and RegexMagic) with user-configurable paths and arguments
- Places selected text on the system clipboard when launching external tools
- Does not collect, store, or transmit user data to external services
- Runs locally within the VS Code environment with standard extension permissions

### Best Practices for Users
- Only configure trusted executable paths in the extension settings
- Be cautious when using custom argument templates that might expose sensitive information
- Regularly update to the latest supported version to receive security patches

## Response Timeline

The following timelines are aspirational goals based on best effort by volunteer maintainers and are not guaranteed commitments:

- **Acknowledgment**: We aim to acknowledge security reports within 48 hours
- **Initial Assessment**: Security issues will be assessed within 7 days
- **Resolution**: Critical vulnerabilities will be addressed in emergency releases; non-critical issues will be included in the next scheduled release

Please note that as a community project provided under the MIT License, these timelines are subject to maintainer availability and project resources.

Thank you for helping keep the JGS Regex Launcher extension secure!