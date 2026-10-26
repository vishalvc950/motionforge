# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 2.4.x   | :white_check_mark: |

## Security Architecture Notes

- **Configuration Validation**: All incoming URL query parameters and user inputs pass through `validateAndClampConfig` in `src/registry/animations.ts`, clamping numeric ranges and whitelisting enum keys to prevent resource exhaustion (DoS via unbounded particle/fragment counts) or code injection in exported templates.
- **No Sensitive URL State**: Shareable preset URLs serialize only numeric, boolean, and whitelisted palette identifiers.

## Reporting a Vulnerability

Please report suspected vulnerabilities privately via GitHub Security Advisories rather than public issue trackers.
