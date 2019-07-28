const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('./../models/usuario');
const Producto =require('./../models/producto');
const fs = require('fs');
const path = require('path');

app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', function (req, res) {
    const tipo = req.params.tipo;
    const id = req.params.id;

    if (Object.keys(req.files).length == 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se selecciono ningun archivo'
            }
        });
    };

    const tiposValidos = ['productos', 'usuarios'];
    
    if(tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidas son ' + tiposValidos.join(', ')
            }
        });
    }

    const archivo = req.files.archivo;
    const nombreProvisorio = archivo.name.split('.');
    const extension = nombreProvisorio[nombreProvisorio.length - 1];

    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif']

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(', ')
            }
        })
    }

    const nombreArchivo = `${id}-${ new Date().getMilliseconds() }.${extension}`;

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

            if(tipo === 'usuarios'){
                imagenUsuario(id, res, nombreArchivo);
            }else{
                imagenProducto(id, res, nombreArchivo);
            }
        
    });
});

function imagenUsuario(id, res, nombreArchivo){
    Usuario.findById(id, (err, usuarioDB) =>{
        if(err){
            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if(!usuarioDB){
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            });
        };

        borrarArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioGuardado) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            };
    
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })
        })

    })
}

function borrarArchivo(nombreImagen, tipo){
    const pathImagen = path.resolve(__dirname, `./../../uploads/${tipo}/${nombreImagen}`);
    if( fs.existsSync(pathImagen) ){
        fs.unlinkSync(pathImagen);
    }
}

function imagenProducto(id, res, nombreArchivo){
    Producto.findById(id, (err, productoDB) =>{
        if(err){
            borrarArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if(!productoDB){
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        };

        borrarArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;
        productoDB.save((err, productoGuardado) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            };
    
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            })
        })

    })
}

module.exports = app;