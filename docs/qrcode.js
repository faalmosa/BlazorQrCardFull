window.generateQrWithLogo = function (base64Text, iconBase64) {
    const utf8Text = atob(base64Text);

    const qr = qrcode(0, 'H');
    qr.addData(utf8Text);
    qr.make();

    const size = 300;
    const cellSize = size / qr.getModuleCount();
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, size, size); 

    for (let r = 0; r < qr.getModuleCount(); r++) {
        for (let c = 0; c < qr.getModuleCount(); c++) {
            if (qr.isDark(r, c)) {
                ctx.fillStyle = "#000000";
                ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
            }
        }
    }

    const finalize = () => {
        const img = new Image();
        img.src = canvas.toDataURL("image/png");
        const container = document.getElementById("qrContainer");
        container.innerHTML = "";
        container.appendChild(img);
    };

    if (iconBase64) {
        const icon = new Image();
        icon.src = `data:image/png;base64,${iconBase64}`;
        icon.onload = () => {
            const iconSize = 60;
            ctx.drawImage(icon, (size - iconSize) / 2, (size - iconSize) / 2, iconSize, iconSize);
            finalize();
        };
    } else {
        finalize();
    }
};

window.downloadQr = function () {
    const img = document.querySelector("#qrContainer img");
    if (!img) return;
    const link = document.createElement("a");
    link.href = img.src;
    link.download = "qr-code.png";
    link.click();
};

window.printQr = function () {
    const img = document.querySelector("#qrContainer img");
    if (!img) return;
    const w = window.open("", "_blank");
    w.document.write(`<html><body style="text-align:center;"><img src="${img.src}" style="width:300px;" /></body></html>`);
    w.document.close();
    w.print();
};
