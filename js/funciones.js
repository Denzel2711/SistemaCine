document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formFuncion");
    const tabla = document.getElementById("tablaFunciones").querySelector("tbody");
    const btnAgregar = document.getElementById("btnAgregarFuncion");
    const btnEditar = document.getElementById("btnEditarFuncion");
    const btnEliminar = document.getElementById("btnEliminarFuncion");
    const btnLimpiar = document.getElementById("btnLimpiarFuncion");

    const apiUrl = "http://localhost/SistemaCine/controller/api_funciones.php";

    // Cargar películas y salas en los selects
    const cargarSelects = async () => {
        const peliculasResponse = await fetch("http://localhost/SistemaCine/controller/api_peliculas.php?op=Listar");
        const peliculas = await peliculasResponse.json();
        const peliculaSelect = document.getElementById("FuncionPelicula");
        peliculaSelect.innerHTML = peliculas
            .map((p) => `<option value="${p.Id}">${p.Titulo}</option>`)
            .join("");

        const salasResponse = await fetch("http://localhost/SistemaCine/controller/api_salas.php?op=Listar");
        const salas = await salasResponse.json();
        const salaSelect = document.getElementById("FuncionSala");
        salaSelect.innerHTML = salas
            .map((s) => `<option value="${s.Id}">${s.Nombre}</option>`)
            .join("");
    };

    // Listar funciones
    const listarFunciones = async () => {
        const response = await fetch(`${apiUrl}?op=Listar`);
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

                    const peliculaOption = Array.from(peliculaSelect.options).find(
                        (option) => option.textContent === pelicula.textContent
                    );
                    if (peliculaOption) {
                        peliculaSelect.value = peliculaOption.value;
                    }

                    const salaOption = Array.from(salaSelect.options).find(
                        (option) => option.textContent === sala.textContent
                    );
                    if (salaOption) {
                        salaSelect.value = salaOption.value;
                    }
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
        await fetch(`${apiUrl}?op=Insertar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        form.reset();
        listarFunciones();
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
        await fetch(`${apiUrl}?op=Actualizar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        form.reset();
        btnEditar.disabled = true;
        btnEliminar.disabled = true;
        btnAgregar.disabled = false;
        listarFunciones();
    });

    // Eliminar función
    btnEliminar.addEventListener("click", async () => {
        const data = { Id: form.FuncionId.value };
        await fetch(`${apiUrl}?op=Eliminar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        form.reset();
        btnEditar.disabled = true;
        btnEliminar.disabled = true;
        btnAgregar.disabled = false;
        listarFunciones();
    });

    // Limpiar formulario
    btnLimpiar.addEventListener("click", () => {
        form.reset();
        btnEditar.disabled = true;
        btnEliminar.disabled = true;
        btnAgregar.disabled = false;
        tabla.querySelectorAll("tr").forEach((fila) => fila.classList.remove("selected"));
    });

    cargarSelects();
    listarFunciones();
});
