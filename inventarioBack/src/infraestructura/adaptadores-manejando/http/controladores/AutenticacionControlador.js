// src/infraestructura/adaptadores-manejando/http/AutenticacionControlador.js

// Importar Casos de Uso (o Servicios de Aplicación) necesarios
import LoginUsuarioCasoUso from '../../../aplicacion/casos-uso/autenticacion/LoginUsuarioCasoUso.js';
import RegistrarUsuarioCasoUso from '../../../aplicacion/casos-uso/autenticacion/RegistrarUsuarioCasoUso.js';
// Importar Repositorios y Servicios necesarios para instanciar los casos de uso
// ¡OJO! Idealmente, esto se haría fuera del controlador (Inyección de Dependencias)
import UsuarioRepositorioFirestore from '../../adaptadores-accionados/persistencia-firestore/UsuarioRepositorioFirestore.js';
import FirebaseAdminAuthAdapter from '../../adaptadores-accionados/autenticacion-firebase/FirebaseAdminAuthAdapter.js'; // Asumiendo que lo creaste
import BcryptAdapter from '../../adaptadores-accionados/seguridad/BcryptAdapter.js'; // Asumiendo un adaptador para hashing

// --- Inyección de Dependencias (Ejemplo simple, idealmente usar un contenedor DI) ---
// En una app real, las instancias se crearían y pasarían desde un punto central (ej. servidor.js o un contenedor)
const usuarioRepositorio = new UsuarioRepositorioFirestore();
const servicioAuth = new FirebaseAdminAuthAdapter(); // Implementación de IServicioAutenticacion
const servicioHashing = new BcryptAdapter(); // Implementación de IServicioHashing (necesitarías crear esta interfaz y adaptador)

const loginUsuarioCasoUso = new LoginUsuarioCasoUso(usuarioRepositorio, servicioAuth, servicioHashing);
const registrarUsuarioCasoUso = new RegistrarUsuarioCasoUso(usuarioRepositorio, servicioAuth, servicioHashing);
// --- Fin Inyección de Dependencias ---


class AutenticacionControlador {

    async login(req, res, next) {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ mensaje: 'Email y contraseña son requeridos.' });
        }

        try {
            // Llama al caso de uso de la capa de aplicación
            const { token, usuario } = await loginUsuarioCasoUso.ejecutar(email, password);

            // Respuesta exitosa
            res.status(200).json({
                mensaje: 'Login exitoso',
                token: token, // Podría ser un JWT o un token de sesión
                usuario: { // Devuelve solo la información necesaria del usuario
                    id: usuario.id,
                    nombre: usuario.nombre,
                    email: usuario.email,
                    roles: usuario.roles
                }
            });
        } catch (error) {
            // Manejo de errores específicos del caso de uso o genéricos
            console.error("Error en AutenticacionControlador.login:", error);
            if (error.message.includes('Credenciales inválidas') || error.message.includes('Usuario no encontrado')) {
                 res.status(401).json({ mensaje: 'Credenciales inválidas.' });
            } else {
                // Error genérico (podría pasarse a un middleware de errores)
                next(error); // Pasa el error al siguiente middleware (manejador de errores)
                // o res.status(500).json({ mensaje: 'Error interno del servidor.' });
            }
        }
    }

    async registrar(req, res, next) {
        const { nombre, email, password } = req.body;

        if (!nombre || !email || !password) {
            return res.status(400).json({ mensaje: 'Nombre, email y contraseña son requeridos.' });
        }
        // Aquí podrías añadir validaciones más robustas (longitud de contraseña, formato de email)

        try {
            const datosRegistro = { nombre, email, password };
            // Llama al caso de uso
            const usuarioCreado = await registrarUsuarioCasoUso.ejecutar(datosRegistro);

            res.status(201).json({
                mensaje: 'Usuario registrado exitosamente.',
                usuario: {
                    id: usuarioCreado.id, // ID de Firestore
                    authId: usuarioCreado.authId, // ID de Firebase Auth
                    nombre: usuarioCreado.nombre,
                    email: usuarioCreado.email,
                    roles: usuarioCreado.roles
                }
            });
        } catch (error) {
            console.error("Error en AutenticacionControlador.registrar:", error);
            if (error.message.includes('Email ya registrado')) {
                res.status(409).json({ mensaje: 'El correo electrónico ya está en uso.' });
            } else {
                 next(error); // Error genérico
                // o res.status(500).json({ mensaje: 'Error interno al registrar el usuario.' });
            }
        }
    }

    // Podrías añadir otros métodos como refreshToken, forgotPassword, etc.
}

// Exportar una instancia o la clase dependiendo de cómo configures tus rutas
export default new AutenticacionControlador();
