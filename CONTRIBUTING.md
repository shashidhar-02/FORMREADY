# Contributing to FormReady

Thank you for contributing to FormReady. We welcome contributions that maintain our zero-server privacy architecture and enhance user experience.

## Contribution Guidelines

1. **Client-Only Architecture**: Never introduce dependencies or features that send user files or metadata to remote endpoints.
2. **Quality Verification**: When adding or updating portal presets, always include official source verification dates and URLs where available.
3. **Automated Testing**: Ensure all unit tests pass before submitting changes:
   ```bash
   npm test
   ```
4. **Static Compatibility**: All routes must compile cleanly under Next.js static export (`npm run build`).
