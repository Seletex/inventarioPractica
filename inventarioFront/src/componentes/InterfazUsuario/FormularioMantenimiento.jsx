import { useState } from "react";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

export const FormMantenimiento = ({ mantenimiento, onSubmit, equipos }) => {
  const [setMostrarModal] = useState(false);
  const [setMantenimientoEditando] = useState(null);
  const [formData, setFormData] = useState(
    mantenimiento || {
      equipoId: "",
      tipo: "Preventivo",
      fechaProgramada: new Date(),
      descripcion: "",
      prioridad: "Media",
    }
  );

  const tiposMantenimiento = [
    { label: "Preventivo", value: "Preventivo" },
    { label: "Correctivo", value: "Correctivo" },
    { label: "Predictivo", value: "Predictivo" },
  ];

  const prioridades = [
    { label: "Alta", value: "Alta" },
    { label: "Media", value: "Media" },
    { label: "Baja", value: "Baja" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      fechaProgramada: formData.fechaProgramada.toISOString(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-fluid">
      <div className="field">
        <label>Equipo</label>
        <Dropdown
          value={formData.equipoId}
          options={equipos.map((e) => ({
            label: `${e.placa} - ${e.marca} (${e.modelo})`,
            value: e.id,
          }))}
          onChange={(e) => setFormData({ ...formData, equipoId: e.value })}
          placeholder="Seleccione un equipo"
          required
        />
      </div>

      <div className="field">
        <label>Tipo de mantenimiento</label>
        <Dropdown
          value={formData.tipo}
          options={tiposMantenimiento}
          onChange={(e) => setFormData({ ...formData, tipo: e.value })}
        />
      </div>

      <div className="field">
        <label>Fecha programada</label>
        <Calendar
          value={formData.fechaProgramada}
          onChange={(e) =>
            setFormData({ ...formData, fechaProgramada: e.value })
          }
          showIcon
          dateFormat="dd/mm/yy"
          required
        />
      </div>

      <div className="field">
        <label>Prioridad</label>
        <Dropdown
          value={formData.prioridad}
          options={prioridades}
          onChange={(e) => setFormData({ ...formData, prioridad: e.value })}
        />
      </div>

      <div className="field">
        <label>Descripción</label>
        <InputText
          value={formData.descripcion}
          onChange={(e) =>
            setFormData({ ...formData, descripcion: e.target.value })
          }
        />
      </div>

      <div className="flex justify-content-end gap-2 mt-4">
        <Button
          label="Cancelar"
          icon="pi pi-times"
          className="p-button-text"
          onClick={() => {
            setMostrarModal(false);
            setMantenimientoEditando(null);
          }}
        />
        <Button label="Guardar" icon="pi pi-check" type="submit" />
      </div>
    </form>
  );
};
