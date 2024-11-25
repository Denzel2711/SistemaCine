document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll("#navTabs a");
    const secciones = document.querySelectorAll(".seccion");

    tabs.forEach(tab => {
        tab.addEventListener("click", e => {
            e.preventDefault();

            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            secciones.forEach(sec => sec.classList.add("d-none"));
            document.querySelector(tab.getAttribute("href")).classList.remove("d-none");
        });
    });
});