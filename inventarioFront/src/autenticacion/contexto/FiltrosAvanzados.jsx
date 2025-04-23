import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';


export const FiltrosAvanzados = ({ filtros, setFiltros, onFiltrar, onReset }) => {
  const estados = [
    { label: 'Activo', value: 'activo' },
    { label: 'En mantenimiento', value: 'mantenimiento' },
    { label: 'Dado de baja', value: 'baja' }
  ];

  return (
    <div className="p-fluid grid p-4 border-round shadow-1 surface-card">
      <div className="col-12 md:col-4">
        <label htmlFor="placa">Placa</label>
        <InputText
          id="placa"
          value={filtros.placa || ''}
          onChange={(e) => setFiltros({...filtros, placa: e.target.value })}
          placeholder="Buscar por placa"
        />
      </div>

      <div className="col-12 md:col-4">
        <label htmlFor="marca">Marca</label>
        <InputText
          id="marca"
          value={filtros.marca || ''}
          onChange={(e) => setFiltros({...filtros, marca: e.target.value })}
          placeholder="Buscar por marca"
        />
      </div>

      <div className="col-12 md:col-4">
        <label htmlFor="modelo">Modelo</label>
        <InputText
          id="modelo"
          value={filtros.modelo || ''}
          onChange={(e) => setFiltros({...filtros, modelo: e.target.value })}
          placeholder="Buscar por modelo"
        />
      </div>

      <div className="col-12 md:col-4">
        <label htmlFor="estado">Estado</label>
        <Dropdown
          id="estado"
          options={estados}
          value={filtros.estado || ''}
          onChange={(e) => setFiltros({...filtros, estado: e.value })}
          placeholder="Seleccione estado"
        />
      </div>

      <div className="col-12 md:col-4">
        <label htmlFor="fecha_inicio">Fecha desde</label>
        <Calendar
          id="fecha_inicio"
          value={filtros.fecha_inicio || null}
          onChange={(e) => setFiltros({...filtros, fecha_inicio: e.value })}
          showIcon
          dateFormat="dd/mm/yy"
        />
      </div>

      <div className="col-12 md:col-4">
        <label htmlFor="fecha_fin">Fecha hasta</label>
        <Calendar
          id="fecha_fin"
          value={filtros.fecha_fin || null}
          onChange={(e) => setFiltros({...filtros, fecha_fin: e.value })}
          showIcon
          dateFormat="dd/mm/yy"
          minDate={filtros.fecha_inicio}
        />
      </div>

      <div className="col-12 flex justify-content-end gap-2 mt-3">
        <Button
          label="Limpiar"
          icon="pi pi-filter-slash"
          className="p-button-outlined"
          onClick={onReset}
        />
        <Button
          label="Filtrar"
          icon="pi pi-filter"
          onClick={onFiltrar}
        />
      </div>
    </div>
  );
};