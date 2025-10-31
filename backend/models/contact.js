const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
nombre: {
    type: String,
    required: true,
    trim: true,
    validate: {
    validator: v => /^[a-zA-Z\s]+$/.test(v),
    message: props => `${props.value} no es un nombre válido. Solo letras y espacios permitidos.`
    }
},
telefono: {
    type: String,
    required: true,
    validate: {
    validator: v => /^\d{7,15}$/.test(v),
    message: props => `${props.value} no es un número de teléfono válido. Solo números, entre 7 y 15 dígitos.`
    }
},
email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    validate: {
    validator: v => /^\S+@\S+\.\S+$/.test(v),
    message: props => `${props.value} no es un correo electrónico válido.`
    }
}
});

module.exports = mongoose.model('Contact', contactSchema);
