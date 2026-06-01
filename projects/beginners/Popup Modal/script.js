function openPopup() {
    document.getElementById("popup").style.display = "flex";
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
}

document.getElementById("popup").addEventListener("click", function(e) {
    if (e.target.id === "popup") {
        closePopup();
    }
});