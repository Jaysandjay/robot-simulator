---
name: git-commit
description: Stage and commit files to github. Use when asked to commit.
allowed-tools: Bash
---
# Committing to github

### When staging files:

- Check to see if there are multiple files to be staged

IF multiple files:
- Only stage files that are relavent to a specific feature implemented

### When commiting
1. Write a commit message using the following format 
"<type>[optional scope]: <description>"
2. Show the commit message, staged files, and current branch as a message and ask permission to commit the message

IF permission granted:
- Commit to the current branch
ELSE:
- Reformat if given instruction, otherwise stop.

### Loop
- Repeat until there is nothing to be staged