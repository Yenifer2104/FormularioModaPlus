
const servicio = require('../services/productoService');

// Validar que los campos de texto estén completos
function camposValidos(datos) {
    const { nombre, categoria, talla, marca, descripcion } = datos;

    return (
        typeof nombre === 'string' && nombre.trim() !== '' &&
        typeof categoria === 'string' && categoria.trim() !== '' &&
        typeof talla === 'string' && talla.trim() !== '' &&
        typeof marca === 'string' && marca.trim() !== '' &&
        typeof descripcion === 'string' && descripcion.trim() !== ''
    );
}

// Validar precio
function precioValido(precio) {
    return precio !== undefined &&
        precio !== null &&
        String(precio).trim() !== '' &&
        Number.isFinite(Number(precio)) &&
        Number(precio) > 0;
}

// Validar ID
function idValido(id) {
    return /^\d+$/.test(id) && Number.isSafeInteger(Number(id)) && Number(id) > 0;
}

// Consultar todos los productos
function listar(req, res) {
    res.status(200).json(servicio.listarProductos());
}

// Consultar un producto
function obtener(req, res) {
    const id = req.params.id;

    if (!idValido(id)) {
        return res.status(400).json({
            mensaje: 'El ID debe ser un número entero positivo'
        });
    }

    const producto = servicio.buscarProducto(id);

    if (!producto) {
        return res.status(404).json({
            mensaje: 'Producto no encontrado'
        });
    }

    res.status(200).json(producto);
}

// Registrar producto
function crear(req, res) {
    const datos = req.body || {};

    if (!camposValidos(datos) || datos.precio === undefined) {
        return res.status(400).json({
            mensaje: 'Todos los campos son obligatorios'
        });
    }

    if (!precioValido(datos.precio)) {
        return res.status(400).json({
            mensaje: 'El precio debe ser un número mayor que cero'
        });
    }

    const producto = servicio.crearProducto(datos);

    res.status(201).json({
        mensaje: 'Producto registrado correctamente',
        producto
    });
}

// Actualizar producto
function actualizar(req, res) {
    const id = req.params.id;
    const datos = req.body || {};

    if (!idValido(id)) {
        return res.status(400).json({
            mensaje: 'El ID debe ser un número entero positivo'
        });
    }

    if (!camposValidos(datos) || datos.precio === undefined) {
        return res.status(400).json({
            mensaje: 'Todos los campos son obligatorios'
        });
    }

    if (!precioValido(datos.precio)) {
        return res.status(400).json({
            mensaje: 'El precio debe ser un número mayor que cero'
        });
    }

    const producto = servicio.actualizarProducto(id, datos);

    if (!producto) {
        return res.status(404).json({
            mensaje: 'Producto no encontrado'
        });
    }

    res.status(200).json({
        mensaje: 'Producto actualizado correctamente',
        producto
    });
}

// Eliminar producto
function eliminar(req, res) {
    const id = req.params.id;

    if (!idValido(id)) {
        return res.status(400).json({
            mensaje: 'El ID debe ser un número entero positivo'
        });
    }

    const eliminado = servicio.eliminarProducto(id);

    if (!eliminado) {
        return res.status(404).json({
            mensaje: 'Producto no encontrado'
        });
    }

    res.status(200).json({
        mensaje: 'Producto eliminado correctamente'
    });
}

module.exports = {
    listar,
    obtener,
    crear,
    actualizar,
    eliminar
};
