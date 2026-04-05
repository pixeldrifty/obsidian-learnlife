# Organizer
> Python CLI/TUI file organizer driven by a custom DSL rule engine.

## Overview
Organizer is a Python tool for automating file organization. Users write rules in a custom DSL specifying match conditions and actions; the engine evaluates them against the file system and executes moves, copies, renames, or deletions. A dry-run mode lets users preview changes before committing.

## Tech Stack
- Python 3.10+
- Typer (CLI)
- Textual (TUI)
- Rich (output formatting)

## Key Features
- **DSL rule engine** — match files by extension, name pattern, size, or date
- **Actions** — move, copy, rename, delete
- **Path variables** — `{year}`, `{month}`, etc. for dynamic destinations
- **Dry-run mode** — preview all changes without touching files
- Both CLI and TUI interfaces

## Status
Active development.

## Location
`C:\Users\sarah\projects\organizer`

## Notes
The DSL is the core value of this project — it makes rules declarative and readable without requiring Python knowledge. Textual provides an interactive TUI for users who prefer a visual interface over raw CLI flags.
