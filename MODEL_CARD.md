# Model / Advisory Card

## System name
FarmPulse transparent-rules advisory prototype.

## Intended use
Demonstrate how vegetation/water indicators, a moisture input, rainfall context, and farmer notes can be displayed with plain-language explanations for paddy plot monitoring.

## Not intended for
Confirmed disease diagnosis, autonomous irrigation decisions, fertilizer or pesticide recommendations, or any high-impact farm-management action without field verification and qualified local advice.

## Method
Hand-authored threshold rules in `backend/app/advisory.py`. Thresholds are illustrative and have not been validated for local crop stage, cultivar, soil, weather, sensor type, or acquisition quality.

## Data
Synthetic demo plot records. The optional weather endpoint may query Open-Meteo only when explicitly enabled. Satellite indices and ML predictions are not live/validated in this starter.

## Limitations and risks
Cloud cover, spatial resolution, acquisition timing, crop stage, mixed pixels, sensor calibration, missing values, and local variation can change interpretation. A threshold crossing is not a diagnosis. Model explainability does not prove correctness.

## Validation required
Collect representative consented field observations; establish expert labels and protocols; evaluate across farms, seasons, regions, and crop stages; quantify false positives/negatives; validate calibration and usability; document uncertainty; and obtain agricultural-expert review before deployment.
