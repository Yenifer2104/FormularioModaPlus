
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'modaplus_clave_secreta_2026';

function verificarToken(req, res, next) {
    const encabezado = req.headers.authorization;

    if (!encabezado || !encabezado.startsWith('Bearer ')) {
        return res.status(401).json({
            mensaje: 'Acceso denegado. Debes iniciar sesión.'
        });
    }

    const token = encabezado.split(' ')[1];

    try {
        const verificado = jwt.verify(token, SECRET);
        req.usuario = verificado;
        next();
    } catch (error) {
        return res.status(403).json({
            mensaje: 'Token inválido o vencido.'
        });
    }
}

module.exports = verificarToken;
