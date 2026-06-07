---
name: git-create-pr
description: Create well-documented pull requests with comprehensive descriptions.
---

## Usage
---
/pr
---

## Behavior
1. Analyize commits since branching from main
2. Generate a descriptive PR title
3. Create detailed description with:
  - Summary of changes
  - Testing instructions (if applicable)
4. Show current branch name,list of commits on the branch, and the PR description and ask for permission to create the PR
5. IF permission granted:
  - Create PR via `gh pr create`

## PR Template
```markdown
## Summary
Brief description of changes

## Changes
- List of specific changes made

## Testing (if applicable)
How to test these changes


## Checklist
- [ ] Tests pass
- [ ] Documentation updated
- [ ] No breaking changes
```

## Requirements
- GitHub CLI (`gh`) installed and authenticated
- On a feature branch (not main)