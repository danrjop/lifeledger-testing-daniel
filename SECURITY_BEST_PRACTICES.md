# Security & Repo Hygiene Best Practices

## 1. Repository Hygiene

### Git & Version Control

- **Never commit secrets.** API keys, tokens, passwords, and connection strings belong in environment variables, not source code. Use `.env` files locally and inject secrets via CI/CD or a vault in production.
- **Maintain a strict `.gitignore`.** Exclude `node_modules/`, `.env*`, build artifacts, IDE configs, OS files (`.DS_Store`, `Thumbs.db`), and any generated credentials.
- **Use a `.gitattributes` file.** Normalize line endings and mark binary files to prevent diff noise and merge conflicts.
- **Sign commits.** Use GPG or SSH signing to verify author identity and prevent impersonation.
- **Protect the main branch.** Require pull request reviews, status checks, and linear history. Disable force pushes to shared branches.
- **Keep commits small and focused.** Atomic commits with clear messages make auditing and reverting easier.

### Dependency Management

- **Pin dependency versions.** Use lockfiles (`package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`) and commit them. Never use `*` or `latest` in version ranges for production dependencies.
- **Audit dependencies regularly.** Run `npm audit`, `yarn audit`, or use tools like Snyk/Dependabot to catch known vulnerabilities.
- **Minimize dependencies.** Every dependency is an attack surface. Before adding a package, evaluate whether you actually need it, check its maintenance status, download count, and known issues.
- **Use a lockfile integrity check in CI.** Fail builds if the lockfile is out of sync with `package.json`.
- **Review dependency updates before merging.** Automated PRs from Dependabot or Renovate should be reviewed, not auto-merged blindly.

### Code Quality Gates

- **Enforce linting and formatting in CI.** Use ESLint, Prettier, or Biome with a shared config. Fail the build on violations.
- **Run static analysis.** Tools like SonarQube, Semgrep, or CodeQL catch security anti-patterns before code reaches production.
- **Require test coverage thresholds.** Not for vanity metrics — to ensure critical paths (auth, payments, data access) are tested.
- **Use pre-commit hooks.** Tools like Husky + lint-staged catch issues before they enter the repo. Run secret scanning (e.g., `git-secrets`, `trufflehog`) as a hook.

---

## 2. Website Security

### Transport & Headers

- **Enforce HTTPS everywhere.** Redirect all HTTP traffic to HTTPS. Use HSTS headers with `includeSubDomains` and `preload`.
  ```
  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
  ```
- **Set a restrictive Content Security Policy (CSP).** Start strict and loosen only as needed. At minimum, disallow `unsafe-inline` and `unsafe-eval` for scripts.
  ```
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://api.yourdomain.com
  ```
- **Set security headers.** Every response should include:
  ```
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  ```
- **Remove server fingerprints.** Strip `X-Powered-By`, `Server`, and version headers. Don't give attackers a free reconnaissance tool.

### DNS & Domain

- **Enable DNSSEC** to prevent DNS spoofing.
- **Use CAA records** to restrict which certificate authorities can issue certs for your domain.
- **Monitor certificate transparency logs** for unauthorized cert issuance.

### Cookie Security

- **Set `Secure`, `HttpOnly`, and `SameSite` on all cookies.**
  - `Secure`: only sent over HTTPS.
  - `HttpOnly`: inaccessible to JavaScript (prevents XSS exfiltration).
  - `SameSite=Lax` or `Strict`: prevents CSRF via cross-origin requests.
- **Use `__Host-` prefix** for session cookies to enforce `Secure`, no `Domain`, and `Path=/`.
  ```
  Set-Cookie: __Host-session=abc123; Secure; HttpOnly; SameSite=Lax; Path=/
  ```

---

## 3. Application Security

### Input Validation & Output Encoding

- **Validate all input on the server.** Client-side validation is for UX, not security. Never trust anything from the client — form data, query params, headers, file uploads.
- **Use allowlists, not blocklists.** Define what valid input looks like rather than trying to enumerate all bad input.
- **Encode output contextually.** HTML-encode for HTML contexts, URL-encode for URLs, JS-encode for JavaScript. Use your framework's built-in escaping (React's JSX auto-escaping, etc.) and don't bypass it with `dangerouslySetInnerHTML` or equivalent without explicit sanitization.
- **Parameterize all database queries.** Use parameterized queries or an ORM. Never concatenate user input into SQL strings.
  ```typescript
  // WRONG
  db.query(`SELECT * FROM users WHERE id = '${userId}'`);

  // RIGHT
  db.query('SELECT * FROM users WHERE id = $1', [userId]);
  ```

### API Security

- **Rate limit all endpoints.** Especially auth endpoints (login, signup, password reset). Use progressive delays or lockouts after repeated failures.
- **Validate and sanitize file uploads.** Check MIME type (not just extension), enforce size limits, store uploads outside the webroot, and serve them from a separate domain or CDN.
- **Use CORS restrictively.** Never set `Access-Control-Allow-Origin: *` for authenticated endpoints. Whitelist specific origins.
  ```typescript
  // WRONG
  cors({ origin: '*' })

  // RIGHT
  cors({ origin: ['https://app.yourdomain.com'], credentials: true })
  ```
