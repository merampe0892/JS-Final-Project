let url = `https://pokeapi.co/api/v2/pokemon/1/`;
async function fetchKantoPokemon() {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
    const allPokemon = await response.json();
    console.log(allPokemon)

    allPokemon.results.map((pokemon) => 
        fetch(pokemon.url).then(res => res.json()).then(allPokemon => {
        console.log(allPokemon)
        renderPokemon(allPokemon);
    }))
}

function renderPokemon(allPokemon) {
    const allPokemonContainer = document.querySelector('pokemon__grid');
    allPokemonContainer.innerHTML = (
        (pokemon) =>
        `<div class="pokemon-card">
            <img src="${allPokemon.sprites.front_default}" alt="Pokémon sprite">
            <h4>${allPokemon.name}</h4>
            <p>#${allPokemon.id}</p>
            <ul>
                <li>${allPokemon.types[0].type.name}</li>
                <li>${allPokemon.types[1] ? allPokemon.types[1].type.name : 'None'}</li>
            </ul>
        </div>`).join('');
}


fetchKantoPokemon();


