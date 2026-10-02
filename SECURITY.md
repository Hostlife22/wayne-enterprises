# Security policy

This is a static demonstration app with no authentication backend, payment processing or persistent user data. The Log In panel does not request credentials. Only the current `main` branch is maintained.

For suspected vulnerabilities, use GitHub's **Report a vulnerability** feature if private reporting is enabled at https://github.com/Hostlife22/test-form/security/advisories/new. If unavailable, open a minimal issue requesting a private contact channel; do not publish exploit details, credentials or personal data. The maintainer will arrange private follow-up. There is no guaranteed response time or security bounty.

Include affected commit/version, reproduction steps, impact and a suggested fix if known. Dependency updates should pass `npm run check` and browser tests. Do not put secrets in Vite environment variables: client-side configuration is public.
