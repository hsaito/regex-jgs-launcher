---
name: Version Update
description: Update version references consistently across the project.
---

# Skill: Version Update

## Purpose
Update version references consistently across the project.

## Scope
- JSON files (package.json, package-lock.json, and any versioned config JSON)
- README.md
- CHANGELOG.md

## Inputs
- Target version (e.g., 1.2.3)
- Release date (YYYY-MM-DD) if CHANGELOG uses dates
- Short summary of changes for CHANGELOG

## Steps
1. Update JSON files:
   - package.json: set version to target version.
   - package-lock.json: set top-level version to target version.
   - Any other JSON files that reference the version.
2. Update README.md:
   - Replace displayed version badges or text references with the target version.
   - Ensure no stale version numbers remain.
3. Update CHANGELOG.md:
   - Add a new entry for the target version at the top.
   - Include release date if required.
   - Summarize changes briefly.
4. Verify consistency:
   - Ensure the same version appears everywhere.
   - Ensure formatting matches existing conventions.

## Output
- All version references updated consistently.
- README.md and CHANGELOG.md reflect the new version.
