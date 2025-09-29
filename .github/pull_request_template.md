# 🛸 UFO Invasions: Pull Request

## 🗺 Linear Issue Reference

**Linear Issue**: GPZ-XX <!-- Replace XX with actual issue number -->
**Linear URL**: https://linear.app/gpz/issue/GPZ-XX/
**Notion Task**: [Task Name](https://notion.so/link) <!-- Link to corresponding Notion task -->

---

## 📋 Summary & Context

<!-- Brief description of what this PR accomplishes -->
<!-- Reference the original template context if applicable -->

### 🎯 What's Changed
- [ ] <!-- List main changes -->
- [ ] <!-- Use checkboxes for clarity -->
- [ ] <!-- Add more items as needed -->

### 🔗 Related Issues/PRs
- Closes #XX <!-- If this PR closes a GitHub issue -->
- Related to GPZ-XX <!-- If related to other Linear issues -->
- Blocks/Blocked by: <!-- Dependencies -->

---

## 🧪 Testing Checklist

### 💻 Code Quality
- [ ] Code follows project style guidelines (ESLint passes)
- [ ] No console.log statements in production code
- [ ] TypeScript types are properly defined
- [ ] Prettier formatting applied
- [ ] No secrets in repository

### 🧪 Unit & Integration Tests
- [ ] New code is covered by tests
- [ ] All existing tests pass (`npm test`)
- [ ] Edge cases are tested
- [ ] Error scenarios are covered
- [ ] Jest coverage > 80% for new code

### 🎭 E2E Testing (if applicable)
- [ ] Playwright tests pass (`npm run e2e`)
- [ ] User flows work end-to-end
- [ ] Mobile responsiveness verified
- [ ] Cross-browser compatibility checked
- [ ] Mock chain testing (if blockchain features)

### 🔗 Integration Testing
- [ ] Web3 connections work properly
- [ ] API endpoints respond correctly (< 200ms)
- [ ] Real-time features function
- [ ] Database operations are optimized
- [ ] Error handling works as expected

---

## 🌐 Deployment & Production Readiness

### 🔧 Environment Setup
- [ ] Environment variables documented in .env.example
- [ ] Dependencies updated in package.json
- [ ] Build process succeeds (`npm run build`)
- [ ] No breaking changes to existing APIs

### 🔒 Security Review
- [ ] No sensitive data exposed
- [ ] Input validation implemented
- [ ] Authentication/authorization working
- [ ] SQL injection prevention
- [ ] XSS protection in place
- [ ] Wallet security best practices

### 📈 Performance Impact
- [ ] No significant performance regression
- [ ] Database queries optimized (< 100ms)
- [ ] Bundle size impact acceptable
- [ ] Memory usage within limits
- [ ] Gas optimization (if smart contract changes)

---

## 📱 Platform Synchronization

### 🔗 Linear Integration
- [ ] Issue status will auto-update after merge
- [ ] Proper GPZ-XX format in title/commits
- [ ] Estimate hours updated in Linear
- [ ] Dependencies properly set
- [ ] Linear issue linked in description

### 📄 Notion Task Tracking
- [ ] Task exists in [UFO Invasions Task Tracker](https://www.notion.so/3974f1b1767e452488c2b6aa4c364084)
- [ ] Status will sync to "In Review" → "Done"
- [ ] GitHub link updated in Notion
- [ ] Sprint assignment correct
- [ ] Tags properly set (Backend/Frontend/Smart Contract/etc.)

### 🚀 GitHub Actions
- [ ] Commit messages follow [template](.github/commit-template.txt)
- [ ] Branch naming: `feature/GPZ-XX-description`
- [ ] Actions will trigger sync workflow
- [ ] No workflow file syntax errors

---

## 📄 Documentation & Communication

### 📝 Updates Required
- [ ] README.md updated (if user-facing changes)
- [ ] CHANGELOG.md entry added
- [ ] API documentation updated (if API changes)
- [ ] Code comments added for complex logic
- [ ] Notion roadmap reflects changes

### 📢 Stakeholder Communication
- [ ] Team members notified (if major changes)
- [ ] Breaking changes communicated
- [ ] Migration steps documented (if applicable)

---

## 🎆 Feature-Specific Checks

### 🎮 Game Features (if applicable)
- [ ] Mission system logic correct
- [ ] XP calculation working
- [ ] Leaderboard updates properly
- [ ] Badge minting functions
- [ ] Reward distribution accurate

### 💰 Smart Contract (if applicable)
- [ ] Contract compilation successful
- [ ] Security audit checklist completed
- [ ] Gas usage optimized
- [ ] Event emission proper
- [ ] Testnet deployment verified

### 🎨 UI/UX (if applicable)
- [ ] Cosmic theme consistency
- [ ] Animation performance smooth
- [ ] Responsive design works
- [ ] Accessibility standards met
- [ ] Loading states implemented

---

## 🔍 Review & Deployment

### 🗂 Review Notes
<!-- Add any specific notes for reviewers -->
<!-- Mention if this PR requires special attention -->
<!-- List any known limitations or future improvements -->

### 🕰 Timeline
- **Estimated Review Time**: <!-- e.g., 2-4 hours -->
- **Target Merge Date**: <!-- e.g., October 1, 2025 -->
- **Deployment Window**: <!-- e.g., After 6 PM EEST -->

### 🚀 Post-Merge Actions
- [ ] Verify deployment success on staging
- [ ] Monitor for errors/regressions
- [ ] Update Linear issue to "Done"
- [ ] Update Notion task status
- [ ] Announce in team channels (if major feature)

---

**🞆 Sync Status**: This PR will automatically update Linear issue `GPZ-XX` and Notion task when merged.

**📈 Tracking**: [Linear Issue](https://linear.app/gpz/issue/GPZ-XX) | [Notion Task](https://notion.so/link) | [GitHub Actions](../../actions)