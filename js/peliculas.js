document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formPelicula");
    const tabla = document.getElementById("tablaPeliculas").querySelector("tbody");
    const btnAgregar = document.getElementById("btnAgregarPelicula");
    const btnEditar = document.getElementById("btnEditarPelicula");
    const btnEliminar = document.getElementById("btnEliminarPelicula");
    const btnLimpiar = document.getElementById("btnLimpiarPelicula");
    const filtro = document.getElementById("filtroPeliculas");

    const baseUrl = "https://sistemacineapi.azurewebsites.net/controller/api_peliculas.php";
    let peliculas = [];

    // Listar películas
    const listarPeliculas = async () => {
        const response = await fetch(`${baseUrl}?op=Listar`);
        peliculas = await response.json();
        mostrarPeliculas(peliculas);
    };

    // Mostrar películas en la tabla
    const mostrarPeliculas = (peliculasFiltradas) => {
        tabla.innerHTML = peliculasFiltradas
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

    // Filtrar películas dinámicamente
    filtro.addEventListener("input", () => {
        const texto = filtro.value.toLowerCase();
        const peliculasFiltradas = peliculas.filter(
            (p) =>
                p.Titulo.toLowerCase().includes(texto) ||
                p.Genero.toLowerCase().includes(texto) ||
                p.Duracion.toString().includes(texto)
        );
        mostrarPeliculas(peliculasFiltradas);
    });

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

    // Agregar película
    btnAgregar.addEventListener("click", async () => {
        const data = {
            Titulo: form.PeliculaTitulo.value,
            Genero: form.PeliculaGenero.value,
            Duracion: form.PeliculaDuracion.value,
        };
        await fetch(`${baseUrl}?op=Insertar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        form.reset();
        listarPeliculas();
        cargarSelects();
    });

    // Editar película
    btnEditar.addEventListener("click", async () => {
        const data = {
            Id: form.PeliculaId.value,
            Titulo: form.PeliculaTitulo.value,
            Genero: form.PeliculaGenero.value,
            Duracion: form.PeliculaDuracion.value,
        };
        await fetch(`${baseUrl}?op=Actualizar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        form.reset();
        btnEditar.disabled = true;
        btnEliminar.disabled = true;
        btnAgregar.disabled = false;
        listarPeliculas();
        cargarSelects();
    });

    // Eliminar película
    btnEliminar.addEventListener("click", async () => {
        const confirmar = confirm("¿Estás seguro de que deseas eliminar esta película?");
        if (confirmar) {
            const data = {
                Id: form.PeliculaId.value,
            };
            await fetch(`${baseUrl}?op=Eliminar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            form.reset();
            btnEditar.disabled = true;
            btnEliminar.disabled = true;
            btnAgregar.disabled = false;
            listarPeliculas();
            cargarSelects();
        }
    });

    // Limpiar formulario
    btnLimpiar.addEventListener("click", () => {
        form.reset();
        btnEditar.disabled = true;
        btnEliminar.disabled = true;
        btnAgregar.disabled = false;
        tabla.querySelectorAll("tr").forEach((f) => f.classList.remove("selected"));
    });

    // Inicialización
    listarPeliculas();
});
