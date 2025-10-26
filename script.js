// --- ELEMENTOS DOM ---
const tablero = document.getElementById("tablero");
const lanzarBtn = document.getElementById("lanzar-dado");
const resultado = document.getElementById("resultado-dado");
const cartaDiv = document.getElementById("carta");
const siguienteBtn = document.getElementById("siguiente-turno");
const posSpan = document.getElementById("posicion");
const conexionesSpan = document.getElementById("conexiones");
const tituloJugador = document.getElementById("titulo-jugador");
const formJugadores = document.getElementById("form-jugadores");
const numJugadoresSelect = document.getElementById("num-jugadores");

// Mostrar / ocultar secciones
const seccionTablero = document.getElementById("tablero-section");
const seccionInfo = document.getElementById("info-jugador");
const seccionCarta = document.getElementById("carta-section");

// Instrucciones
const toggleBtn = document.getElementById("toggle-instrucciones");
const textoInstrucciones = document.getElementById("texto-instrucciones");

// --- VARIABLES DE JUEGO ---
const colores = ["verde", "azul", "amarillo", "rojo", "negro"];
const cartas = {
    verde: [
        { texto: "“Mi jefe es un flojo.” ¿Observación o juicio?", respuesta: "Observación: “Mi jefe no entregó el informe esta semana.”" },
    ],
    azul: [
        { texto: "“Nadie me respeta.” ¿Qué sentimiento hay detrás?", respuesta: "Frustración y tristeza por necesidad de reconocimiento." },
    ],
    amarillo: [
        { texto: "“Siempre llegas tarde.” ¿Qué necesidad no está satisfecha?", respuesta: "Necesidad de puntualidad y respeto por el tiempo compartido." },
    ],
    rojo: [
        { texto: "“Deja de ser egoísta.” Reformúlala como petición clara.", respuesta: "“¿Podrías avisarme si vas a llegar tarde?”" },
    ],
    negro: [
        { texto: "“Si me amaras, lo sabrías.” ¿Qué tipo de bloqueo es?", respuesta: "Negación de responsabilidad. Reformular: “¿Podrías preguntarme qué necesito cuando estoy callado?”" },
    ],
};

let jugadores = [];
let jugadorActual = 0;

// --- GENERAR TABLERO ---
function generarTablero() {
    tablero.innerHTML = "";
    for (let i = 1; i <= 30; i++) {
        const color = colores[Math.floor(Math.random() * colores.length)];
        const casilla = document.createElement("div");
        casilla.classList.add("casilla", color);
        casilla.textContent = i;
        tablero.appendChild(casilla);
    }
}

// --- INICIAR JUEGO ---
formJugadores.addEventListener("submit", (e) => {
    e.preventDefault();
    const num = parseInt(numJugadoresSelect.value);
    if (!num) return;

    generarTablero();
    jugadores = Array.from({ length: num }, (_, i) => ({
        id: i + 1,
        posicion: 1,
        conexiones: 0,
        ficha: crearFicha(i + 1),
    }));

    actualizarInterfaz();
    document.getElementById("configuracion").classList.add("oculta");
    seccionTablero.classList.remove("oculta");
    seccionInfo.classList.remove("oculta");
    seccionCarta.classList.remove("oculta");
});

function crearFicha(num) {
    const ficha = document.createElement("div");
    ficha.classList.add("ficha");
    ficha.textContent = ["🧍", "🧑‍🦱", "🧕", "👨‍🦰", "👩‍🦱", "🧔"][num - 1] || "🧍";
    tablero.children[0].appendChild(ficha);
    return ficha;
}

function moverFicha(jugador, pasos) {
    jugador.posicion += pasos;
    if (jugador.posicion > 30) jugador.posicion = 30;
    const destino = tablero.children[jugador.posicion - 1];
    destino.appendChild(jugador.ficha);
    mostrarCarta(destino.classList[1], jugador);
}

function mostrarCarta(color, jugador) {
    const grupo = cartas[color];
    const carta = grupo[Math.floor(Math.random() * grupo.length)];

    cartaDiv.classList.remove("oculta");
    cartaDiv.innerHTML = `
        <p><strong>${color.toUpperCase()}</strong></p>
        <p>${carta.texto}</p>
        <p class="respuesta"><em>${carta.respuesta}</em></p>
    `;

    if (color !== "negro") jugador.conexiones++;

    if (jugador.conexiones >= 4) {
        cartaDiv.innerHTML = `<h3>🎉 ¡El Jugador ${jugador.id} ha ganado con 4 Conexiones de Vida! 🌱</h3>`;
        lanzarBtn.disabled = true;
    }

    siguienteBtn.classList.remove("oculta");
}

function actualizarInterfaz() {
    const j = jugadores[jugadorActual];
    tituloJugador.textContent = `Turno del Jugador ${j.id}`;
    posSpan.textContent = j.posicion;
    conexionesSpan.textContent = j.conexiones;
}

lanzarBtn.addEventListener("click", () => {
    const j = jugadores[jugadorActual];
    const dado = Math.ceil(Math.random() * 6);
    resultado.textContent = `Sacaste un ${dado}.`;
    moverFicha(j, dado);
    lanzarBtn.disabled = true;
});

siguienteBtn.addEventListener("click", () => {
    cartaDiv.classList.add("oculta");
    siguienteBtn.classList.add("oculta");
    jugadorActual = (jugadorActual + 1) % jugadores.length;
    actualizarInterfaz();
    lanzarBtn.disabled = false;
});

// --- INSTRUCCIONES ---
toggleBtn.addEventListener("click", () => {
    textoInstrucciones.classList.toggle("oculta");
});