- **Version your APIs.** Breaking changes should go in a new version, not silently alter existing contracts.
- **Implement request size limits.** Prevent denial-of-service via oversized payloads.

### Error Handling

- **Never expose stack traces or internal errors to users.** Log detailed errors server-side; return generic messages to the client.
  ```typescript
  // WRONG — leaks internals
  res.status(500).json({ error: err.message, stack: err.stack });

  // RIGHT
  logger.error('Payment processing failed', { err, userId });
  res.status(500).json({ error: 'Something went wrong. Please try again.' });
  ```
- **Use global error handlers.** Catch unhandled rejections and exceptions so the app fails gracefully, not with an information leak.
- **Log security-relevant events.** Failed logins, permission denials, input validation failures, and rate limit hits should all be logged with enough context for investigation.

### Data Protection

- **Encrypt sensitive data at rest.** PII, financial data, and health records should be encrypted in the database, not stored as plaintext.
- **Minimize data collection.** Don't collect data you don't need. The less you store, the less you can leak.
- **Implement data retention policies.** Automatically purge data that is no longer needed.
- **Mask sensitive data in logs.** Never log passwords, tokens, credit card numbers, or PII.

---

## 4. Authentication & Authorization Security

### Password Handling

- **Never store plaintext passwords.** Use bcrypt, scrypt, or Argon2id with appropriate cost factors. SHA-256 alone is not sufficient — it's too fast.
  ```typescript
  // Use bcrypt with cost factor >= 12
  const hash = await bcrypt.hash(password, 12);
  ```
- **Enforce reasonable password policies.** Minimum 8 characters, check against breached password lists (Have I Been Pwned API), but don't impose arbitrary complexity rules (they lead to weaker passwords written on sticky notes).
- **Use constant-time comparison** for password/token verification to prevent timing attacks.

### Session Management

- **Use short-lived, rotating tokens.** Access tokens should expire quickly (15 minutes). Use refresh tokens with rotation to maintain sessions.
- **Invalidate sessions on logout.** Actually revoke the token server-side. Client-side deletion alone is insufficient.
- **Invalidate all sessions on password change.** If a user changes their password, kill every active session.
- **Bind sessions to device/IP when possible.** Detect and flag sessions that migrate unexpectedly.

### Multi-Factor Authentication (MFA)

- **Offer MFA. Require it for sensitive operations.** TOTP (Google Authenticator, Authy) or WebAuthn/passkeys are preferred over SMS (which is vulnerable to SIM swapping).
- **Provide recovery codes.** Generate single-use backup codes at MFA enrollment. Store them hashed.
- **Rate limit MFA attempts.** Prevent brute-force guessing of TOTP codes.

### OAuth & Third-Party Auth

- **Use the Authorization Code flow with PKCE** for all OAuth integrations. Never use the Implicit flow.
- **Validate `state` parameters** to prevent CSRF in OAuth flows.
- **Validate ID token signatures and claims.** Check `iss`, `aud`, `exp`, and `nonce` on every token.
- **Store OAuth tokens encrypted.** Treat them like passwords.

### Authorization

- **Check permissions on every request.** Never rely on hiding UI elements as access control. The server must enforce authorization independently.
- **Use the principle of least privilege.** Users, services, and API keys should have the minimum permissions needed.
- **Implement row-level security.** Ensure users can only access their own data. Every database query for user data must include an ownership check.
  ```typescript
  // WRONG — IDOR vulnerability
  const doc = await db.documents.findById(req.params.id);

  // RIGHT — scoped to authenticated user
  const doc = await db.documents.findOne({
    _id: req.params.id,
    userId: req.user.id,
  });
  ```
- **Audit authorization failures.** Log when users attempt to access resources they don't own. Patterns of unauthorized access attempts may indicate an attack.

### Token Security

- **Store tokens appropriately.** Access tokens in memory (not localStorage). Refresh tokens in `HttpOnly` cookies.
- **Never put tokens in URLs.** Query strings end up in browser history, server logs, and referrer headers.
- **Implement token revocation.** Maintain a blocklist or use short-lived tokens so compromised tokens expire quickly.

---

## 5. Quick Reference Checklist

| Area | Check | Priority |
|------|-------|----------|
| Repo | `.env` files in `.gitignore` | Critical |
| Repo | Dependency audit passing | High |
| Repo | Secret scanning in CI | Critical |
| Repo | Branch protection enabled | High |
| Website | HTTPS enforced with HSTS | Critical |
| Website | CSP header configured | High |
| Website | Security headers set | High |
| Website | Cookies use `Secure; HttpOnly; SameSite` | Critical |
| App | Input validated server-side | Critical |
| App | SQL queries parameterized | Critical |
| App | Rate limiting on all endpoints | High |
| App | No stack traces in responses | High |
| App | CORS restrictively configured | High |
| Auth | Passwords hashed with bcrypt/Argon2id | Critical |
| Auth | MFA available and encouraged | High |
| Auth | Sessions invalidated on logout | Critical |
| Auth | Row-level authorization enforced | Critical |
| Auth | Tokens stored securely (not localStorage) | High |
| Auth | OAuth using PKCE | High |
