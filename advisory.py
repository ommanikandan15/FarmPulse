from .schemas import AdvisoryRequest, AdvisoryResponse

LIMITATIONS = [
    "This prototype uses simple demonstration thresholds, not locally validated agronomic thresholds.",
    "Vegetation and water indices can be affected by cloud cover, crop stage, sensor resolution, and data quality.",
    "Confirm field conditions with direct observation and a qualified local agricultural expert."
]


def generate_advisory(request: AdvisoryRequest) -> AdvisoryResponse:
    """Return an explainable demo advisory; this is not a crop disease diagnosis."""
    reasons: list[str] = []
    next_steps: list[str] = []
    attention = False

    if request.ndvi < 0.45:
        attention = True
        reasons.append(f"NDVI is {request.ndvi:.2f}, below the prototype's 0.45 watch threshold.")
        next_steps.append("Visit the plot and compare plant colour and growth with a healthy nearby area.")
    else:
        reasons.append(f"NDVI is {request.ndvi:.2f}; it does not cross this prototype's low-vegetation threshold.")

    if request.ndwi < -0.10:
        attention = True
        reasons.append(f"NDWI is {request.ndwi:.2f}, which this demo flags for a water-status check.")
        next_steps.append("Check standing water, soil wetness, irrigation timing, and recent rainfall in the field.")
    else:
        reasons.append(f"NDWI is {request.ndwi:.2f}; it does not cross this prototype's water-watch threshold.")

    if request.soil_moisture_pct is not None:
        if request.soil_moisture_pct < 25:
            attention = True
            reasons.append(f"Reported soil moisture is {request.soil_moisture_pct:.0f}%, below the demo's 25% watch threshold.")
            next_steps.append("Verify the sensor reading and inspect soil moisture before changing irrigation.")
        else:
            reasons.append(f"Reported soil moisture is {request.soil_moisture_pct:.0f}% and does not cross the demo threshold.")
    else:
        reasons.append("No soil-moisture reading was supplied, so this signal could not be assessed.")

    if request.rainfall_last_7_days_mm < 10:
        reasons.append(f"Rainfall input for the last 7 days is {request.rainfall_last_7_days_mm:.1f} mm; check whether this matches local records.")
    else:
        reasons.append(f"Rainfall input for the last 7 days is {request.rainfall_last_7_days_mm:.1f} mm.")

    if request.farmer_notes.strip():
        reasons.append("Farmer notes were provided; they should be reviewed alongside an on-site observation.")
        next_steps.append("Record the observation date and, if useful, share notes with a local agricultural officer.")

    if not next_steps:
        next_steps = [
            "Continue routine field scouting and compare with previous plot observations.",
            "Recheck indicators when recent, cloud-screened data are available."
        ]

    return AdvisoryResponse(
        plot_id=request.plot_id,
        status="attention" if attention else "observe",
        headline="Field check recommended" if attention else "Continue monitoring",
        reasons=reasons,
        next_steps=list(dict.fromkeys(next_steps)),
        limitations=LIMITATIONS,
    )
