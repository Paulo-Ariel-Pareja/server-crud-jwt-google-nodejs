const jwt = require('jsonwebtoken');

const verificaToken = (req, res, next) => {
    const token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if(err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'token no valido'
                }
            });
        };
        req.usuario = decoded.usuario;
        next();
    });
};

const verificaAdminRole = (req, res, next) => {
    const token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if(err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'token no valido'
                }
            });
        };
        if('ADMIN_ROLE' !== decoded.usuario.role){
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'El usuario debe ser administrador'
                }
            });
        }
        
        next();
    });
};

const verificaTokenImg = (req, res, next) => {
    const token = req.query.token;
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if(err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'token no valido'
                }
            });
        };
        req.usuario = decoded.usuario
        next();
    });
}

module.exports = {
    verificaToken,
    verificaAdminRole,
    verificaTokenImg
}