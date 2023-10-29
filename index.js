class Stack {
  constructor() {
    this.items = [];
  }

  push(element) {
    this.items.push(element);
  }

  pop() {
    if (this.items.length === 0) return 'Underflow';
    return this.items.pop();
  }

  getTop() {
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length === 0;
  }
}

let team1Stack = new Stack();
let team2Stack = new Stack();

async function fetchPokemons() {
  const response = await fetch('https://pokeapi.co/api/v2/pokemon?offset=150&limit=150');
  const data = await response.json();

  const select1 = document.getElementById('pokemon1');
  const select2 = document.getElementById('pokemon2');
  const select3 = document.getElementById('pokemon3');

  data.results.forEach(pokemon => {
    const option = document.createElement('option');
    option.text = pokemon.name;
    option.value = pokemon.url;

    select1.add(option.cloneNode(true));
    select2.add(option.cloneNode(true));
    select3.add(option.cloneNode(true));
  });

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

async function fetchPokemonImage(pokemonId, stack) {
  const select = document.getElementById(pokemonId);
  const response = await fetch(select.value);
  const data = await response.json();

  document.getElementById(pokemonId + 'Image').src = data.sprites.front_default;

  stack.push({ name: data.name, power: data.stats.reduce((total, stat) => total + stat.base_stat, 0) });
}

async function startBattle() {
  const team1Container = document.getElementById('team1');
  const select1 = document.getElementById('pokemon1');
  const select2 = document.getElementById('pokemon2');
  const select3 = document.getElementById('pokemon3');
  const opponentContainer = document.getElementById('opponentTeam');

  team1Container.innerHTML = '';
  opponentContainer.innerHTML = '';

  if (select1.value === "" || select2.value === "" || select3.value === "") {
    alert("Please select 3 Pokémon to start the battle!");
    return;
  }

  team1Stack = new Stack();
  team2Stack = new Stack();

  const yourTeam = [select1, select2, select3];
  for (let i = 0; i < yourTeam.length; i++) {
    const select = yourTeam[i];
    const response = await fetch(select.value);
    const data = await response.json();

    const pokemonImage = document.createElement('img');
    pokemonImage.src = data.sprites.front_default;
    team1Container.appendChild(pokemonImage);

    team1Stack.push({ name: data.name, power: data.stats.reduce((total, stat) => total + stat.base_stat, 0) });
  }

  for (let i = 0; i < 3; i++) { 
    let random = Math.floor(Math.random() * 150) + 1;
    let res = await fetch(`https://pokeapi.co/api/v2/pokemon/${random}/`);
    let data = await res.json();
    let power = data.stats.reduce((total, stat) => total + stat.base_stat, 0);

    const opponentPokemonImage = document.createElement('img');
    opponentPokemonImage.src = data.sprites.front_default;
    opponentContainer.appendChild(opponentPokemonImage);

    team2Stack.push({ name: data.name, power: power });
  }

  let winnerTeam;
  while (!team1Stack.isEmpty() && !team2Stack.isEmpty()) {
    let yourPokemon = team1Stack.pop();
    let opponentPokemon = team2Stack.pop();

    if (yourPokemon.power > opponentPokemon.power) {
      winnerTeam = 'Your Team';
    } else if (yourPokemon.power < opponentPokemon.power) {
      winnerTeam = 'Opponent';
    } else {
      winnerTeam = 'Draw';
    }
  }

  document.getElementById('winnerName').innerHTML = `The winner is: ${winnerTeam}`;
}

fetchPokemons();



