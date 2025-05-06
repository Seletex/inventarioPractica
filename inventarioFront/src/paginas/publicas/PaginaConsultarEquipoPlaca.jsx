// src/paginas/publicas/PaginaConsultarEquipo.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { Link } from "react-router-dom";
import { Divider } from "primereact/divider";

// Simulación de datos de equipo
const mockEquipoData = {
  ABC123X: {
    placa: "ABC123X",
    tipo: "Portátil",
    marca: "Dell",
    modelo: "Latitude 5400",
    ultimoMantenimiento: {
      fecha: "2023-10-15",
      realizadoPor: "Juan Técnico",
      descripcion: "Limpieza interna y actualización de software.",
    },
  },
  XYZ789Y: {
    placa: "XYZ789Y",
    tipo: "Impresora",
    marca: "HP",
    modelo: "LaserJet Pro M404dn",
    ultimoMantenimiento: {
      fecha: "2023-11-01",
      realizadoPor: "Ana Soporte",
      descripcion: "Cambio de tóner y revisión de rodillos.",
    },
  },
};

export default function PaginaConsultarEquipoPlaca() {
  const [equipoEncontrado, setEquipoEncontrado] = useState(null);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      placa: "",
    },
  });

  const onBuscar = (data) => {
    console.log("Buscando equipo con placa:", data.placa);
    setBusquedaRealizada(true);
    // Simulación de búsqueda
    const placaBuscada = data.placa.toUpperCase(); // Normalizar a mayúsculas
    const resultado = mockEquipoData[placaBuscada] || null;
    setEquipoEncontrado(resultado);
    // reset(); // Opcional: limpiar el campo después de buscar
  };

  return (
    <div
      className="flex justify-content-center align-items-center min-h-screen p-4"
      style={{ fontFamily: "'Times New Roman', Times, serif" }}
    >
      <Card
        title="Consultar Equipo por Placa"
        className="w-full md:w-30rem lg:w-35rem"
        style={{
          borderRadius: "10px",
          border: "1px solid #e0e0e0",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <form onSubmit={handleSubmit(onBuscar)} className="p-fluid">
          <div className="field mb-4">
            <label htmlFor="placa" className="block text-900 font-medium mb-2">
              Placa del Equipo
            </label>
            <span className="p-input-icon-left w-full">
              <i className="pi pi-desktop" />
              <InputText
                id="placa"
                {...register("placa", {
                  required: "La placa es requerida.",
                  minLength: {
                    value: 3,
                    message: "La placa debe tener al menos 3 caracteres.",
                  },
                })}
                placeholder="Ej: ABC123X"
                className={classNames("w-full", { "p-invalid": errors.placa })}
                onInput={(e) => {
                  e.target.value = e.target.value.toUpperCase(); // Convertir a mayúsculas mientras se escribe
                  register("placa").onChange(e); // Asegurar que react-hook-form reciba el cambio
                }}
              />
            </span>
            {errors.placa && (
              <small className="p-error block mt-1">
                {errors.placa.message}
              </small>
            )}
          </div>

          <Button
            label="Buscar Equipo"
            icon="pi pi-search"
            className="w-full mb-3"
            type="submit"
            disabled={!isValid}
          />
        </form>

        {busquedaRealizada && (
          <div className="mt-4">
            <Divider />
            <h3 className="text-lg font-semibold mb-3">
              Resultado de la Búsqueda
            </h3>
            {equipoEncontrado ? (
              <div className="text-left">
                <p>
                  <strong>Placa:</strong> {equipoEncontrado.placa}
                </p>
                <p>
                  <strong>Tipo:</strong> {equipoEncontrado.tipo}
                </p>
                <p>
                  <strong>Marca:</strong> {equipoEncontrado.marca}
                </p>
                <p>
                  <strong>Modelo:</strong> {equipoEncontrado.modelo}
                </p>
                {equipoEncontrado.ultimoMantenimiento ? (
                  <>
                    <p className="mt-2">
                      <strong>Último Mantenimiento:</strong>
                    </p>
                    <ul className="list-none p-0 m-0 ml-3">
                      <li>
                        Fecha: {equipoEncontrado.ultimoMantenimiento.fecha}
                      </li>
                      <li>
                        Realizado por:{" "}
                        {equipoEncontrado.ultimoMantenimiento.realizadoPor}
                      </li>
                      <li>
                        Descripción:{" "}
                        {equipoEncontrado.ultimoMantenimiento.descripcion}
                      </li>
                    </ul>
                  </>
                ) : (
                  <p className="mt-2">
                    <em>
                      No hay información de mantenimientos recientes para este
                      equipo.
                    </em>
                  </p>
                )}
              </div>
            ) : (
              <p>No se encontró ningún equipo con la placa proporcionada.</p>
            )}
          </div>
        )}
        <div className="mt-4">
          <Link to="/login" className="p-button p-button-text w-full">
            <i className="pi pi-arrow-left mr-2"></i>
            Volver al Login
          </Link>
        </div>
      </Card>
    </div>
  );
}
