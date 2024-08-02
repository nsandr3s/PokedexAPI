// script.js

const apiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=1000'; // Limitar a 1000 Pokémon para demostración

// Definir regiones y sus rangos de números en la Pokédex
const regiones = {
    'kanto': { min: 1, max: 151 },
    'johto': { min: 152, max: 251 },
    'hoenn': { min: 252, max: 386 },
    'sinnoh': { min: 387, max: 493 },
    'unova': { min: 494, max: 649 },
    'kalos': { min: 650, max: 721 },
    'alola': { min: 722, max: 809 },
    'galar': { min: 810, max: 898 }
};

let todosPokemones = []; // Guardar todos los Pokémon aquí

// Función para obtener todos los Pokémon de la API
async function obtenerPokemones() {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.results;
}

// Función para renderizar los Pokémon según la región y la búsqueda
async function renderizarPokemones(region = '', consultaBusqueda = '') {
    if (todosPokemones.length === 0) {
        todosPokemones = await obtenerPokemones();
    }

    const pokedex = document.getElementById('pokedex');
    pokedex.innerHTML = '';

    for (const pokemon of todosPokemones) {
        const response = await fetch(pokemon.url);
        const data = await response.json();

        // Obtener número del Pokémon (ID de la Pokédex)
        const id = data.id;
        const nombre = data.name.toLowerCase();
        const consulta = consultaBusqueda.toLowerCase();

        // Verificar si el Pokémon cumple con la búsqueda y la región seleccionada
        const regionPokemon = obtenerRegion(id);
        if ((region === '' || regionPokemon === region) &&
            (nombre.includes(consulta) || id.toString().includes(consulta))) {
            // Crear carta del Pokémon
            const carta = document.createElement('div');
            carta.className = 'carta-pokemon';
            carta.innerHTML = `
                <img src="${data.sprites.front_default}" alt="${data.name}">
                <h3>${data.name}</h3>
                <p>Tipo: ${data.types.map(typeInfo => typeInfo.type.name).join(', ')}</p>
                <p>ID: ${id}</p>
                <p>Región: ${regionPokemon}</p>
            `;
            pokedex.appendChild(carta);
        }
    }
}

// Función para obtener la región del Pokémon basado en su ID
function obtenerRegion(id) {
    for (const [region, rango] of Object.entries(regiones)) {
        if (id >= rango.min && id <= rango.max) {
            return region;
        }
    }
    return 'Desconocida'; // Para Pokémon que no encajan en los rangos definidos
}

// Función para filtrar Pokémon basado en la región y la búsqueda
function filtrarPokemones() {
    const region = document.getElementById('filtroRegiones').value;
    const consultaBusqueda = document.getElementById('buscar').value;
    renderizarPokemones(region, consultaBusqueda);
}

// Agregar eventos para la búsqueda y el filtro
document.getElementById('buscar').addEventListener('input', filtrarPokemones);
document.getElementById('filtroRegiones').addEventListener('change', filtrarPokemones);

// Renderizar inicialmente los Pokémon de la región Kanto por defecto
renderizarPokemones('kanto');
