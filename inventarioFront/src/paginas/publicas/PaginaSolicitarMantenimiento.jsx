// src/paginas/publicas/PaginaSolicitarMantenimiento.jsx
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";
import { Link } from "react-router-dom";
import { DatosUbicacion } from "../../componentes/Datos/DatosUbicaciones"; // Ajusta la ruta si es necesario

export default function PaginaSolicitarMantenimiento() {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      nombreSolicitante: "",
      ubicacion: null, // El Dropdown de PrimeReact maneja mejor null o el objeto completo
      descripcionProblema: "",
    },
  });

  const onSubmit = (data) => {
    console.log("Solicitud de Mantenimiento Enviada:", data);
    // Aquí iría la lógica para enviar los datos al backend
    // Por ejemplo: api.post('/solicitudes-mantenimiento', data)
    alert("Solicitud enviada con éxito (simulación).");
    reset(); // Limpiar el formulario después de enviar
  };

  // Preparamos las opciones para el Dropdown, excluyendo la primera opción "Seleccione" si se maneja con placeholder
  const opcionesUbicacion = DatosUbicacion.filter(
    (opcion) => opcion.value !== ""
  );

  return (
    <div
      className="flex justify-content-center align-items-center min-h-screen p-4"
      style={{ fontFamily: "'Times New Roman', Times, serif" }}
    >
      <Card
        title="Solicitar Mantenimiento"
        className="w-full md:w-30rem lg:w-35rem"
        style={{
          borderRadius: "10px",
          border: "1px solid #e0e0e0",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
          <div className="field mb-4">
            <label
              htmlFor="nombreSolicitante"
              className="block text-900 font-medium mb-2"
            >
              Tu Nombre
            </label>
            <InputText
              id="nombreSolicitante"
              {...register("nombreSolicitante", {
                required: "Tu nombre es requerido.",
              })}
              placeholder="Ej: Ana Pérez"
              className={classNames({ "p-invalid": errors.nombreSolicitante })}
            />
            {errors.nombreSolicitante && (
              <small className="p-error block mt-1">
                {errors.nombreSolicitante.message}
              </small>
            )}
          </div>

          <div className="field mb-4">
            <label
            style ={{ fontFamily: "'Times New Roman', Times, serif", marginTop :"15px"}}
              htmlFor="ubicacion"
              className="block text-900 font-medium mb-2"
            >
              Ubicación donde se encuentra el problema
            </label>
            <Controller
              name="ubicacion"
              control={control}
              rules={{ required: "La ubicación es requerida." }}
              render={({ field, fieldState }) => (
                <Dropdown
                style = {{marginTop:"15px"}}
                  id={field.name}
                  value={field.value}
                  optionLabel="label" // Muestra el 'label' en el dropdown
                  optionValue="value" // El valor que se enviará será 'value'
                  placeholder="Seleccione la Ubicación"
                  options={opcionesUbicacion}
                  focusInputRef={field.ref}
                  onChange={(e) => field.onChange(e.value)}
                  className={classNames({ "p-invalid": fieldState.error })}
                />
              )}
            />
            {errors.ubicacion && (
              <small className="p-error block mt-1">
                {errors.ubicacion.message}
              </small>
            )}
          </div>

          <div className="field mb-4">
            
            <InputTextarea
            style={{ marginTop: "10px"}}
              id="descripcionProblema"
              {...register("descripcionProblema", {
                required: "La descripción es requerida.",
              })}
              rows={5}
              cols={30}
              autoResize
              placeholder="Describe el inconveniente  o problema que encontraste..."
              className={classNames({
                "p-invalid": errors.descripcionProblema,
              })}
            />
            {errors.descripcionProblema && (
              <small className="p-error block mt-1">
                {errors.descripcionProblema.message}
              </small>
            )}
          </div>

          <Button
            label="Enviar Solicitud"
            icon="pi pi-send"
            className="w-full mb-3"
            type="submit"
            disabled={!isValid}
          />
          <Link to="/login" className="p-button p-button-text w-full">
            <i className="pi pi-arrow-left mr-2"></i>
            Volver al Login
          </Link>
        </form>
      </Card>
    </div>
  );
}
