# Security Policy

ElectIQ is committed to ensuring the safety and security of our users and their data. We take security vulnerabilities seriously and appreciate the efforts of security researchers in keeping the community safe.

## Supported Versions

Only the latest version of ElectIQ is actively supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| 1.0.0   | :white_check_mark: |
| < 1.0.0 | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability, please do NOT open a public issue. Instead, report it responsibly by following these steps:

1.  Send an email to **security@electiq.dev** (placeholder) with the details of the vulnerability.
2.  Include a clear description, the impact, and steps to reproduce the issue.
3.  We will acknowledge your report within 48 hours and provide a timeline for the fix.

## Our Security Practices

ElectIQ implements several layers of security to protect the platform:

- **Content Security Policy (CSP)**: Managed via `helmet` to prevent XSS and unauthorized resource loading.
- **Rate Limiting**: Applied to all API endpoints to prevent brute force and DoS attacks.
- **Input Sanitization**: All user-provided text is sanitized to remove HTML tags and limited in length.
- **Secure API Keys**: All sensitive API keys are managed via environment variables and never exposed to the client-side (except for the Maps API key, which is restricted via Google Cloud Console).
- **Minimal Dependencies**: We keep our dependency tree small and updated to reduce the attack surface.

## Data Privacy

ElectIQ only stores chat history and quiz scores if Firebase is configured. No personally identifiable information (PII) is collected unless explicitly provided by the user in chat messages.

Thank you for helping keep ElectIQ secure!
