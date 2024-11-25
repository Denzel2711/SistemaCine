document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formPelicula");
    const tabla = document
        .getElementById("tablaPeliculas")
        .querySelector("tbody");
    const btnAgregar = document.getElementById("btnAgregarPelicula");
    const btnEditar = document.getElementById("btnEditarPelicula");
    const btnEliminar = document.getElementById("btnEliminarPelicula");
    const btnLimpiar = document.getElementById("btnLimpiarPelicula");

    const apiUrl = "http://localhost/SistemaCine/controller/api_peliculas.php";

    // Listar películas
    const listarPeliculas = async () => {
        const response = await fetch(`${apiUrl}?op=Listar`);
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
    };
    
    // Manejar clic en la tabla para seleccionar un registro
    const agregarEventosTabla = () => {
        const filas = tabla.querySelectorAll("tr");
        filas.forEach((fila) => {
            fila.addEventListener("click", () => {
                filas.forEach((f) => f.classList.remove("selected"));
                fila.classList.add("selected");

                const id = fila.getAttribute("data-id");
                const [titulo, genero, duracion] =
                    fila.querySelectorAll("td:nth-child(n+1)");

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

    // Agregar película
    btnAgregar.addEventListener("click", async () => {
        const data = {
            Titulo: form.PeliculaTitulo.value,
            Genero: form.PeliculaGenero.value,
            Duracion: form.PeliculaDuracion.value,
        };
        await fetch(`${apiUrl}?op=Insertar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        form.reset();
        listarPeliculas();
    });

    // Editar película
    btnEditar.addEventListener("click", async () => {
        const data = {
            Id: form.PeliculaId.value,
            Titulo: form.PeliculaTitulo.value,
            Genero: form.PeliculaGenero.value,
            Duracion: form.PeliculaDuracion.value,
        };
        await fetch(`${apiUrl}?op=Actualizar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        form.reset();
        btnEditar.disabled = true;
        btnEliminar.disabled = true;
        btnAgregar.disabled = false;
        listarPeliculas();
    });

    // Eliminar película
    btnEliminar.addEventListener("click", async () => {
        const data = { Id: form.PeliculaId.value };
        await fetch(`${apiUrl}?op=Eliminar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        form.reset();
        btnEditar.disabled = true;
        btnEliminar.disabled = true;
        btnAgregar.disabled = false;
        listarPeliculas();
    });

    // Limpiar formulario
    btnLimpiar.addEventListener("click", () => {
        form.reset();
        btnEditar.disabled = true;
        btnEliminar.disabled = true;
        btnAgregar.disabled = false;
        tabla
            .querySelectorAll("tr")
            .forEach((fila) => fila.classList.remove("selected"));
    });

    listarPeliculas();
});
