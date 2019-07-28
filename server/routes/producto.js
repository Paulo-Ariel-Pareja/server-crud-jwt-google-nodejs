const express = require('express');
const app = express();

let { verificaToken } = require('./../middlewares/autenticacion');
let Producto = require('./../models/producto');

app.get('/productos', verificaToken, (req, res) => {
    const desde = req.query.desde || 0;
    desde = Number(desde);
    
    Producto.find({ disponible: true })
        .sort('nombre')
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };
            res.json({
                ok: true,
                producto
            })
        });
})

app.get('/productos/:id', verificaToken, (req, res) => {
    const id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };
            if (!producto) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'El ID no es correcto'
                    }
                })
            }
            res.json({
                ok: true,
                producto
            })
        })
});

app.post('/productos', verificaToken, (req, res) => {
    const body = req.body;

    const producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    })

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        res.status(201).json({
            ok: true,
            producto: productoDB
        })
    })

});

app.put('/productos/:id', verificaToken, (req, res) => {
    const id = req.params.id;
    const body = req.body;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!productoDB) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            })
        }
        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;

        productoDB.save((err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };
            res.json({
                ok: true,
                producto
            })
        })
    })
});

app.delete('/productos/:id', verificaToken, (req, res) => {
    const id = req.params.id;
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if(!productoDB){
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }
        productoDB.disponible = false;
        productoDB.save( (err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };
            res.json({
                ok: true,
                producto,
                mensaje: 'Producto deshabilitado'
            })
        })
    })
});

app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    const termino = req.params.termino;
    const regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .sort('nombre')
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };
            res.json({
                ok: true,
                producto
            })
        });
})


module.exports = app;