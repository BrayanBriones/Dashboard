import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'

import { Grid } from '@mui/material';
import HeaderUI from './components/HeaderUI';
import AlertUI from './components/AlertUI';
import SelectorUI from './components/SelectorUI';
import IndicatorUI from './components/IndicatorUI';
import TableUI from './components/TableUI';
import ChartUI from './components/ChartUI';

import DataFetcher from './functions/DataFetcher';



function App() {
  const [city, setCity] = useState("guayaquil")
  const dataFetcherOutput = DataFetcher(city);
  const MAX = 25;

  return (
    <Grid container spacing={5} justifyContent="center" alignItems="center">

      {/* Encabezado */}
      <Grid size={{ xs: 12, md: 12 }}>
        <HeaderUI />
      </Grid>
      <Grid size={{ xs: 12, md: 12 }}>
      <div style={{ textAlign: "center", marginTop: "-25px" }}>
        <p style={{ fontSize: "1rem", color: "#555" }}>
          {city.charAt(0).toUpperCase() + city.slice(1)}, {new Date().toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </p>
      </div>
    </Grid>



      {/* Alertas */}
      <Grid size={{ xs: 12, md: 12 }} container justifyContent="right" alignItems="center">
        <AlertUI description="No se preveen lluvias" />
      </Grid>

      {/* Selector */}
      <Grid size={{ xs: 12, md: 3 }}>
        <SelectorUI onChange={setCity} />
      </Grid>

      {/* Indicadores */}
      <Grid container size={{ xs: 12, md: 9 }} >

        {/* Renderizado condicional de los datos obtenidos */}

        {dataFetcherOutput.loading && <p>Cargando datos...</p>}
        {dataFetcherOutput.error && <p>Error: {dataFetcherOutput.error}</p>}
        {dataFetcherOutput.data && (
          <>

            {/* Indicadores con datos obtenidos */}

            <Grid size={{ xs: 12, md: 3 }} >
              <IndicatorUI
                title='Temperatura (2m)'
                description={dataFetcherOutput.data.current.temperature_2m + " " + dataFetcherOutput.data.current_units.temperature_2m} />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <IndicatorUI
                title='Temperatura aparente'
                description={dataFetcherOutput.data.current.apparent_temperature + " " + dataFetcherOutput.data.current_units.apparent_temperature} />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <IndicatorUI
                title='Velocidad del viento'
                description={dataFetcherOutput.data.current.wind_speed_10m + " " + dataFetcherOutput.data.current_units.wind_speed_10m} />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <IndicatorUI
                title='Humedad relativa'
                description={dataFetcherOutput.data.current.relative_humidity_2m + " " + dataFetcherOutput.data.current_units.relative_humidity_2m} />
            </Grid>

          </>
        )}
      </Grid>

      {/* Gráfico */}
      <Grid size={{ xs: 6, md: 6 }} sx={{ display: { xs: "none", md: "block" } }}>

        {/* Indicadores con datos obtenidos */}

        {dataFetcherOutput.loading && <p>Cargando datos...</p>}
        {dataFetcherOutput.error && <p>Error: {dataFetcherOutput.error}</p>}
        {dataFetcherOutput.data && (
          <ChartUI
            time={dataFetcherOutput.data?.hourly.time.slice(0,MAX)}
            temperature_2m={dataFetcherOutput.data?.hourly.temperature_2m.slice(0,MAX)}
            wind_speed_10m={dataFetcherOutput.data?.hourly.wind_speed_10m.slice(0,MAX)}
          />
        )}

      </Grid>

      {/* Tabla */}
      <Grid size={{ xs: 6, md: 6 }} sx={{ display: { xs: "none", md: "block" } }}>
        {dataFetcherOutput.loading && <p>Cargando datos...</p>}
        {dataFetcherOutput.error && <p>Error: {dataFetcherOutput.error}</p>}
        {dataFetcherOutput.data && (
          <TableUI
            time={dataFetcherOutput.data?.hourly.time.slice(0,MAX)}
            temperature_2m={dataFetcherOutput.data?.hourly.temperature_2m.slice(0,MAX)}
            wind_speed_10m={dataFetcherOutput.data?.hourly.wind_speed_10m.slice(0,MAX)} />
        )}
      </Grid>

      {/* Información adicional */}
      <Grid size={{ xs: 12, md: 12 }}>Elemento: Información adicional</Grid>

    </Grid>
  )
}

export default App
