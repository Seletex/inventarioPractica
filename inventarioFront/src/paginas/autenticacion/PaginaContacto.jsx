// Archivo: src/paginas/PaginaContacto.jsx (o donde decidas ubicarlo)

import React from 'react';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider'; // Opcional: para separar secciones

export default function PaginaContacto()  {

    const titulo = "Información de Contacto";

    return (
        <div className="p-grid p-justify-center">
            <div className="p-col-12 p-md-8 p-lg-6">
                <Card title={titulo}>
                    <p>
                        Si tienes alguna pregunta, sugerencia o necesitas soporte,
                        no dudes en contactarnos a través de los siguientes medios:
                    </p>

                    <Divider /> {/* Separador visual */}

                    <div>
                        <i className="pi pi-envelope p-mr-2" style={{ verticalAlign: 'middle' }}></i>
                        <span style={{ verticalAlign: 'middle' }}>
                            <strong>Email:</strong> <a href="mailto:tuemail@ejemplo.com">tuemail@ejemplo.com</a>
                        </span>
                    </div>

                    <Divider layout="vertical" /> {/* Otra opción de separador */}

                    <div style={{ marginTop: '1rem' }}>
                        <i className="pi pi-phone p-mr-2" style={{ verticalAlign: 'middle' }}></i>
                        <span style={{ verticalAlign: 'middle' }}>
                            <strong>Teléfono:</strong> +1 234 567 890
                        </span>
                    </div>

                     <Divider />

                    <div style={{ marginTop: '1rem' }}>
                        <i className="pi pi-map-marker p-mr-2" style={{ verticalAlign: 'middle' }}></i>
                        <span style={{ verticalAlign: 'middle' }}>
                            <strong>Dirección:</strong> Calle Falsa 123, Ciudad, País
                        </span>
                    </div>

                     {/* Puedes añadir más información o un formulario de contacto si lo necesitas */}
                </Card>
            </div>
        </div>
    );
};


