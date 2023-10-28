async function fetchPokemons() {
    // Realiza una solicitud a la API de Pokemon para obtener información sobre los primeros 150 Pokemon.
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?offset=150&limit=150');
    const data = await response.json();
  
    // Obtiene referencias a los elementos 'select' en el documento HTML.
    const select1 = document.getElementById('pokemon1');
    const select2 = document.getElementById('pokemon2');
    const select3 = document.getElementById('pokemon3');
  
    // Itera a través de la lista de Pokemon obtenida y crea opciones para los tres elementos 'select'.
    data.results.forEach(pokemon => {
      const option = document.createElement('option');
      option.text = pokemon.name;
      option.value = pokemon.url;
  
      select1.add(option.cloneNode(true));
      select2.add(option.cloneNode(true));
      select3.add(option.cloneNode(true));
    });
  
    // Habilita el segundo 'select' cuando se selecciona un Pokemon en el primer 'select'.
    select1.onchange = () => { select2.disabled = false; fetchPokemonImage('pokemon1'); };
    // Habilita el tercer 'select' cuando se selecciona un Pokemon en el segundo 'select'.
    select2.onchange = () => { select3.disabled = false; fetchPokemonImage('pokemon2'); };
    // Llama a la función fetchPokemonImage para cargar la imagen del Pokemon seleccionado en el tercer 'select'.
    select3.onchange = () => { fetchPokemonImage('pokemon3'); };
  }
  
  async function fetchPokemonImage(pokemonId) {
    // Obtiene la URL del Pokemon seleccionado en el elemento 'select'.
    const select = document.getElementById(pokemonId);
    const response = await fetch(select.value);
    const data = await response.json();
  
    // Actualiza la imagen del Pokemon en el elemento 'img'.
    document.getElementById(pokemonId + "Image").src = data.sprites.front_default;
  }
  
  async function startBattle() {
    // Obtiene las URL de los Pokemon seleccionados en los tres 'select'.
    const select1 = document.getElementById('pokemon1');
    const select2 = document.getElementById('pokemon2');
    const select3 = document.getElementById('pokemon3');
    const options = [select1.value, select2.value, select3.value];
  
    // Selecciona al azar uno de los Pokemon como el ganador de la batalla.
    const winnerIndex = Math.floor(Math.random() * options.length);
    const finalistsIndexes = options.filter((value, index) => index !== winnerIndex);
  
    // Obtiene información sobre el Pokemon ganador.
    const response = await fetch(options[winnerIndex]);
    const data = await response.json();
  
    // Muestra el nombre y la imagen del Pokemon ganador.
    document.getElementById("winnerName").innerHTML = data.name;
    document.getElementById("winnerImage").src = data.sprites.front_default;
  
    // Obtiene información sobre los finalistas y muestra sus imágenes.
    finalistsIndexes.forEach(async (url, index) => {
      const res = await fetch(url);
      const finalistData = await res.json();
  
      // Muestra las imágenes de los finalistas.
      document.getElementById(`finalist${index + 1}Image`).src = finalistData.sprites.front_default;
    });
  }
  
  // Inicia la función para cargar la información de los Pokemon.
  fetchPokemons();
  