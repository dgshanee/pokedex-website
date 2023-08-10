const pokedex = document.getElementById("pokedex");
let keyWords = [];
let stuff = [];
let numPokemon = 500;
console.log(pokedex);

const typePicDict = {
    fire: "./public/fire.png",
    bug: "./public/bug.png",
    dark: "./public/dark.png",
    dragon: "./public/dragon.png",
    electric: "./public/electric.png",
    fairy: "./public/fairy.png",
    fighting: "./public/fighting.png",
    flying: "./public/flying.png",
    ghost: "./public/ghost.png",
    grass: "./public/grass.png",
    ground: "./public/ground.png",
    ice:  "./public/ice.png",
    normal: "./public/normal.png",
    poison: "./public/poison.png",
    psychic: "./public/psychic.png",
    rock: "./public/rock.png",
    steel: "./public/steel.png",
    water: "./public/water.png"
};

const fetchPokemon = () => {
    const promises = [];
    for(let i = 1; i<=numPokemon;i++){
    const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
    promises.push(fetch(url)
        .then((res)=>
            res.json()));
        }
        Promise.all(promises).then((results)=>{
                const pokemonData = results.map((data)=>({
                name: data.name[0].toUpperCase()+data.name.substring(1),
                id:data.id,
                image:data.sprites['front_default'],
                type: data.types
                .map((type)=>type.type.name)
                .join(', '),
                typePic: ""
            }));
            console.log(pokemonData[0]);
            pushStuff(pokemonData);
            getNames(pokemonData);
            for(let i = 0;i<pokemonData.length;i++){
                let pokemons = stuff[i];
                setTypePic(stuff[i]);
            }
            console.log(stuff);
            displayPokemon(pokemonData);
        });
    }

function setTypePic(pokemons){
    let typePics = [];
    let types = pokemons.type.split(", ");
    for(let j = 0; j<types.length;j++){
        typePics.push(typePicDict[types[j]]);
        if(types.length == 1){
            typePics[1] = "./public/noDualType.png";
        }
    }
    pokemons.typePic = typePics;
    }
    


function pushStuff(pokemonData){
    for(let i = 0;i<pokemonData.length;i++){
        stuff.push(pokemonData[i]);
    }
    // console.log(stuff);
    // displayType();
    
}
const displayPokemon = (pokemonData) => {
    let pokemonHTMLString = pokemonData.map(pokemons => 
        `
    <a style = "text-decoration:none;" href = "/pokemon/template.html">
    <ul class = "card" href = "./pokemon/template.html">
        <img class = "card-image" src = "${pokemons.image}"/>
        <h1 class = "card-title"> ${pokemons.name} </h1>
        <p class = "card-subtitle">${pokemons.id}</p>
        <img class = "type-image1" src = "${pokemons.typePic[0]}"/>
        <img class = "type-image2" src = "${pokemons.typePic[1]}"/>
    </ul>
    </a>
    `
    )
    // let pokemonHTMLStringTypes = objectResult.map(pokemons =>
    //     `
    //     <ul class = "types">
    //         <img class = "type-image" src = "${pokemons.typePic[0]}"/>
    //     </ul>
    //     `
    //     )
    
    pokedex.innerHTML = pokemonHTMLString;
}

function displayType(){
    for(let i = 0; i<stuff.length; i++){
        console.log(stuff[i].name);
        console.log(stuff[i].type);
    }
}

function getNames (pokemonData) {
    for(let i = 0; i<pokemonData.length; i++){
        keyWords.push(pokemonData[i].name);
    }
    // console.log(keyWords);
}

const resultsBox = document.querySelector(".result-box");
const inputBox = document.getElementById("input-box");

inputBox.onkeyup = function(){
    // console.log("hi");
    // console.log(keyWords);
    let result = [];
    let input = inputBox.value;
    let word = "";
    if(input.length){
        result = keyWords.filter((word)=>{
            return word.toLowerCase().includes(input.toLowerCase());
        });
        // console.log(result);
    }
    letsGetThisObject(result);   
}

function letsGetThisObject(result){
    let objectResult = [];
    // console.log("hello im running");   
    // console.log(result);
    // console.log(stuff); 
    for(let i = 0; i<result.length;i++){
        for(let j = 0; j<stuff.length;j++){
            // console.log("hello im also running");
        if(stuff[j].name == result[i]){
            // console.log(stuff[j]);
            objectResult.push(stuff[j]);
        }
    }
}
displayPokemon(objectResult);
}




fetchPokemon();   
