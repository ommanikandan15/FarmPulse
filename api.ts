export type Plot = {
  id: string; name: string; village: string; crop: string; area_acres: number;
  ndvi: number; ndwi: number; soil_moisture_pct: number | null; observed_symptoms: string[];
};
export type Advisory = {
  plot_id: string; status: "observe" | "attention" | "insufficient_data"; headline: string;
  reasons: string[]; next_steps: string[]; limitations: string[]; engine: string;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) }
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`API error ${response.status}: ${detail}`);
  }
  return response.json() as Promise<T>;
}
export const api = {
  plots: () => request<Plot[]>("/api/plots"),
  advisory: (plot: Plot) => request<Advisory>("/api/advisory", {
    method: "POST",
    body: JSON.stringify({
      plot_id: plot.id, ndvi: plot.ndvi, ndwi: plot.ndwi,
      soil_moisture_pct: plot.soil_moisture_pct,
      rainfall_last_7_days_mm: 8,
      farmer_notes: plot.observed_symptoms.join(", ")
    })
  }),
  weather: (latitude: number, longitude: number) =>
    request<{ source: string; is_live: boolean; summary: string; temperature_c: number | null; precipitation_mm: number | null }>(
      `/api/weather?latitude=${latitude}&longitude=${longitude}`
    )
};
