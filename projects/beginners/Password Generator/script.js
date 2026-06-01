function gen() {
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&";
    let pass = "";
    for (let i = 0; i < 12; i++) {
        pass += chars[Math.floor(Math.random() * chars.length)];
    }
    document.getElementById("pass").value = pass;
}

function copy() {
    let pass = document.getElementById("pass");
    pass.select();
    navigator.clipboard.writeText(pass.value);
    alert("Copied!");
}

window.onload = gen;