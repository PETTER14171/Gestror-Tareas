# Gestor de Tareas con Recordatorios y Modo Oscuro

¡Bienvenido al Gestor de Tareas! Esta aplicación web te permite organizar tus tareas con prioridades, categorías, recordatorios personalizados y progresos visibles. Además, incluye un modo oscuro para una experiencia más cómoda.

---

## 🌟 **Cómo usar la aplicación**

### **1. Agregar una tarea**
1. Completa los campos:
   - **Título**: Nombre de la tarea (obligatorio).
   - **Descripción**: Detalles adicionales (opcional).
   - **Prioridad**: Selecciona entre Alta, Media o Baja.
   - **Categoría**: Trabajo, Personal u Otros.
   - **Hora del recordatorio**: Define una hora para recibir una notificación (opcional).
   - **Mensaje del recordatorio**: Personaliza el texto de la notificación (opcional).
2. Haz clic en **"Agregar Tarea"**. Aparecerá en la columna correspondiente a su prioridad.

### **2. Editar una tarea**
- Haz clic en el botón **Editar** en la tarjeta de la tarea.
- Cambia los datos que necesites, incluidos el recordatorio y su mensaje.
- Guarda los cambios haciendo clic en **"Guardar Cambios"**.

### **3. Completar una tarea**
- Marca la tarea como completada desde su estado o al alcanzar el 100% del progreso. ¡Recibirás una notificación de felicitación!

### **4. Eliminar una tarea**
- Presiona el botón **Eliminar** en la tarjeta de la tarea.
- Confirma la acción en el cuadro de diálogo para borrarla definitivamente.

### **5. Cambiar el tema**
- Activa o desactiva el modo oscuro usando el interruptor en la esquina superior derecha. Este cambio se guardará automáticamente.

---

## 🛠️ **Desarrollo del código**

El proyecto utiliza tecnologías web modernas: **HTML**, **CSS** y **JavaScript**. Se enfoca en la persistencia de datos mediante `localStorage` y la interacción del usuario con notificaciones.

### **Funciones principales del código**

#### 1. **Persistencia de datos con `localStorage`**
```javascript
function saveTasksToLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

            <footer>
            <p>&copy; 2024 Gestor de Tareas. Todos los derechos reservados.</p>
            </footer>

