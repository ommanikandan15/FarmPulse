import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from .schemas import AdvisoryRequest, AdvisoryResponse
from .advisory import generate_advisory
from .storage import list_plots, get_plot
from .weather import get_weather
from .integrations.satellite import satellite_integration_status

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    yield

app = FastAPI(
    title="FarmPulse API",
    description="Explainable crop-stress advisory prototype. Demo outputs are not agronomic diagnoses.",
    version="1.0.0",
    lifespan=lifespan,
)

origins = [x.strip() for x in os.getenv(
    "CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173"
).split(",") if x.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"name": "FarmPulse API", "docs": "/docs", "status": "prototype"}

@app.get("/health")
def health():
    return {"status": "ok", "project": "FarmPulse"}

@app.get("/api/plots")
def plots():
    return [plot.model_dump() for plot in list_plots()]

@app.get("/api/plots/{plot_id}")
def plot_detail(plot_id: str):
    plot = get_plot(plot_id)
    if not plot:
        raise HTTPException(status_code=404, detail="Plot not found")
    return plot.model_dump()

@app.post("/api/advisory", response_model=AdvisoryResponse)
def advisory(payload: AdvisoryRequest):
    if not get_plot(payload.plot_id):
        raise HTTPException(status_code=404, detail="Plot not found in demo repository")
    return generate_advisory(payload)

@app.get("/api/weather")
async def weather(latitude: float, longitude: float):
    if not (-90 <= latitude <= 90 and -180 <= longitude <= 180):
        raise HTTPException(status_code=422, detail="Latitude/longitude out of range")
    return await get_weather(latitude, longitude)

@app.get("/api/integrations/satellite")
def satellite_status():
    return satellite_integration_status()
