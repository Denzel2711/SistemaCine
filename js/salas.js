document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formSala");
    const tabla = document.getElementById("tablaSalas").querySelector("tbody");
    const btnAgregar = document.getElementById("btnAgregarSala");
    const btnEditar = document.getElementById("btnEditarSala");
    const btnEliminar = document.getElementById("btnEliminarSala");
    const btnLimpiar = document.getElementById("btnLimpiarSala");
    const filtro = document.getElementById("filtroSalas");

    const baseUrl = "https://sistemacineapi.azurewebsites.net/controller/api_salas.php";
    let salas = [];

    // Listar salas
    const listarSalas = async () => {
        const response = await fetch(`${baseUrl}?op=Listar`);
        salas = await response.json();
        mostrarSalas(salas);
    };

    // Mostrar salas en la tabla
    const mostrarSalas = (salasFiltradas) => {
        tabla.innerHTML = salasFiltradas
            .map(
                (s) => `
            <tr data-id="${s.Id}">
                <td>${s.Nombre}</td>
                <td>${s.Capacidad}</td>
                <td>${s.Tipo}</td>
            </tr>
        `
            )
            .join("");
        agregarEventosTabla();
    };

    // Filtrar salas dinámicamente
    filtro.addEventListener("input", () => {
        const texto = filtro.value.toLowerCase();
        const salasFiltradas = salas.filter(
            (s) =>
                s.Nombre.toLowerCase().includes(texto) ||
                s.Capacidad.toString().includes(texto) ||
                s.Tipo.toLowerCase().includes(texto)
        );
        mostrarSalas(salasFiltradas);
    });

    // Manejar clic en la tabla para seleccionar un registro
    const agregarEventosTabla = () => {
        const filas = tabla.querySelectorAll("tr");
        filas.forEach((fila) => {
            fila.addEventListener("click", () => {
                filas.forEach((f) => f.classList.remove("selected"));
                fila.classList.add("selected");

                const id = fila.getAttribute("data-id");
                const [nombre, capacidad, tipo] = fila.querySelectorAll("td:nth-child(n+1)");

                form.SalaId.value = id;
                form.SalaNombre.value = nombre.textContent;
                form.SalaCapacidad.value = capacidad.textContent;
                form.SalaTipo.value = tipo.textContent;

                // Habilitar botones de editar y eliminar, deshabilitar agregar
                btnEditar.disabled = false;
                btnEliminar.disabled = false;
                btnAgregar.disabled = true;
            });
        });
    };

    // Agregar sala
    btnAgregar.addEventListener("click", async () => {
        const data = {
            Nombre: form.SalaNombre.value,
            Capacidad: form.SalaCapacidad.value,
            Tipo: form.SalaTipo.value,
        };
        await fetch(`${baseUrl}?op=Insertar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        form.reset();
        listarSalas();
        cargarSelects();
    });

    // Editar sala
    btnEditar.addEventListener("click", async () => {
        const data = {
            Id: form.SalaId.value,
            Nombre: form.SalaNombre.value,
            Capacidad: form.SalaCapacidad.value,
            Tipo: form.SalaTipo.value,
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
        listarSalas();
        cargarSelects();
    });

    // Eliminar sala
    btnEliminar.addEventListener("click", async () => {
        const confirmar = confirm("¿Está seguro de que desea eliminar la sala seleccionada?");
        if (confirmar) {
            const data = {
                Id: form.SalaId.value,
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
            listarSalas();
            cargarSelects();
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
    listarSalas();
});
