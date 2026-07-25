# Git Auto-Commit and Push Rules

These rules apply whenever a task is completed in the EnglishBuddy repository.

1. **Prerequisites for Pushing:**
   - Run `npm run lint`
   - Run `npm run type-check`
   - Run `npm run build`
   - Run any automated tests if applicable.
   - **Never push** if any of the above checks fail.

2. **Git Workflow:**
   - Run `git status`
   - Stage all modified files (`git add .`)
   - Create a meaningful commit message.
   - Push to the `main` branch.

3. **Commit Message Format:**
   - `feat: <feature name>`
   - `fix: <bug fixed>`
   - `refactor: <module>`
   - `docs: <documentation>`
   - `style: <ui improvements>`

4. **Post-Push Report:**
   After every successful push, provide the user with:
   - Commit hash
   - Branch
   - Files changed
   - Repository URL (https://github.com/Dhanusha17/EnglishBuddy.git)
   - Push status

5. **Authentication:**
   If GitHub authentication is required, pause and ask the user to authenticate.
