const express = require('express');
const { body, validationResult } = require('express-validator');
const Contact = require('../models/contact');

const router = express.Router();

router.post('/',
[
    body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio')
    .matches(/^[a-zA-Z\s]+$/).withMessage('El nombre solo puede contener letras y espacios'),
    body('telefono')
    .trim()
    .notEmpty().withMessage('El teléfono es obligatorio')
    .matches(/^\d+$/).withMessage('El teléfono solo puede contener números')
    .isLength({ min: 7, max: 15 }).withMessage('El teléfono debe tener entre 7 y 15 dígitos'),
    body('email')
    .trim()
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('Debe ingresar un correo válido'),
],
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array().map(e => e.msg) });
    }
    try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).json(contact);
    } catch (err) {
    res.status(500).json({ error: 'Error al crear contacto' });
    }
}
);

router.put('/:id',
[
    body('nombre')
    .optional()
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio')
    .matches(/^[a-zA-Z\s]+$/).withMessage('El nombre solo puede contener letras y espacios'),
    body('telefono')
    .optional()
    .trim()
    .notEmpty().withMessage('El teléfono es obligatorio')
    .matches(/^\d+$/).withMessage('El teléfono solo puede contener números')
    .isLength({ min: 7, max: 15 }).withMessage('El teléfono debe tener entre 7 y 15 dígitos'),
    body('email')
    .optional()
    .trim()
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('Debe ingresar un correo válido'),
],
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array().map(e => e.msg) });
    }
    try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!contact) return res.status(404).json({ error: 'Contacto no encontrado' });
    res.json(contact);
    } catch (err) {
    res.status(500).json({ error: 'Error al actualizar contacto' });
    }
}
);

router.get('/:id', async (req, res) => {
try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ error: 'Contacto no encontrado' });
    res.json(contact);
} catch (err) {
    res.status(500).json({ error: 'Error al obtener contacto' });
}
});

router.get('/', async (req, res) => {
try {
    const contacts = await Contact.find();
    res.json(contacts);
} catch (err) {
    res.status(500).json({ error: 'Error al leer contactos' });
}
});

router.delete('/:id', async (req, res) => {
try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ error: 'Contacto no encontrado' });
    res.json({ message: 'Contacto eliminado' });
} catch (err) {
    res.status(500).json({ error: 'Error al borrar contacto' });
}
});

module.exports = router;
