# API Examples

Run the API at `http://127.0.0.1:8000` first.

## Health check

```bash
curl http://127.0.0.1:8000/health
```

## List plots

```bash
curl http://127.0.0.1:8000/api/plots
```

## Create an explainable advisory

```bash
curl -X POST http://127.0.0.1:8000/api/advisory \\
  -H "Content-Type: application/json" \\
  -d '{"plot_id":"TN-001","ndvi":0.39,"ndwi":-0.18,"soil_moisture_pct":22,"rainfall_last_7_days_mm":8,"farmer_notes":"Uneven growth reported"}'
```

## Weather endpoint

```bash
curl "http://127.0.0.1:8000/api/weather?latitude=10.787&longitude=79.137"
```

Weather returns a labelled demo fallback unless `ENABLE_LIVE_WEATHER=true` is configured.
