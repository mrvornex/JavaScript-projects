let qrCodeInstance = null;

function generate() {
    let text = document.getElementById("text").value.trim();
    if (!text) {
        alert("Please enter some text or URL!");
        return;
    }
    
    document.getElementById("qrcode").innerHTML = "";
    document.getElementById("downloadBtn").style.display = "none";
    
    qrCodeInstance = new QRCode(document.getElementById("qrcode"), {
        text: text,
        width: 220,
        height: 220,
        colorDark: "#2d3436",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
    
    setTimeout(() => {
        document.getElementById("downloadBtn").style.display = "block";
    }, 300);
}

function download() {
    let canvas = document.querySelector("#qrcode canvas");
    if (!canvas) return;
    
    let link = document.createElement("a");
    link.download = "qr-code.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
}

document.getElementById("text").addEventListener("keypress", (e) => {
    if (e.key === "Enter") generate();
});