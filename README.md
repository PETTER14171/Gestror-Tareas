<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestor de Tareas - Documentación</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            color: #333;
        }
        header {
            background: #333;
            color: #fff;
            padding: 10px 0;
            text-align: center;
        }
        header h1 {
            margin: 0;
            font-size: 2.5rem;
        }
        main {
            max-width: 800px;
            margin: 20px auto;
            padding: 20px;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        h2 {
            color: #444;
            margin-bottom: 10px;
        }
        p, ul, li {
            margin-bottom: 15px;
        }
        ul {
            padding-left: 20px;
        }
        li {
            list-style-type: disc;
        }
        .code {
            background: #f4f4f4;
            color: #c7254e;
            padding: 5px 10px;
            border-radius: 5px;
            font-family: monospace;
        }
        footer {
            text-align: center;
            padding: 10px;
            background: #333;
            color: #fff;
            margin-top: 20px;
        }
        a {
            color: #1e90ff;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <header>
        <h1>Gestor de Tareas Interactivo</h1>
    </header>
    <main>
        <h2>Características</h2>
        <ul>
            <li>Gestión de tareas: Crear, editar, completar y eliminar tareas.</li>
            <li>Recordatorios: Configura una hora y un mensaje para recibir notificaciones de tareas pendientes.</li>
            <li>Modo claro/oscuro: Cambia entre temas con un interruptor dinámico.</li>
            <li>Organización por prioridad: Las tareas se agrupan en columnas (Alta, Media, Baja).</li>
            <li>Progreso: Cada tarea muestra un porcentaje de avance.</li>
            <li>Responsivo: Optimizado para dispositivos móviles y escritorio.</li>
            <li>Persistencia de datos: Almacena las tareas en <span class="code">localStorage</span>.</li>
        </ul>

        <h2>Cómo Usar</h2>
        <ol>
            <li><strong>Agregar Tareas:</strong> Escribe un título, descripción, prioridad y categoría. Configura recordatorios opcionales.</li>
            <li><strong>Editar Tareas:</strong> Haz clic en "Editar" para modificar la tarea.</li>
            <li><strong>Completar Tareas:</strong> Marca una tarea como completada ajustando su progreso al 100%.</li>
            <li><strong>Eliminar Tareas:</strong> Haz clic en "Eliminar" para borrar una tarea.</li>
            <li><strong>Recordatorios:</strong> Configura notificaciones personalizadas para las tareas pendientes.</li>
        </ol>

        <h2>Proceso de Desarrollo</h2>
        <p>Este proyecto evolucionó a través de varias etapas:</p>
        <ol>
            <li>Diseño básico con HTML, CSS y funciones básicas en JavaScript.</li>
            <li>Organización de tareas en columnas por prioridad.</li>
            <li>Adición de <span class="code">localStorage</span> para persistir datos.</li>
            <li>Integración de recordatorios y notificaciones.</li>
            <li>Optimización responsiva y despliegue en GitHub Pages.</li>
        </ol>

        <h2>Control de Versiones</h2>
        <p>El proyecto fue versionado utilizando Git y alojado en GitHub. Se realizaron múltiples commits durante el desarrollo.</p>

        <h2>Despliegue</h2>
        <p>El proyecto está disponible en línea a través de <a href="https://github.com/USERNAME/REPO_NAME" target="_blank">GitHub Pages</a>.</p>
    </main>
    <footer>
        <p>&copy; 2024 Gestor de Tareas. Todos los derechos reservados.</p>
    </footer>
</body>
</html>
