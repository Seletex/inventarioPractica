import { Link } from "react-router-dom";
import { Card } from "primereact/card";
import { Button } from "primereact/button";

export default function MenuMantenimientos() {
 
  const cardTitle = (
    <div className="flex items-center justify-between">
      <span>Menú de Mantenimientos</span>
     
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
  
    <div className="p-4 flex justify-center items-start min-h-screen bg-gray-100">
      <Card
        title={cardTitle}
        className="w-full max-w-lg shadow-lg"
        style={{ maxWidth: "400px", minWidth: "300px" }}
      >
        {" "}
      
        <div className="flex flex-col gap-4 p-4">
         
          <Link to="/mantenimientos-programados" className="no-underline">
            <Button
              label="Ver Mantenimientos Programados"
              icon="pi pi-calendar"
              className="p-button-info w-full text-left p-button-lg" 
              style={{ justifyContent: "flex-start" }} 
            />
          </Link>
          <p className="text-sm text-gray-600 -mt-2 ml-2">
            Visualiza y gestiona los mantenimientos ya programados.
          </p>
      
          <Link to="/programar-mantenimientos" className="no-underline">
            <Button
              label="Programar Mantenimientos (Lote)"
              icon="pi pi-calendar-plus"
              className="p-button-success w-full text-left p-button-lg"
              style={{ justifyContent: "flex-start" }}
            />
          </Link>
          <p className="text-sm text-gray-600 -mt-2 ml-2">
            Programa el mismo mantenimiento para varios equipos a la vez
            filtrando por criterios.
          </p>
      
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