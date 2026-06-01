function showToast(type) {
    const messages = {
        success: "✅ Success! Operation completed.",
        error: "❌ Error! Something went wrong.",
        warning: "⚠️ Warning! Please check this.",
        info: "ℹ️ Info: Here's some information."
    };

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = `<strong>${messages[type]}</strong>`;

    document.getElementById("toastContainer").appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 10);
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}