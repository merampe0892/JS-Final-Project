const grid = document.querySelector('.pokemon__grid');
const teamContainer = document.querySelector('.team__container');
const searchInput = document.getElementById('pokemonName');
const searchBtn = document.getElementById('searchBtn');
const errorDiv = document.getElementById('error');

const MAX_TEAM_SIZE = 6;
let team = [];
let lastSearchedPokemon = null; 

async function fetchKantoPokemon() {
  
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151&offset=0'); 
    const allPokemon = await response.json();

    const detailPromises = allPokemon.results.map(async (pokemon) => {
      const res = await fetch(pokemon.url);
      const pokemonData = await res.json();
      return pokemonData;
    });

    const pokemonDetails = await Promise.all(detailPromises);

    grid.innerHTML = '';
    const cardsHtml = pokemonDetails.map(pokemonData =>
      buildPokemonCardHtml(pokemonData, false)
    ).join('');
    grid.innerHTML = cardsHtml;
 
}

async function searchPokemon() {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) {
    errorDiv.textContent = 'Type a Pokémon name or ID.';
    return;
  }

  try {
    errorDiv.textContent = '';
    grid.innerHTML = 'Loading...';

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`); 
    if (!response.ok) {
      throw new Error('Not found');
    }
    const pokemonData = await response.json();
    lastSearchedPokemon = pokemonData;

    grid.innerHTML = buildPokemonCardHtml(pokemonData, true);
  } catch (error) {
    console.error('Error searching Pokémon:', error);
    grid.innerHTML = '';
    errorDiv.textContent = 'Pokémon not found. Try another name or ID.';
  }
}

function buildPokemonCardHtml(pokemon, showAddButton) {
  const types = pokemon.types.map(t => t.type.name); 

  let typesHtml = '';
  if (types[0]) {
    typesHtml += `<li class = pokemon-type>${types[0]}</li>`;
  }
  if (types[1]) {
    typesHtml += `<li class = pokemon-type>${types[1]}</li>`;
  }

  const addButtonHtml = showAddButton
    ? `<button class="add-to-team" data-id="${pokemon.id}">Add to team</button>`
    : '';

  return `
    <div class="pokemon-card">
      <img class="pokemon__img" src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
      <h4 class="pokemon__name">${pokemon.name}</h4>
      <p class="pokemon__id">#${pokemon.id}</p>
      <ul class = pokemon-types>
        ${typesHtml}
      </ul>
      ${addButtonHtml}
    </div>
  `;
}


function renderTeam() {
  const teamHtml = team.map((pokemon, index) => {
    const types = pokemon.types.map(t => t.type.name);

    let typesHtml = '';
    if (types[0]) typesHtml += `<li class = pokemon-type>${types[0]}</li>`;
    if (types[1]) typesHtml += `<li class = pokemon-type>${types[1]}</li>`;

    return `
      <div class="pokemon-card">
        <img class="pokemon__img" src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <h4 class="pokemon__name">${pokemon.name}</h4>
        <p class="pokemon__id">#${pokemon.id}</p>
        <ul class = pokemon-types>
            ${typesHtml}
        </ul>
        <button class="remove-from-team" data-index="${index}">Remove</button>
      </div>
    `;
  }).join('');

  teamContainer.innerHTML = teamHtml;
}

function addToTeam(pokemon) {
  if (team.length >= MAX_TEAM_SIZE) {
    errorDiv.textContent = 'Team is full. Remove a Pokémon first.';
    return;
  }

  if (team.some(p => p.id === pokemon.id)) {
    errorDiv.textContent = 'That Pokémon is already in your team.';
    return;
  }

  team.push(pokemon);
  errorDiv.textContent = '';
  renderTeam();
}

grid.addEventListener('click', (event) => {
  if (event.target.matches('.add-to-team')) {
    const id = Number(event.target.getAttribute('data-id'));
    if (lastSearchedPokemon && lastSearchedPokemon.id === id) {
      addToTeam(lastSearchedPokemon);
    }
  }
});

teamContainer.addEventListener('click', (event) => {
  if (event.target.matches('.remove-from-team')) {
    const index = Number(event.target.getAttribute('data-index'));
    team.splice(index, 1);
    renderTeam();
  }
});

searchBtn.addEventListener('click', searchPokemon);
searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    searchPokemon();
  }
});

fetchKantoPokemon();
