const express = require('express');
const app = express();

let { verificaToken, verificaAdminRole } = require('./../middlewares/autenticacion');

let Categoria = require('./../models/categoria');


app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categoria) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };
            res.json({
                ok: true,
                categoria
            })
        })
});

app.get('/categoria/:id', verificaToken, (req, res) => {
    const id = req.params.id;
    Categoria.findById(id, (err, categoria) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if(!categoria){
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            })
        }
        res.json({
            ok: true,
            categoria
        })
    })
});

app.post('/categoria', verificaToken, (req, res) => {
    const body = req.body;

    const categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario_id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })

});

app.put('/categoria/:id', verificaToken, (req, res) => {
    const id = req.params.id;
    const body = req.body;
    const descCategoria = {
        descripcion: body.descripcion
    }

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })
});

app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    const id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        };
        res.json({
            ok: true,
            message: 'Categoria borrada'
        })
    })
});

module.exports = app;