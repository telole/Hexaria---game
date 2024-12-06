const canvas = document.getElementById("hexCanvas");
const ctx = canvas.getContext("2d");

// Ukuran dan pengaturan hexagon
const hexRadius = 30;
const hexHeight = Math.sqrt(3) * hexRadius;
const hexWidth = 2 * hexRadius;
const hexSpacing = 5; // Jarak antar hexagon

// Warna untuk pemain
const colors = ["#FF6347", "#00BFFF", "#777"];

// Fungsi menggambar hexagon
function drawHexagon(x, y, color, text) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const xPos = x + hexRadius * Math.cos(angle);
        const yPos = y + hexRadius * Math.sin(angle);
        if (i === 0) ctx.moveTo(xPos, yPos);
        else ctx.lineTo(xPos, yPos);
    }
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = "#222";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Tulis angka di tengah hexagon
    if (text !== undefined) {
        ctx.fillStyle = "#FFF";
        ctx.font = "14px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, x, y);
    }
}

// Fungsi menggambar grid hexagon
function drawHexGrid(rows, cols) {
    const offsetX = hexWidth + hexSpacing;
    const offsetY = hexHeight * 0.75;
    const startX = 50;
    const startY = 50;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const x = startX + col * offsetX + (row % 2 === 0 ? 0 : offsetX / 2);
            const y = startY + row * offsetY;

            // Warna dan angka acak
            const randomColor = Math.random() > 0.2 ? colors[Math.floor(Math.random() * 2)] : colors[2];
            const randomNumber = Math.random() > 0.5 ? Math.floor(Math.random() * 21) + 1 : undefined;

            drawHexagon(x, y, randomColor, randomNumber);
        }
    }
}

// Gambar grid dengan 8 baris dan 6 kolom
drawHexGrid(8, 6);
