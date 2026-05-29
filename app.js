// --- NAVEGACIÓN DE PESTAÑAS ---
function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
}

// --- LÓGICA DE DIBUJO ---
function setupCanvas(canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    let isDrawing = false;

    // Configuración del pincel
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000000';

    const startDrawing = (e) => {
        isDrawing = true;
        draw(e);
    };

    const stopDrawing = () => {
        isDrawing = false;
        ctx.beginPath();
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches?.[0].clientX) - rect.left;
        const y = (e.clientY || e.touches?.[0].clientY) - rect.top;

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Soporte táctil
    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', stopDrawing);
}

setupCanvas('freeCanvas');
setupCanvas('photoCanvas');

function clearCanvas(canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// --- CARGA Y PROCESAMIENTO DE IMAGEN (El filtro "Coloreable") ---
let uploadedImage = new Image();
const imageLoader = document.getElementById('imageLoader');

imageLoader.addEventListener('change', function(e) {
    const reader = new FileReader();
    reader.onload = function(event) {
        uploadedImage.src = event.target.result;
        uploadedImage.onload = () => {
            const canvas = document.getElementById('photoCanvas');
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // Dibujar la imagen ajustando el tamaño
            ctx.drawImage(uploadedImage, 0, 0, canvas.width, canvas.height);
        }
    }
    reader.readAsDataURL(e.target.files[0]);
});

// Convierte la foto en un "dibujo lineal" detectando alto contraste
function processImage() {
    const canvas = document.getElementById('photoCanvas');
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Filtro estático en cliente: Escala de grises y umbral alto (Threshold)
    for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        // Si es oscuro, hacerlo negro (borde). Si es claro, hacerlo blanco (fondo)
        const threshold = avg < 100 ? 0 : 255;
        data[i] = threshold;     // Red
        data[i + 1] = threshold; // Green
        data[i + 2] = threshold; // Blue
    }
    ctx.putImageData(imageData, 0, 0);
}

// --- ANÁLISIS DE PIVOTEO (DASHBOARD) ---
// Simulamos datos. En la vida real, medirías eventos de click con Google Analytics o Mixpanel
document.addEventListener("DOMContentLoaded", () => {
    const ctxChart = document.getElementById('pivotChart').getContext('2d');
    new Chart(ctxChart, {
        type: 'bar',
        data: {
            labels: ['Interacción: Dibujo Libre', 'Interacción: Foto a Colorear'],
            datasets: [{
                label: 'Minutos de uso promedio por usuario',
                data: [4, 15], // ¡Los datos indican que debes pivotear a la Foto a Colorear!
                backgroundColor: ['#9ca3af', '#2563eb']
            }]
        },
        options: { responsive: true }
    });
});
