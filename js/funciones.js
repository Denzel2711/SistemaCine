document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formFuncion");
    const tabla = document.getElementById("tablaFunciones").querySelector("tbody");
    const btnAgregar = document.getElementById("btnAgregarFuncion");
    const btnEditar = document.getElementById("btnEditarFuncion");
    const btnEliminar = document.getElementById("btnEliminarFuncion");
    const btnLimpiar = document.getElementById("btnLimpiarFuncion");

    const baseUrl = "https://SistemaCineAPI.azurewebsites.net/controller";

    // Cargar películas y salas en los selects
    const cargarSelects = async () => {
        try {
            const peliculasResponse = await fetch(`${baseUrl}/api_peliculas.php?op=Listar`);
            const peliculas = await peliculasResponse.json();
            const peliculaSelect = document.getElementById("FuncionPelicula");
            peliculaSelect.innerHTML = peliculas
                .map((p) => `<option value="${p.Id}">${p.Titulo}</option>`)
                .join("");

            const salasResponse = await fetch(`${baseUrl}/api_salas.php?op=Listar`);
            const salas = await salasResponse.json();
            const salaSelect = document.getElementById("FuncionSala");
            salaSelect.innerHTML = salas
                .map((s) => `<option value="${s.Id}">${s.Nombre}</option>`)
                .join("");
        } catch (error) {
            console.error("Error al cargar los selects:", error);
        }
    };

    // Listar funciones
    const listarFunciones = async () => {
        try {
            const response = await fetch(`${baseUrl}/api_funciones.php?op=Listar`);
            const funciones = await response.json();
            tabla.innerHTML = funciones
                .map(
                    (f) => `
                <tr data-id="${f.Id}">
                    <td>${f.Pelicula}</td>
                    <td>${f.Sala}</td>
                    <td>${f.Fecha}</td>
                    <td>${f.Hora}</td>
                    <td>${f.Precio}</td>
                </tr>
            `
                )
                .join("");
            agregarEventosTabla();
        } catch (error) {
            console.error("Error al listar funciones:", error);
        }
    };

    // Manejar clic en la tabla para seleccionar un registro
    const agregarEventosTabla = () => {
        const filas = tabla.querySelectorAll("tr");
        filas.forEach((fila) => {
            fila.addEventListener("click", () => {
                filas.forEach((f) => f.classList.remove("selected"));
                fila.classList.add("selected");

                const id = fila.getAttribute("data-id");
                const [pelicula, sala, fecha, hora, precio] = fila.querySelectorAll("td:nth-child(n+1)");

                form.FuncionId.value = id;
                form.FuncionPelicula.value = pelicula.textContent; 
                form.FuncionSala.value = sala.textContent; 
                form.FuncionFecha.value = fecha.textContent;
                form.FuncionHora.value = hora.textContent;
                form.FuncionPrecio.value = precio.textContent;

                cargarSelects().then(() => {
                    const peliculaSelect = form.FuncionPelicula;
                    const salaSelect = form.FuncionSala;

                    peliculaSelect.value = Array.from(peliculaSelect.options).find(
                        (option) => option.textContent === pelicula.textContent
                    )?.value || "";

                    salaSelect.value = Array.from(salaSelect.options).find(
                        (option) => option.textContent === sala.textContent
                    )?.value || "";
                });

                // Habilitar botones de editar y eliminar, deshabilitar agregar
                btnEditar.disabled = false;
                btnEliminar.disabled = false;
                btnAgregar.disabled = true;
            });
        });
    };

    // Agregar función
    btnAgregar.addEventListener("click", async () => {
        const data = {
            PeliculaId: form.FuncionPelicula.value,
            SalaId: form.FuncionSala.value,
            Fecha: form.FuncionFecha.value,
            Hora: form.FuncionHora.value,
            Precio: form.FuncionPrecio.value,
        };
        try {
            await fetch(`${baseUrl}/api_funciones.php?op=Insertar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            form.reset();
            listarFunciones();
        } catch (error) {
            console.error("Error al agregar función:", error);
        }
    });

    // Editar función
    btnEditar.addEventListener("click", async () => {
        const data = {
            Id: form.FuncionId.value,
            PeliculaId: form.FuncionPelicula.value,
            SalaId: form.FuncionSala.value,
            Fecha: form.FuncionFecha.value,
            Hora: form.FuncionHora.value,
            Precio: form.FuncionPrecio.value,
        };
        try {
            await fetch(`${baseUrl}/api_funciones.php?op=Actualizar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            form.reset();
            btnEditar.disabled = true;
            btnEliminar.disabled = true;
            btnAgregar.disabled = false;
            listarFunciones();
        } catch (error) {
            console.error("Error al editar función:", error);
        }
    });

    // Eliminar función
    btnEliminar.addEventListener("click", async () => {
        const data = { Id: form.FuncionId.value };
        try {
            await fetch(`${baseUrl}/api_funciones.php?op=Eliminar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            form.reset();
            btnEditar.disabled = true;
            btnEliminar.disabled = true;
            btnAgregar.disabled = false;
            listarFunciones();
        } catch (error) {
            console.error("Error al eliminar función:", error);
        }
    });

    // Limpiar formulario
    btnLimpiar.addEventListener("click", () => {
        form.reset();
        btnEditar.disabled = true;
        btnEliminar.disabled = true;
        btnAgregar.disabled = false;
        tabla.querySelectorAll("tr").forEach((fila) => fila.classList.remove("selected"));
    });

    // Inicialización
    cargarSelects();
    listarFunciones();
});
