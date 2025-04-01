document.addEventListener("DOMContentLoaded", () => {
    const app = document.getElementById("app");
    const startButton = document.createElement("button");
    startButton.textContent = "Start Pokemon App";
    startButton.id = "start-button";
    startButton.addEventListener("click", startPokemonApp);
    app.appendChild(startButton);

    const select = document.createElement("select");
    select.id = "pokemon-select";
    app.appendChild(select);
});

class Pokemon {
    constructor(name, height, weight, attack, defense, imageUrl, moves) {
        this.name = name;
        this.height = height;
        this.weight = weight;
        this.attack = attack;
        this.defense = defense;
        this.imageUrl = imageUrl;
        this.moves = moves;
    }
}

const getData = async (url) => {
    const response = await fetch(url);
    const json = await response.json();
    return json
}

function startPokemonApp() {
    const app = document.getElementById("app");
    app.innerHTML = "";
    
    const container = document.createElement("div");
    container.id = "pokemon-container";
    app.appendChild(container);

    const select = document.createElement("select");
    select.id = "pokemon-select";
    container.appendChild(select);
    
    fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
        .then(response => response.json())
        .then(data => {
            renderPokemonDropdown(data.results);
        });
    
    const button = document.createElement("button");
    button.textContent = "Get Pokemon Data";
    button.addEventListener("click", () => {
        const selectedUrl = select.value;
        fetchPokemonData(selectedUrl);
    });
    

    container.appendChild(button);
    container.appendChild(document.createElement("div")).id = "pokemon-info";
}

function renderPokemonDropdown(pokemonList) {
    const dropdown = document.getElementById("pokemon-select");
    dropdown.innerHTML = "";
    
    //Nedan saknas något för att kunna hämta data när en option är vald
    pokemonList.forEach(pokemon => {
        const option = document.createElement("option");
        option.textContent = pokemon.name;
        option.value = pokemon.url;
        dropdown.appendChild(option);
    });
}

async function fetchPokemonData(url) {
    let response = await fetch(url);
    let data = await response.json();

    //Fetch moves for the Pokemon
    const moveUrls = data.moves.slice(0,5).map(move => move.move.url);
    let movesPromises = moveUrls.map(url => getData(url));
    let moves = await Promise.all(movesPromises);

    console.log(moves);
    
    const pokemon = new Pokemon(
        data.name,
        data.height,
        data.weight,
        data.stats.find(stat => stat.stat.name === "attack").base_stat,
        data.stats.find(stat => stat.stat.name === "defense").base_stat,
        data.sprites.front_default,
        moves
    );
    displayPokemonData(pokemon);
}

function displayPokemonData(pokemon) {
    const infoDiv = document.getElementById("pokemon-info");
    infoDiv.innerHTML = `
        <h2>${pokemon.name}</h2>
        <img src="${pokemon.imageUrl}" alt="${pokemon.name}">
        <p>Height: ${pokemon.height}</p>
        <p>Weight: ${pokemon.weight}</p>
        <p>Attack: ${pokemon.attack}</p>
        <p>Defense: ${pokemon.defense}</p>
        <h3>Moves</h3>
        ${pokemon.moves.map(move => `<p>${move.name} - ${move.power || 0} Power</p>`).join("")}
    `;
}

