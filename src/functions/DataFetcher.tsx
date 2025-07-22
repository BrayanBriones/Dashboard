import { useEffect, useState } from 'react';
import type{ OpenMeteoResponse } from '../types/DashboardTypes';

const CACHE_DURATION_MINUTES = 10;

const COORDINATES_MAP: Record<string, { latitude: string; longitude: string }> = {
  guayaquil: { latitude: "-2.17", longitude: "-79.92" },
  quito: { latitude: "-0.18", longitude: "-78.47" },
  cuenca: { latitude: "-2.90", longitude: "-79.00" }
};

const getCoordinates = (city: string) => COORDINATES_MAP[city] || { latitude: "0", longitude: "0" };

const getCacheKey = (lat: string, lon: string) => `open-meteo-${lat}-${lon}`;

const DataFetcher = (city: string) => {
  const [data, setData] = useState<OpenMeteoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { latitude, longitude } = getCoordinates(city);

      if (latitude === "0" && longitude === "0") {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      const cacheKey = getCacheKey(latitude, longitude);
      const cached = localStorage.getItem(cacheKey);

      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.timestamp && parsed.data) {
            const age = (Date.now() - parsed.timestamp) / 1000 / 60;
            if (age < CACHE_DURATION_MINUTES) {
              console.log("✅ Datos cargados desde localStorage (cache)");
              setData(parsed.data);
              setLoading(false);
              return;
            }
          }
        } catch (e) {
          console.warn("⚠️ Error al leer caché:", e);
        }
      }

      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,wind_speed_10m&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m&timezone=America%2FChicago`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        const result: OpenMeteoResponse = await response.json();

        console.log("🌐 Datos cargados desde API");
        setData(result);
        localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: result }));
      } catch (err) {
        if (cached) {
          try {
            const { data } = JSON.parse(cached);
            console.warn("⚠️ API falló. Usando datos cacheados antiguos.");
            setData(data);
          } catch (e) {
            console.error("❌ Error al usar datos cacheados:", e);
            setError(err instanceof Error ? err.message : 'Error desconocido');
          }
        } else {
          setError(err instanceof Error ? err.message : 'Error al conectar con la API');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [city]);

  return { data, loading, error };
};

export default DataFetcher;

