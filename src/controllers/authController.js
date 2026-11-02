
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const SECRET = process.env.JWT_SECRET || 'modaplus_clave_secreta_2026';

// Carpeta de almacenamiento persistente
const carpetaDatos = process.env.DATA_DIR || path.join(__dirname, '../data');

fs.mkdirSync(carpetaDatos, { recursive: true });

// Archivo de usuarios
const archivoUsuarios = path.join(carpetaDatos, 'usuarios.json');

// Crear archivo si no existe
if (!fs.existsSync(archivoUsuarios)) {
    fs.writeFileSync(archivoUsuarios, '[]');
}

// Leer usuarios
function obtenerUsuarios() {
    return JSON.parse(fs.readFileSync(archivoUsuarios, 'utf8'));
}

// Guardar usuarios
function guardarUsuarios(usuarios) {
    fs.writeFileSync(archivoUsuarios, JSON.stringify(usuarios, null, 2));
}

// Proteger contraseña
function protegerContrasena(contrasena, salt = crypto.randomBytes(16).toString('hex')) {
    const hash = crypto.scryptSync(contrasena, salt, 64).toString('hex');
    return { salt, hash };
}

// Registrar usuario
function registro(req, res) {
    const { nombre, correo, contrasena } = req.body;

    if (!nombre || !correo || !contrasena) {
        return res.status(400).json({
            mensaje: 'Todos los campos son obligatorios'
        });
    }

    if (contrasena.length < 6) {
        return res.status(400).json({
            mensaje: 'La contraseña debe tener mínimo 6 caracteres'
        });
    }

    const usuarios = obtenerUsuarios();

    const correoExiste = usuarios.some(
        usuario => usuario.correo === correo.trim().toLowerCase()
    );

    if (correoExiste) {
        return res.status(409).json({
            mensaje: 'Este correo ya está registrado'
        });
    }

    let nuevoId;

    do {
        nuevoId = Math.floor(1000000 + Math.random() * 9000000);
    } while (usuarios.some(usuario => usuario.id === nuevoId));

    const seguridad = protegerContrasena(contrasena);

    const nuevoUsuario = {
        id: nuevoId,
        nombre: nombre.trim(),
        correo: correo.trim().toLowerCase(),
        salt: seguridad.salt,
        hash: seguridad.hash
    };

    usuarios.push(nuevoUsuario);
    guardarUsuarios(usuarios);

    res.status(201).json({
        mensaje: 'Usuario registrado correctamente',
        usuario: {
            id: nuevoUsuario.id,
            nombre: nuevoUsuario.nombre,
            correo: nuevoUsuario.correo
        }
    });
}

// Iniciar sesión
function login(req, res) {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
        return res.status(400).json({
            mensaje: 'Debes ingresar correo y contraseña'
        });
    }

    const usuarios = obtenerUsuarios();

    const usuario = usuarios.find(
        u => u.correo === correo.trim().toLowerCase()
    );

    if (!usuario) {
        return res.status(401).json({
            mensaje: 'Correo o contraseña incorrectos'
        });
    }

    const hashIngresado = crypto.scryptSync(
        contrasena,
        usuario.salt,
        64
    );

    const hashGuardado = Buffer.from(usuario.hash, 'hex');

    if (!crypto.timingSafeEqual(hashIngresado, hashGuardado)) {
        return res.status(401).json({
            mensaje: 'Correo o contraseña incorrectos'
        });
    }

    const token = jwt.sign(
        {
            id: usuario.id,
            correo: usuario.correo
        },
        SECRET,
        { expiresIn: '2h' }
    );

    res.status(200).json({
        mensaje: 'Inicio de sesión exitoso',
        token,
        usuario: {
            id: usuario.id,
            nombre: usuario.nombre,
            correo: usuario.correo
        }
    });
}

module.exports = { registro, login };
