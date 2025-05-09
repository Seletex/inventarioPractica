import { Card } from "primereact/card";

export default function PaginaAcercaDe() {
  const titulo = "Acerca de la Aplicación de Inventario";
  const contenido = (
    <div>
      <p>
        Esta aplicación fue desarrollada como parte de mejorar el inventario de
        equipos de la oficina de sistemas, permitiendo gestionar eficientemente
        el inventario de equipos.
      </p>
      <p>
        Permite registrar, actualizar, dar de baja equipos, programar
        mantenimientos y generar reportes básicos.
      </p>
      <p>
        <strong>Tecnologías utilizadas:</strong> React, PrimeReact, Node.js (si
        aplica), [Otras tecnologías].
      </p>
    </div>
  );

  return (
    <div className="p-grid p-justify-center">
      <div className="p-col-12 p-md-8 p-lg-6">
        <Card title={titulo}>{contenido}</Card>
      </div>
    </div>
  );
}
