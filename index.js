// Definición de una clase 'Stack' que implementa una pila
class Stack {
  constructor() {
    this.items = []; // Arreglo para almacenar elementos
  }

  push(element) { // Método para agregar un elemento a la pila
    this.items.push(element);
  }

  pop() { // Método para extraer y devolver el último elemento de la pila
    if (this.items.length === 0) return 'Underflow'; // Manejo de pila vacía
    return this.items.pop();
  }

  getTop() { // Método para obtener el elemento superior de la pila
    return this.items[this.items.length - 1];
  }

  isEmpty() { // Método para verificar si la pila está vacía
    return this.items.length === 0;
  }
}

// Creación de dos instancias de la clase 'Stack' para los equipos
let team1Stack = new Stack();
let team2Stack = new Stack();

// Función asíncrona para obtener datos de la API de Pokémon
async function fetchPokemons() {
  // Llamada a la API de Pokémon para obtener un rango de datos
  const response = await fetch('https://pokeapi.co/api/v2/pokemon?offset=150&limit=150');
  const data = await response.json(); // Conversión de la respuesta a formato JSON

  // Selección de elementos en el HTML para los Pokémon
  const select1 = document.getElementById('pokemon1');
  const select2 = document.getElementById('pokemon2');
  const select3 = document.getElementById('pokemon3');

  // Iteración a través de los datos de Pokémon para agregar opciones a los selectores en HTML
  data.results.forEach(pokemon => {
    const option = document.createElement('option');
    option.text = pokemon.name;
    option.value = pokemon.url;

    select1.add(option.cloneNode(true));
    select2.add(option.cloneNode(true));
    select3.add(option.cloneNode(true));
  });

  // Configuración de manejadores de eventos para los selectores de Pokémon
  select1.onchange = () => {
    select2.disabled = false;
    fetchPokemonImage('pokemon1', team1Stack);
  };
  select2.onchange = () => {
    select3.disabled = false;
    fetchPokemonImage('pokemon2', team1Stack);
  };
  select3.onchange = () => {
    fetchPokemonImage('pokemon3', team1Stack);
  };
}

// Función asíncrona para obtener imágenes de Pokémon y almacenarlos en la pila
async function fetchPokemonImage(pokemonId, stack) {
  const select = document.getElementById(pokemonId);
  const response = await fetch(select.value);
  const data = await response.json();

  // Asignación de la imagen del Pokémon en el HTML
  document.getElementById(pokemonId + 'Image').src = data.sprites.front_default;

  // Almacenamiento del nombre y poder del Pokémon en la pila
  stack.push({ name: data.name, power: data.stats.reduce((total, stat) => total + stat.base_stat, 0) });
}

// Función para simular una batalla entre equipos
async function startBattle() {
  // Selección de elementos HTML para los equipos y el contenedor del oponente
  const team1Container = document.getElementById('team1');
  const select1 = document.getElementById('pokemon1');
  const select2 = document.getElementById('pokemon2');
  const select3 = document.getElementById('pokemon3');
  const opponentContainer = document.getElementById('opponentTeam');

  // Limpieza de los contenedores antes de iniciar la batalla
  team1Container.innerHTML = '';
  opponentContainer.innerHTML = '';

  // Verificación de si se han seleccionado los 3 Pokémon para la batalla
  if (select1.value === "" || select2.value === "" || select3.value === "") {
    alert("Please select 3 Pokémon to start the battle!");
    return;
  }

  // Creación de nuevas pilas para los equipos
  team1Stack = new Stack();
  team2Stack = new Stack();

  // Adquisición de los datos de los Pokémon seleccionados y almacenamiento en la pila del equipo 1
  const yourTeam = [select1, select2, select3];
  for (let i = 0; i < yourTeam.length; i++) {
    const select = yourTeam[i];
    const response = await fetch(select.value);
    const data = await response.json();

    // Creación y asignación de imágenes de los Pokémon en el HTML
    const pokemonImage = document.createElement('img');
    pokemonImage.src = data.sprites.front_default;
    team1Container.appendChild(pokemonImage);

    // Almacenamiento del nombre y poder del Pokémon en la pila del equipo 1
    team1Stack.push({ name: data.name, power: data.stats.reduce((total, stat) => total + stat.base_stat, 0) });
  }

  // Creación de un equipo oponente con 3 Pokémon aleatorios
  for (let i = 0; i < 3; i++) { 
    let random = Math.floor(Math.random() * 150) + 1;
    let res = await fetch(`https://pokeapi.co/api/v2/pokemon/${random}/`);
    let data = await res.json();
    let power = data.stats.reduce((total, stat) => total + stat.base_stat, 0);

    // Creación y asignación de imágenes de los Pokémon oponentes en el HTML
    const opponentPokemonImage = document.createElement('img');
    opponentPokemonImage.src = data.sprites.front_default;
    opponentContainer.appendChild(opponentPokemonImage);

    // Almacenamiento del nombre y poder del Pokémon en la pila del equipo 2
    team2Stack.push({ name: data.name, power: power });
  }

  // Simulación de una batalla comparando los poderes de los Pokémon en ambas pilas
  let winnerTeam;
  while (!team1Stack.isEmpty() && !team2Stack.isEmpty()) {
    let yourPokemon = team1Stack.pop();
    let opponentPokemon = team2Stack.pop();

    if (yourPokemon.power > opponentPokemon.power) {
      winnerTeam = 'Your Team'; // Equipo 1 gana
    } else if (yourPokemon.power < opponentPokemon.power) {
      winnerTeam = 'Opponent'; // Equipo 2 gana
    } else {
      winnerTeam = 'Draw'; // Empate
    }
  }

  // Mostrar al ganador en el HTML
  document.getElementById('winnerName').innerHTML = `The winner is: ${winnerTeam}`;
}

// Inicio de la carga de datos de Pokémon al cargar la página
fetchPokemons();


