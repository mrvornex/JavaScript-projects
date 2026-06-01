function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    const toggleBtn = document.getElementById("themeToggle");
    toggleBtn.textContent = document.body.classList.contains("dark-mode")
        ? "☀️ Light Mode"
        : "🌙 Dark Mode";

    localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
}

window.onload = () => {
    if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("dark-mode");
        document.getElementById("themeToggle").textContent = "☀️ Light Mode";
    }
};