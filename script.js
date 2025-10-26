const tablero = document.getElementById("tablero");
const lanzarBtn = document.getElementById("lanzar-dado");
const resultado = document.getElementById("resultado-dado");
const cartaDiv = document.getElementById("carta");
const mostrarBtn = document.getElementById("mostrar-respuesta");
const siguienteBtn = document.getElementById("siguiente-turno");
const posSpan = document.getElementById("posicion");
const conexionesSpan = document.getElementById("conexiones");
const tituloJugador = document.getElementById("titulo-jugador");
const formJugadores = document.getElementById("form-jugadores");
const numJugadoresSelect = document.getElementById("num-jugadores");
const toggleBtn = document.getElementById("toggle-instrucciones");
const textoInstrucciones = document.getElementById("texto-instrucciones");
const seccionTablero = document.getElementById("tablero-section");
const seccionInfo = document.getElementById("info-jugador");
const seccionCarta = document.getElementById("carta-section");

const colores = ["verde", "azul", "amarillo", "rojo", "negro"];
const cartas = {
    verde: [
        { texto: "“Mi jefe es un flojo.” ¿Observación o juicio?", respuesta: "“Mi jefe no entregó el informe esta semana.” (observación sin juicio)" },
    ],
    azul: [
        { texto: "“Nadie me respeta.” ¿Qué sentimiento hay detrás de esta frase?", respuesta: "“Me siento frustrado y triste porque necesito reconocimiento.”" },
    ],
    amarillo: [
        { texto: "“¡Siempre llegas tarde!” ¿Qué necesidad no satisfecha hay detrás?", respuesta: "“Necesito puntualidad y consideración por el tiempo compartido.”" },
    ],
    rojo: [
        { texto: "“Quiero que dejes de ser egoísta.” Reformúlala como petición clara.", respuesta: "“¿Podrías avisarme si vas a llegar tarde para reorganizar mis planes?”" },
    ],
    negro: [
        { texto: "“Si me amaras, lo sabrías.” ¿Qué tipo de bloqueo es?", respuesta: "Negación de responsabilidad. Reformulación CNV: “Me gustaría sentirme comprendido; ¿podrías preguntarme qué necesito cuando estoy callado?”" },
    ],
};

let jugadores = [];
let jugadorActual = 0;

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

formJugadores.addEventListener("submit", (e) => {
    e.preventDefault();
    const num = parseInt(numJugadoresSelect.value);
    if (num < 2 || num > 6) return;

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
    mostrarBtn.classList.remove("oculta");
    siguienteBtn.classList.add("oculta");

    cartaDiv.innerHTML = `
        <p><strong>${color === "negro" ? "🖤 Bloqueo de la Compasión" : color.toUpperCase()}</strong></p>
        <p>${carta.texto}</p>
        <div id="respuesta" class="respuesta oculta">${carta.respuesta}</div>
    `;

    mostrarBtn.onclick = () => {
        document.getElementById("respuesta").classList.remove("oculta");
        mostrarBtn.classList.add("oculta");
        siguienteBtn.classList.remove("oculta");

        if (color !== "negro") jugador.conexiones++;
        if (jugador.conexiones >= 4) {
        cartaDiv.innerHTML = `<h3>🎉 ¡Jugador ${jugador.id} logra 4 Conexiones de Vida! 🌱</h3>`;
        lanzarBtn.disabled = true;
        mostrarBtn.classList.add("oculta");
        siguienteBtn.classList.add("oculta");
        }
    };
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

// Mostrar / Ocultar instrucciones
toggleBtn.addEventListener("click", () => {
    textoInstrucciones.classList.toggle("oculta");
});
