//PRIMERA EJECUCION AL ENTRAR A LA WEB
let primeraEjecucion = false;
//LIMPIAR EL SESSION STORAGE CADA VEZ QUE SE RECARGE LA PAGINA
sessionStorage.clear()

//DECLARO LAS VARIABLES DE LOS CONTENEDORES EN EL HTML
const pokemonContainer = document.querySelector(".pokemon-container");
const listaPokemon = document.querySelector('.list-contenedor');

//FUNCION Y PEDIDO PARA TRAER LOS POKEMONES
function traerPokemon(id) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
        .then(res => {
            // SI LA RESPUESTA ESTA OKEY DEVUELVE LA INFORMACION EN JSON
            if (res.ok) {

                return res.json()

            } else { // SI SE PIDE UN POKEMON QUE NO EXISTE SE DEVUELVE ESTO
                console.warn(`No existe ${id}`)
            }

        })

    //DESESTRUCTURACION PARASOLO UTILIZAR LA INFORMACION QUE NECESITO 
    .then(data => {
        const {
            id,
            name,
            types,
            stats,
            sprites
        } = data

        const datosPokemon = {
            id: id,
            name: name,
            types: types,
            stats: stats,
            sprites: sprites,
        }

        // CONDICION PARA EVITAR DUPLICADOS
        if (Object.keys(sessionStorage).includes(id.toString())) {
            return console.warn(`${id} ya esta en la lista!`)
        }
        // GUARDO LOS DATOS TRANSFORMADOS EN STRINGS DEL POKEMON EN EL SESSION STORAGE Y CREACION DE POKEMON
        sessionStorage.setItem(data.id, JSON.stringify(datosPokemon))
        crearPokemon(data)

        //CONDICION PARA EJECUTAR EL PRIMER POKEMON AL CARGAR LA PAGINA
        if (primeraEjecucion === false) {
            destacar(data.id)
            primeraEjecucion = true
        }

        return data
    })

}

// FUNCION PARA TRAER LA CANTIDAD DE POKEMON QUE QUIERO
function pokemones(numeros) {
    for (let i = 1; i <= numeros; i++) {
        traerPokemon(i)
    }
}
//LLAMADO A LA FUNCION DE POKEMONES
pokemones(8);


//FUNCION PARA DESTACAR EL POKEMON LLAMADO EN LA LISTA
function destacar(id) {
    //CONVIERTO EN OBJETO JSON LOS DATOS DEL SESSION STORAGE
    const pokemon = JSON.parse(sessionStorage.getItem(id))

    // INSERTO EN EL HTML LOS DATOS QUE QUIERO DEL POKEMON 
    pokemonContainer.innerHTML = `
        <div class="pokemon-contenido">
        <div class="img-contenedor" id="img-contenedor">
        <img src='${pokemon.sprites.front_default}' class="poke-img">
        <img src='./Img/fondo.png' class="poke-img2">
        </div>
        <div class="pokemon-info">
            <h2>${pokemon.name}</h2>
            <p class="pokemon-type">#${pokemon.id.toString().padStart(3, 0)} <img src='./Img/pokeball.png' class="pokeball"></p>
            <p >Type: ${pokemon.types[0].type.name.toUpperCase()}</p>
            <p>Hp: ${pokemon.stats[0].base_stat}</p>
            <p>Attack: ${pokemon.stats[1].base_stat}</p>
            <p>Defense: ${pokemon.stats[2].base_stat}</p>
            <p>Speed: ${pokemon.stats[5].base_stat}</p>
        </div>
        </div>
        `;
}

//FUNCION QUE GENERA LOS BOTONES DE LA LISTA POKEMON 
function crearPokemon(pokemon) {

    listaPokemon.innerHTML += `
    <button class="btn-poke"  onclick="destacar(${pokemon.id})"> <img src='./Img/pokeball.png' class="pokeball"> <img src='${pokemon.sprites.front_default}' class="poke-img-btn"> #${pokemon.id.toString().padStart(3, 0)} <p>${pokemon.name}</p></button>
    `;

}