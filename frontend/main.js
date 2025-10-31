// --------------------------------------------
// Referencias a elementos del DOM y API
// --------------------------------------------
const contactForm = document.getElementById('contact-form'); // Formulario de contacto (parte superior)
const contactList = document.getElementById('contact-list'); // Contenedor donde se muestran los contactos
const apiURL = 'http://localhost:3000/api/contacts';         // URL del servidor/backend


// --------------------------------------------
// Función para cargar y renderizar contactos
// --------------------------------------------
async function loadContacts() {
  try {
    // Pedir los contactos a la API
    const response = await axios.get(apiURL);
    const contacts = response.data;

    // Limpiar lista antes de volver a llenar
    contactList.innerHTML = '';

    // Crear una tarjeta por cada contacto
    contacts.forEach((contact) => {
      const card = document.createElement('div');
      card.className = 'contact-card';
      card.innerHTML = `
        <div>
          <strong>${contact.nombre}</strong><br />
          📞 ${contact.telefono}<br />
          📧 ${contact.email}
        </div>
        <div>
          <button class="edit-btn" data-id="${contact._id}">Editar</button>
          <button class="delete-btn" data-id="${contact._id}">Eliminar</button>
        </div>
      `;
      contactList.appendChild(card);
    });
  } catch (error) {
    console.error('Error cargando contactos:', error);
  }
}


// --------------------------------------------
// Manejar clics en los botones de la lista
// --------------------------------------------
contactList.addEventListener('click', async (e) => {
  const id = e.target.dataset.id;

  // --- Eliminar contacto ---
  if (e.target.classList.contains('delete-btn')) {
    await axios.delete(`${apiURL}/${id}`);
    loadContacts();
  }

  // --- Editar contacto ---
  else if (e.target.classList.contains('edit-btn')) {
    try {
      // Obtener datos del contacto seleccionado
      const res = await axios.get(`${apiURL}/${id}`);
      const contact = res.data;

      // Rellenar el formulario con los datos del contacto
      document.getElementById('nombre').value = contact.nombre;
      document.getElementById('telefono').value = contact.telefono;
      document.getElementById('email').value = contact.email;

      // Cambiar el texto del botón principal a "Guardar Cambios"
      contactForm.dataset.editingId = id;
      contactForm.querySelector('button').textContent = 'Guardar Cambios';

      // 🔽 NUEVO: subir la vista hasta arriba del todo (donde está el formulario)
      window.scrollTo({
        top: 0,
        behavior: 'smooth' // desplazamiento suave
      });

      // 🔽 Opcional: enfocar el campo "nombre" para editar enseguida
      setTimeout(() => document.getElementById('nombre').focus(), 600);

    } catch (err) {
      console.error('Error obteniendo contacto para editar', err);
    }
  }
});


// --------------------------------------------
// Manejar el envío del formulario (crear/editar)
// --------------------------------------------
contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Obtener valores del formulario
  const nombre = document.getElementById('nombre').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const email = document.getElementById('email').value.trim();
  const editingId = contactForm.dataset.editingId;

  // Validar campos vacíos
  if (!nombre || !telefono || !email) {
    alert('Todos los campos son obligatorios');
    return;
  }

  try {
    // Si se está editando, actualizar contacto existente
    if (editingId) {
      await axios.put(`${apiURL}/${editingId}`, { nombre, telefono, email });
      delete contactForm.dataset.editingId;
      contactForm.querySelector('button').textContent = 'Agregar Contacto';
    } 
    // Si no, agregar nuevo contacto
    else {
      await axios.post(apiURL, { nombre, telefono, email });
    }

    // Limpiar formulario y recargar la lista
    contactForm.reset();
    loadContacts();

  } catch (error) {
    if (error.response && error.response.data.errors) {
      alert(error.response.data.errors.join('\n'));
    } else {
      console.error('Error en la operación', error);
      alert('Error en la operación');
    }
  }
});


// --------------------------------------------
// Botón flotante para subir arriba (scroll)
// --------------------------------------------
const btnSubir = document.getElementById("btn-subir");

// Mostrar u ocultar el botón dependiendo del scroll
window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    btnSubir.classList.add("show");
  } else {
    btnSubir.classList.remove("show");
  }
});

// Acción del botón: subir suavemente al inicio de la página
btnSubir.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});


// --------------------------------------------
// Cargar los contactos al iniciar la página
// --------------------------------------------
loadContacts();
