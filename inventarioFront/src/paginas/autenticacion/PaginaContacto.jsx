import { Card } from "primereact/card";
import { Divider } from "primereact/divider";

export default function PaginaContacto() {
  const titulo = "Información de Contacto";

  return (
    <div className="p-grid p-justify-center">
      <div className="p-col-12 p-md-8 p-lg-6">
        <Card title={titulo}>
          <p>
            Si tienes alguna pregunta, sugerencia o necesitas soporte, no dudes
            en contactarnos a través de los siguientes medios:
          </p>

          <Divider />

          <div>
            <i
              className="pi pi-envelope p-mr-2"
              style={{ verticalAlign: "middle" }}
            ></i>
            <span style={{ verticalAlign: "middle" }}>
              <strong>Email:</strong>{" "}
              <a href="mailto:tuemail@ejemplo.com">
                sistemas@laceja-antioquia-sistemas.gov.co
              </a>
            </span>
          </div>

          <Divider layout="vertical" />
          <div style={{ marginTop: "1rem" }}>
            <i
              className="pi pi-phone p-mr-2"
              style={{ verticalAlign: "middle" }}
            ></i>
            <span style={{ verticalAlign: "middle" }}>
              <strong>Teléfono:</strong> Teléfono conmutador: +57 (604) 5531414
              extención 1429 o extención 1430
            </span>
          </div>

          <Divider />

          <div style={{ marginTop: "1rem" }}>
            <i
              className="pi pi-map-marker p-mr-2"
              style={{ verticalAlign: "middle" }}
            ></i>
            <span style={{ verticalAlign: "middle" }}>
              <strong>Dirección:</strong> Carrera 20 # 19-78 Parque Principal,
              La Ceja - Antioquia
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}
