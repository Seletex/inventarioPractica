import React from 'react'; // Importa React
import {render,screen} from '@testing-library/react';
import {test, expect,describe } from 'vitest';
import '@testing-library/jest-dom/vitest';
import {FormularioEquipos} from '../FormularioEquipos';





describe('FormularioEquipos', () => {
    test('Muestra campos requeridos', () => {
        render(<FormularioEquipos />);
        expect(screen.getByLabelText(/placa/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Modelo/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/ubicación/i)).toBeInTheDocument();
    });
    /*test('Muestra campos opcionales', () => {
        render(<FormularioEquipos />);
        expect(screen.getByPlaceholderText('Garantía')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Capacidad de Almacenamiento')).toBeInTheDocument();
    });*/
    test('Muestra el botón de guardar', () => {
        render(<FormularioEquipos />);
        expect(screen.getByText('Guardar Equipo')).toBeInTheDocument();
    });
});