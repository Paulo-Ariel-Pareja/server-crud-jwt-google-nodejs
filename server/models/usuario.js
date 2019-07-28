const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');


const rolesValidos = {
  values: ['ADMIN_ROLE', 'USER_ROLE'],
  message: '{VALUE} no es un rol valido'
};

const usuarioSchema = new Schema({
  nombre: {
      type: String,
      required: [true, 'El nombre es requerido'],
  },
  email: {
      type: String,
      required: [true, 'El correo es requerido'],
      unique: true
  },
  password: {
      type: String,
      required: [true, 'La contraseña es obligatoria']
  },
  img: {
    type: String,
    required: false
  },
  role:{
    type: String,
    default: 'USER_ROLE',
    enum: rolesValidos
  },
  estado:{
    type: Boolean,
    default: true
  },
  google: {
    type: Boolean,
    default: false
  }
});

usuarioSchema.methods.toJSON = function() {
  const user = this;
  let userObject = user.toObject();
  delete userObject.password;
  return userObject;
}

usuarioSchema.plugin(uniqueValidator, {
  message: '{PATH} debe de ser unico'
});

module.exports = mongoose.model('Usuario', usuarioSchema);