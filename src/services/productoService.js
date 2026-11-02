
const fs = require('fs');
const path = require('path');

// Carpeta de almacenamiento persistente
const carpetaDatos = process.env.DATA_DIR || path.join(__dirname, '../data');

fs.mkdirSync(carpetaDatos, { recursive: true });

// Archivo de productos
const archivo = path.join(carpetaDatos, 'productos.json');

// Crear archivo si no existe
if (!fs.existsSync(archivo)) {
    fs.writeFileSync(archivo, '[]');
}

// Leer productos
function obtenerProductos() {
    return JSON.parse(fs.readFileSync(archivo, 'utf8'));
}

// Guardar productos
function guardarProductos(productos) {
    fs.writeFileSync(archivo, JSON.stringify(productos, null, 2));
}

// Consultar todos
function listarProductos() {
    return obtenerProductos();
}

// Buscar por ID
function buscarProducto(id) {
    const productos = obtenerProductos();
    return productos.find(producto => producto.id === Number(id));
}

// Registrar producto
function crearProducto(datos) {
    const productos = obtenerProductos();

    let nuevoId;

    do {
        nuevoId = Math.floor(1000000 + Math.random() * 9000000);
    } while (productos.some(producto => producto.id === nuevoId));

    const nuevoProducto = {
        id: nuevoId,
        nombre: datos.nombre,
        categoria: datos.categoria,
        talla: datos.talla,
        marca: datos.marca,
        precio: Number(datos.precio),
        descripcion: datos.descripcion
    };

    productos.push(nuevoProducto);
    guardarProductos(productos);

    return nuevoProducto;
}

// Actualizar producto
function actualizarProducto(id, datos) {
    const productos = obtenerProductos();
    const indice = productos.findIndex(p => p.id === Number(id));

    if (indice === -1) return null;

    productos[indice] = {
        ...productos[indice],
        ...datos,
        id: Number(id),
        precio: Number(datos.precio)
    };

    guardarProductos(productos);
    return productos[indice];
}

// Eliminar producto
function eliminarProducto(id) {
    const productos = obtenerProductos();
    const nuevosProductos = productos.filter(p => p.id !== Number(id));

    if (productos.length === nuevosProductos.length) return false;

    guardarProductos(nuevosProductos);
    return true;
}

module.exports = {
    listarProductos,
    buscarProducto,
    crearProducto,
    actualizarProducto,
    eliminarProducto
};
