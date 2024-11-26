document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formPelicula");
    const tabla = document
        .getElementById("tablaPeliculas")
        .querySelector("tbody");
    const btnAgregar = document.getElementById("btnAgregarPelicula");
    const btnEditar = document.getElementById("btnEditarPelicula");
    const btnEliminar = document.getElementById("btnEliminarPelicula");
    const btnLimpiar = document.getElementById("btnLimpiarPelicula");

    const baseUrl = "https://sistemacineapi.azurewebsites.net/controller/api_peliculas.php";

    // Función para listar películas
    const listarPeliculas = async () => {
        try {
            const response = await fetch(`${baseUrl}?op=Listar`);
            if (!response.ok) throw new Error("Error al listar las películas.");
            const peliculas = await response.json();
            tabla.innerHTML = peliculas
                .map(
                    (p) => `
                <tr data-id="${p.Id}">
                    <td>${p.Titulo}</td>
                    <td>${p.Genero}</td>
                    <td>${p.Duracion}</td>
                </tr>
            `
                )
                .join("");
            agregarEventosTabla();
        } catch (error) {
            console.error("Error al listar películas:", error);
            alert("No se pudieron cargar las películas. Revisa la consola para más detalles.");
        }
    };

    // Función para agregar eventos a las filas de la tabla
    const agregarEventosTabla = () => {
        const filas = tabla.querySelectorAll("tr");
        filas.forEach((fila) => {
            fila.addEventListener("click", () => {
                filas.forEach((f) => f.classList.remove("selected"));
                fila.classList.add("selected");

                const id = fila.getAttribute("data-id");
                const [titulo, genero, duracion] = fila.querySelectorAll("td");

                form.PeliculaId.value = id;
                form.PeliculaTitulo.value = titulo.textContent;
                form.PeliculaGenero.value = genero.textContent;
                form.PeliculaDuracion.value = duracion.textContent;

                // Habilitar botones de editar y eliminar, deshabilitar agregar
                btnEditar.disabled = false;
                btnEliminar.disabled = false;
                btnAgregar.disabled = true;
            });
        });
    };

    // Función para agregar una película
    btnAgregar.addEventListener("click", async () => {
        const data = {
            Titulo: form.PeliculaTitulo.value,
            Genero: form.PeliculaGenero.value,
            Duracion: form.PeliculaDuracion.value,
        };

        try {
            const response = await fetch(`${baseUrl}?op=Insertar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error("Error al agregar la película.");
            form.reset();
            listarPeliculas();
        } catch (error) {
            console.error("Error al agregar película:", error);
            alert("No se pudo agregar la película. Revisa la consola para más detalles.");
        }
    });

    // Función para editar una película
    btnEditar.addEventListener("click", async () => {
        const data = {
            Id: form.PeliculaId.value,
            Titulo: form.PeliculaTitulo.value,
            Genero: form.PeliculaGenero.value,
            Duracion: form.PeliculaDuracion.value,
        };

        try {
            const response = await fetch(`${baseUrl}?op=Actualizar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error("Error al editar la película.");
            form.reset();
            btnEditar.disabled = true;
            btnEliminar.disabled = true;
            btnAgregar.disabled = false;
            listarPeliculas();
        } catch (error) {
            console.error("Error al editar película:", error);
            alert("No se pudo editar la película. Revisa la consola para más detalles.");
        }
    });

    // Función para eliminar una película
    btnEliminar.addEventListener("click", async () => {
        const data = { Id: form.PeliculaId.value };

        try {
            const response = await fetch(`${baseUrl}?op=Eliminar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error("Error al eliminar la película.");
            form.reset();
            btnEditar.disabled = true;
            btnEliminar.disabled = true;
            btnAgregar.disabled = false;
            listarPeliculas();
        } catch (error) {
            console.error("Error al eliminar película:", error);
            alert("No se pudo eliminar la película. Revisa la consola para más detalles.");
        }
    });

    // Función para limpiar el formulario
    btnLimpiar.addEventListener("click", () => {
        form.reset();
        btnEditar.disabled = true;
        btnEliminar.disabled = true;
        btnAgregar.disabled = false;
        tabla.querySelectorAll("tr").forEach((fila) => fila.classList.remove("selected"));
    });

    // Inicialización
    listarPeliculas();
});
