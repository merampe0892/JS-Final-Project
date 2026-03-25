const grid = document.querySelector('.pokemon__grid');

function onSearchChange(event) {
    console.log(event.target.value)
}

async function fetchKantoPokemon() {
  try {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=18');
    const allPokemon = await response.json();

    const detailPromises = allPokemon.results.map(async (pokemon) => {
      const res = await fetch(pokemon.url);
      const pokemonData = await res.json();
      return pokemonData;
    });

    const pokemonDetails = await Promise.all(detailPromises);

    grid.innerHTML = '';
    pokemonDetails.forEach((pokemonData) => {
      renderPokemon(pokemonData);
    });
  } catch (error) {
    console.error('Error fetching Kanto Pokémon:', error);
  }
}

function renderPokemon(pokemon) {
  const card = document.createElement('div');
  card.classList.add('pokemon-card');

  card.innerHTML = `
    <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
    <h4>${pokemon.name}</h4>
    <p>#${pokemon.id}</p>
    <ul>
      <li>${pokemon.types[0].type.name}</li>
      <li>${pokemon.types[1] ? pokemon.types[1].type.name : 'None'}</li>
    </ul>
  `;

  grid.appendChild(card);
}

fetchKantoPokemon();


function showPokemon(pokemonName) {
    console.log(localStorage.setItem("pokemonName", pokemonName))
}