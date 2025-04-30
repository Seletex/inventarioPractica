// Archivo: src/paginas/autenticacion/MenuMantenimientos.jsx

import React from "react";
import { Link } from "react-router-dom";
import { Card } from "primereact/card";
import { Button } from "primereact/button";

export default function MenuMantenimientos() {
  // Título del Card con botón para volver al menú principal
  const cardTitle = (
    <div className="flex items-center justify-between">
      <span>Menú de Mantenimientos</span>
      {/* Asume que tienes una ruta '/menu' para el menú principal */}
      <Link to="/menu">
        <Button
          icon="pi pi-arrow-left"
          className="p-button-text p-button-sm"
          tooltip="Volver al Menú Principal"
          tooltipOptions={{ position: "bottom" }}
        />
      </Link>
    </div>
  );

  return (
    // Contenedor para centrar la tarjeta en la página
    <div className="p-4 flex justify-center items-start min-h-screen bg-gray-100">
      <Card
        title={cardTitle}
        className="w-full max-w-lg shadow-lg"
        style={{ maxWidth: "400px", minWidth: "300px" }}
      >
        {" "}
        {/* Ancho máximo para la tarjeta */}
        <div className="flex flex-col gap-4 p-4">
          {" "}
          {/* Espacio entre botones */}
          {/* 1. Botón para Ver Mantenimientos Programados */}
          <Link to="/mantenimientos-programados" className="no-underline">
            <Button
              label="Ver Mantenimientos Programados"
              icon="pi pi-calendar"
              className="p-button-info w-full text-left p-button-lg" // Botón grande, color info
              style={{ justifyContent: "flex-start" }} // Alinear icono y texto a la izquierda
            />
          </Link>
          <p className="text-sm text-gray-600 -mt-2 ml-2">
            Visualiza y gestiona los mantenimientos ya programados.
          </p>
          {/* 2. Botón para Programar Mantenimientos en Lote */}
          <Link to="/programar-mantenimientos" className="no-underline">
            <Button
              label="Programar Mantenimientos (Lote)"
              icon="pi pi-calendar-plus"
              className="p-button-success w-full text-left p-button-lg" // Botón grande, color success
              style={{ justifyContent: "flex-start" }}
            />
          </Link>
          <p className="text-sm text-gray-600 -mt-2 ml-2">
            Programa el mismo mantenimiento para varios equipos a la vez
            filtrando por criterios.
          </p>
          {/* 3. Nota sobre Nuevo Mantenimiento Individual */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
            <p className="flex items-center">
              <i className="pi pi-info-circle mr-2 flex-shrink-0" />
              <span>
                Para programar un{" "}
                <strong>nuevo mantenimiento individual</strong> para un equipo
                específico, ve a la sección de{" "}
                <strong>
                  <Link
                    to="/gestion-equipo"
                    className="font-semibold hover:underline"
                  >
                    Gestión de Equipos
                  </Link>
                </strong>{" "}
                y utiliza la acción correspondiente en la tabla de equipos. (La
                ruta sería algo como `/nuevo-mantenimiento/:placa`)
              </span>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

// --- CSS Adicional (opcional, puedes ponerlo en tu archivo CSS global) ---
/*
.no-underline {
  text-decoration: none;
}
*/
