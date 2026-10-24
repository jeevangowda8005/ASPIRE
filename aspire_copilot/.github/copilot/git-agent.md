# Git Agent — Copilot Chat Prompts

## How to use
Open Copilot Chat in VS Code, paste the prompt you need.

---

## Generate a commit message for staged changes
```
@workspace Look at my recent changes and write a clear git commit
message following this format:
  <type>: <short description under 50 chars>

  <optional body: what changed and why>

Types: feat / fix / refactor / docs / test / deploy
Keep the subject line under 50 characters.
```

## Full push workflow with safety checks
```
@workspace Help me safely push my ASPIRE changes to GitHub.
Run through these steps:
1. List all changed files with git status
2. Check for any accidentally staged secrets (.env, passwords, API keys)
3. Verify .gitignore covers: venv/, node_modules/, *.db, .env, *.joblib
4. Suggest a commit message based on the changes
5. Give me the exact git commands to run in order
```

## Review changes before pushing
```
@workspace Review my staged changes before I push to GitHub.
Check:
- No secrets or API keys are being committed
- No venv/, node_modules/, or *.db files are staged
- The changes are logically consistent and complete
- Suggest any improvements before I push
```

## Fix a broken push
```
My git push to GitHub failed with this error:
[paste error here]

How do I fix it without losing my changes?
```

## Undo last commit (keep changes)
```
I need to undo my last git commit but keep the file changes.
Give me the exact command and explain what it does.
```

## Emergency rollback
```
My last push broke the ASPIRE deployment on Render/Vercel.
How do I safely revert to the previous working commit
and push the revert to main?
```
