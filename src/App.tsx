
import './App.css'
import { Grid } from '@mui/material';

function App() {

  return (
        <Grid container spacing={5} justifyContent="center" alignItems="center">

         {/* Encabezado */}
         <Grid>Elemento: Encabezado</Grid>

         {/* Alertas */}
         <Grid>Elemento: Alertas</Grid>

         {/* Selector */}
         <Grid>Elemento: Selector</Grid>

         {/* Indicadores */}
         <Grid>Elemento: Indicadores</Grid>

         {/* Gráfico */}
         <Grid>Elemento: Gráfico</Grid>

         {/* Tabla */}
         <Grid>Elemento: Tabla</Grid>

         {/* Información adicional */}
         <Grid>Elemento: Información adicional</Grid>

      </Grid>
  )
}

export default App
