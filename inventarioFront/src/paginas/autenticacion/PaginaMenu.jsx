import React, { useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { rolUsuarioArray } from "../../componentes/Datos/RolUsuario";

// Configuración de permisos por rol
const permisosPorRol = {
  Administrador: {
    gestionEquipo: true,
    gestionMantenimientos: true,
    gestionUsuarios: true,
    importarExportar: true,
    reportes: true,
    consultas: true,
  },

  UsuarioAdministrativo: {
    gestionEquipo: true,
    gestionMantenimientos: true,
    gestionUsuarios: false,
    importarExportar: true,
    reportes: true,
    consultas: true,
  },
  Consultor: {
    gestionEquipo: false,
    gestionMantenimientos: false,
    gestionUsuarios: false,
    importarExportar: false,
    reportes: true,
    consultas: true,
  },
};

export default function PaginaMenu() {
  const { usuario, logout } = useState(""); // Asume que tu AuthContext proporciona el usuario actual
  const [vistaActual, setVistaActual] = useState("menu");
  const [permisosEquipo] = useState({
    gestionEquipo: true, // Simula los permisos del usuario
  });

  // Obtener permisos del usuario actual
  const rolValido = rolUsuarioArray.some((rol) => rol.value === usuario?.rol);
  const permisos = rolValido ? permisosPorRol[usuario.rol] : {};
  if (vistaActual === "gestion-equipos") {
    return <GestionEquipos onVolver={() => setVistaActual("menu")} />;
  }
  return (
    <div className="w-full flex flex-col gap-3 p-0">
      <Card
        title={`Sistema de Gestión de Equipos y Mantenimientos`}
        subTitle={`Bienvenido ${usuario?.nombre || "Invitado"}`}
        className="w-full md:w-30rem"
        style={{
          width: "400px",
          borderRadius: "10px",
          border: "1px solid #e0e0e0",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          fontFamily: "'Times New Roman', Times, serif",
        }}
      >
        <div
          className="w-full flex flex-col gap-3 p-0"
          style={{ width: "100%" }}
        >
          {/* Sección Gestión Operativa */}
          <div>
            <h3 className="">Gestión Operativa</h3>
            <div className="w-full flex flex-col gap-2">
              {permisosEquipo.gestionEquipo && (
                <Button
                  style={{
                    fontFamily: "'Times New Roman', Times, serif",
                    width: "100%",
                    fontSize: "16px",
                  }}
                  onClick={() => setVistaActual("gestion-equipos")}
                  label="Gestionar Equipo"
                  icon="pi pi-box"
                  className="w-full"
                  disabled={!permisos.gestionEquipo}
                  tooltip={
                    !permisos.gestionEquipo
                      ? "No tienes permisos para esta acción"
                      : ""
                  }
                />
              )}
              <Button
                label="Gestionar Mantenimientos"
                icon="pi pi-wrench"
                className="w-full"
                disabled={!permisos.gestionMantenimientos}
                tooltip={
                  !permisos.gestionMantenimientos
                    ? "No tienes permisos para esta acción"
                    : ""
                }
              />
              <Button
                label="Gestionar Usuarios"
                icon="pi pi-users"
                className="w-full"
                disabled={!permisos.gestionUsuarios}
                tooltip={
                  !permisos.gestionUsuarios
                    ? "Solo disponible para Administradores"
                    : ""
                }
              />
            </div>
          </div>

          {/* Sección Operaciones de Consulta */}
          <div>
            <h3 className="w-full text-lg font-semibold mb-3 border-b pb-2">
              Operaciones de Consulta
            </h3>
            <div className="space-y-2">
              <Button
                label="Importar / Exportar"
                icon="pi pi-file-import"
                className="w-full"
                severity="danger"
                disabled={!permisos.importarExportar}
              />
              <Button
                label="Reportes"
                icon="pi pi-file-pdf"
                className="w-full"
                disabled={!permisos.reportes}
              />
              <Button
                label="Consultas"
                icon="pi pi-search"
                className="w-full"
                disabled={!permisos.consultas}
              />
            </div>
          </div>

          {/* Botón de Cerrar Sesión */}
          <Button
            label="Cerrar Sesión"
            icon="pi pi-sign-out"
            className="w-full mt-6"
            style={{ backgroundColor: "#3b82f6", color: "white" }}
            onClick={logout}
          />
        </div>
      </Card>
    </div>
  );
}
