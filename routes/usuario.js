var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();
var Usuario = require('../models/usuario');
// rutas
/* 
    Obtener todos los usuarios
*/
app.get('/', (req, res, next) => {
    Usuario.find({}, '')
        .exec(
            (err, usuarios) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuarios',
                        errors: err
                    });
                }
                Usuario.countDocuments({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        usuarios: usuarios,
                        total: conteo
                    });
                });
            });
});

/* 
    Obtener un usuario
*/
app.get('/:id', (req, res, next) => {
    var id = req.params.id;
    Usuario.findById(id, '')
        .exec(
            (err, usuario) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuario',
                        errors: err
                    });
                }
                Usuario.countDocuments({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        usuario: usuario,
                        total: conteo
                    });
                });
            });
});
/* 
    Actualizar datos usuario sin password
*/
app.put('/:id', (req, res) => {
    var id = req.params.id;
    var body = req.body;
    Usuario.findById(id, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al buscar usuario, usuario con id ' + id + ' no existe',
                errors: { message: 'No exite un usuario con ese ID' }
            });
        }
        usuario.nombre = body.nombre;
        usuario.apellidos = body.apellidos;
        usuario.email = body.email;
        // usuario.telefono = body.telefono;
        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }
            usuarioGuardado.password = ':v';
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });
        });

    });
});
/* 
    Actualizar datos usuario con password
*/
app.put('/actualizar/:id', (req, res) => {
    var id = req.params.id;
    var body = req.body;
    Usuario.findById(id, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al buscar usuario, usuario con id ' + id + ' no existe',
                errors: { message: 'No exite un usuario con ese ID' }
            });
        }
        usuario.nombre = body.nombre;
        usuario.apellidos = body.apellidos;
        usuario.email = body.email;
        // usuario.telefono = body.telefono;
        usuario.password = bcrypt.hashSync(body.password, 10);
        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }
            usuarioGuardado.password = ':v';
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });
        });
    });
});
/* 
    Actualizar password usuario
*/
app.put('/cambiarPassword/:id', (req, res) => {
    var id = req.params.id;
    var body = req.body;
    Usuario.findById(id, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al buscar usuario, usuario con id ' + id + ' no existe',
                errors: { message: 'No exite un usuario con ese ID' }
            });
        }
        usuario.password = bcrypt.hashSync(body.password, 10);
        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar la contraseña',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });
        });
    });
});

/* 
    Crear un nuevo usuario
*/
app.post('/', (req, res) => {
    var body = req.body;
    var usuario = new Usuario({
        nombre: body.nombre,
        apellidos: body.apellidos,
        email: body.email,
        telefono: body.telefono,
        password: bcrypt.hashSync(body.password, 10)
    });
    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error cargando usuarios',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuarioToken: req.usuario
        });
    });
});

/* 
    Borrar un usuario por el id
*/
app.delete('/:id', (req, res) => {
    var id = req.params.id;
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrando usuario',
                errors: err
            });
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error borrando usuario, no existe un usuario con ese ID',
                errors: { message: 'No existe ningun usuario con ese ID' }
            });
        }
        return res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});

module.exports = app;