"""Local demo data repository. Replace with PostgreSQL/Firebase adapter for production."""

from app.schemas import Plot

DEMO_PLOTS = [
    Plot(id="TN-001", name="North Field", village="Thanjavur demo", area_acres=2.4,
         ndvi=0.39, ndwi=-0.18, soil_moisture_pct=22,
         observed_symptoms=["Uneven growth", "Dry patch reported"]),
    Plot(id="TN-002", name="Canal-side Field", village="Thiruvarur demo", area_acres=1.8,
         ndvi=0.68, ndwi=0.12, soil_moisture_pct=41,
         observed_symptoms=[]),
    Plot(id="TN-003", name="East Plot", village="Nagapattinam demo", area_acres=3.1,
         ndvi=0.52, ndwi=-0.04, soil_moisture_pct=None,
         observed_symptoms=["Needs field review"]),
]

def list_plots() -> list[Plot]:
    return DEMO_PLOTS

def get_plot(plot_id: str) -> Plot | None:
    return next((plot for plot in DEMO_PLOTS if plot.id == plot_id), None)