# FarmPulse Architecture

## Overview

- **React + TypeScript + Vite** provides the responsive web/PWA interface.
- **FastAPI** validates requests, serves plot records, exposes advisory routes, and optionally calls Open-Meteo.
- **Advisory rules** produce reasons, next steps, and limitations. They are intentionally transparent demo rules.
- **Demo repository** serves synthetic plot records. Replace this with a PostgreSQL or Firebase repository before production.
- **Satellite integration boundary** documents where Sentinel Hub or Google Earth Engine integration belongs; no live satellite data is fetched by default.
- **ML folder** demonstrates a synthetic scikit-learn workflow only.

## Request flow

1. The frontend requests `/api/plots`.
2. A user selects a plot.
3. The frontend submits plot indicators to `/api/advisory`.
4. FastAPI validates the payload and calls `generate_advisory`.
5. The UI displays the result, evidence, suggested next steps, and limitations.

## Production requirements

Add authentication and authorization, persistent storage migrations, structured logs, rate limiting, secret management, request tracing, backups, data-retention policies, consent controls, model monitoring, and agronomist-approved validation before field deployment.
