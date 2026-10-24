from typing import Literal

from pydantic import BaseModel, Field


class Plot(BaseModel):
    id: str
    name: str
    village: str
    crop: str = "Paddy"
    area_acres: float = Field(gt=0)
    ndvi: float = Field(ge=-1, le=1)
    ndwi: float = Field(ge=-1, le=1)
    soil_moisture_pct: float | None = Field(default=None, ge=0, le=100)
    observed_symptoms: list[str] = []


class AdvisoryRequest(BaseModel):
    plot_id: str
    ndvi: float = Field(ge=-1, le=1)
    ndwi: float = Field(ge=-1, le=1)
    soil_moisture_pct: float | None = Field(default=None, ge=0, le=100)
    rainfall_last_7_days_mm: float = Field(default=0, ge=0)
    farmer_notes: str = Field(default="", max_length=1000)


class AdvisoryResponse(BaseModel):
    plot_id: str
    status: Literal["observe", "attention", "insufficient_data"]
    headline: str
    reasons: list[str]
    next_steps: list[str]
    limitations: list[str]
    engine: str = "transparent-rules-v1"