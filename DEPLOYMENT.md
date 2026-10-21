# Deployment Checklist

This starter is intended for local development. Before public deployment:

- [ ] Configure HTTPS and secure hosting.
- [ ] Add authentication, roles, and tenant/plot-level authorization.
- [ ] Use PostgreSQL or Firebase with migrations, backups, and access rules.
- [ ] Store credentials in the deployment platform's secret manager.
- [ ] Configure allowed CORS origins for the real frontend domain.
- [ ] Add monitoring, logs, health checks, rate limits, and alerting.
- [ ] Review privacy, consent, data minimization, retention, and deletion.
- [ ] Validate advisory thresholds and any ML model with agricultural experts.
- [ ] Display data source, timestamp, quality, and uncertainty for every real input.
- [ ] Test accessibility and low-connectivity behaviour on target phones.
- [ ] Review provider licensing, quotas, and terms for satellite/weather data.

Do not deploy demo thresholds as production recommendations.
