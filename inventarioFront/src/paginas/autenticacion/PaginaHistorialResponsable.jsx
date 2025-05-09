import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { obtenerHistorialResponsable } from "../../api/responsableApi";
import { DataGrid } from "@mui/x-data-grid";
import { Container, Typography, Box } from "@mui/material";

function PaginaHistorialResponsable() {
  const { idResponsable } = useParams();
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarHistorial = async () => {
      try {
        const data = await obtenerHistorialResponsable(idResponsable);
        setHistorial(data);
      } catch (err) {
        setError(err.message || "Error al cargar el historial");
      } finally {
        setLoading(false);
      }
    };

    cargarHistorial();
  }, [idResponsable]);

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "fecha", headerName: "Fecha", width: 150 },
    { field: "accion", headerName: "Acción", width: 150 },
    { field: "descripcion", headerName: "Descripción", width: 300 },
  ];

  const rows = historial.map((item, index) => ({
    id: index + 1,
    fecha: new Date(item.fecha).toLocaleDateString(),
    accion: item.accion,
    descripcion: item.descripcion,
  }));

  if (loading) {
    return <Typography>Cargando historial...</Typography>;
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  return (
    <Container>
      <Box mt={4}>
        <Typography variant="h4" gutterBottom>
          Historial del Responsable
        </Typography>
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
          />
        </div>
      </Box>
    </Container>
  );
}

export default PaginaHistorialResponsable;
