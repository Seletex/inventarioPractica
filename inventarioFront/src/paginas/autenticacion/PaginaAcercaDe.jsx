// Archivo: src/paginas/PaginaAcercaDe.jsx (o donde decidas ubicarlo)

import React from 'react';
import { Card } from 'primereact/card'; // Opcional: para darle un contenedor estilizado

export default function PaginaAcercaDe (){

    const titulo = "Acerca de la Aplicación de Inventario";
    const contenido = (
        <div>
            <p>
                Esta aplicación fue desarrollada como parte de [Menciona el propósito, ej: una práctica, un proyecto final, etc.]
                para gestionar eficientemente el inventario de equipos.
            </p>
            <p>
                Permite registrar, actualizar, dar de baja equipos, programar mantenimientos
                y generar reportes básicos.
            </p>
            <p>
                <strong>Tecnologías utilizadas:</strong> React, PrimeReact, Node.js (si aplica), [Otras tecnologías].
            </p>
            {/* Puedes añadir más detalles aquí: versión, autor, etc. */}
        </div>
    );

    return (
        <div className="p-grid p-justify-center"> {/* Centra la tarjeta */}
            <div className="p-col-12 p-md-8 p-lg-6"> {/* Define el ancho de la tarjeta */}
                <Card title={titulo}>
                    {contenido}
                </Card>
            </div>
        </div>
    );
};


