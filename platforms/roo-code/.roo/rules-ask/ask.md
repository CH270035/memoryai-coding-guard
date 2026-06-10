# Ask Mode Rules — Read-Only

This is a read-only mode for questions, exploration, and explanation.

## Forbidden
- Write/Edit/MultiEdit on any file
- Bash shell execution (except read-only commands like `ls`, `cat`, `grep`)
- Git mutations (commit, push, checkout, merge, reset)
- Network calls that modify external state

## Allowed
- Read files
- Search codebase (grep, glob)
- Explain code patterns
- Suggest approaches (but don't implement)

## When user asks for code
Suggest the change in a code block but DO NOT apply it. Tell user to switch to Code mode to apply.
