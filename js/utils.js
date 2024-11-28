const cargarSelects = async () => {
    try {
        const baseUrl = "https://SistemaCineAPI.azurewebsites.net/controller";

        const peliculasResponse = await fetch(`${baseUrl}/api_peliculas.php?op=Listar`);
        const peliculas = await peliculasResponse.json();
        const peliculaSelect = document.getElementById("FuncionPelicula");
        peliculaSelect.innerHTML = `<option value="">Seleccionar...</option>` + 
            peliculas.map((p) => `<option value="${p.Id}">${p.Titulo}</option>`).join("");

        const salasResponse = await fetch(`${baseUrl}/api_salas.php?op=Listar`);
        const salas = await salasResponse.json();
        const salaSelect = document.getElementById("FuncionSala");
        salaSelect.innerHTML = `<option value="">Seleccionar...</option>` + 
            salas.map((s) => `<option value="${s.Id}">${s.Nombre}</option>`).join("");
    } catch (error) {
        console.error("Error al cargar los selects:", error);
    }
};
