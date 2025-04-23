import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import {FormularioAutenticacion} from '../FormularioAutenticacion';
import {ProveedorAutenticacion} from '../../contexto/ContextoAutenticacion';

describe ('FormularioAutenticacion', () => {
    test('Valida el formulario de ingreso',async () => {
        const mockLogin = vi.fn();
        render(
            <ProveedorAutenticacion  value={{ login: mockLogin }}>
                <FormularioAutenticacion />
            </ProveedorAutenticacion>
        );
        fireEvent.submit(screen.getByRole('form'));
        expect(await screen.findAllByRole('alert')).toHaveLength(2);
        fireEvent.input(screen.getByLabelText('Correo Electrónico'), {
            target: { value: 'admin@inventario.com' }
        });
        fireEvent.input(screen.getByLabelText('Contraseña'), {
            target: { value: 'password123' }
        });
        fireEvent.submit(screen.getByRole('form'));

        expect(mockLogin).toHaveBeenCalledWith({
          email: 'admin@inventario.com',
          password: 'password123'
        });
    });
});