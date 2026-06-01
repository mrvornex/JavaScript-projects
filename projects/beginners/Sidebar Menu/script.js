function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("collapsed");
}

function toggleTheme() {
    document.body.classList.toggle("dark-theme");
    const themeBtn = document.querySelector(".theme-btn");
    themeBtn.textContent = document.body.classList.contains("dark-theme") 
        ? "☀️" 
        : "🌙";
    
    localStorage.setItem("theme", document.body.classList.contains("dark-theme"));
}

window.onload = () => {
    if (localStorage.getItem("theme") === "true") {
        document.body.classList.add("dark-theme");
        document.querySelector(".theme-btn").textContent = "☀️";
    }
};