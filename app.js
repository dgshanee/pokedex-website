const pokedex = document.getElementById("pokedex");
let keyWords = [];
let stuff = [];
let numPokemon = 1010;

const setPage = () => {
    console.log("page loaded");
    document.querySelector(`#mainBody`).style.display = "inline";
    document.querySelector(`#loadingScreen`).style.display = "none";
    document.querySelector(`body`).style.backgroundImage = "url(public/pokeballBackground.jpg)";
    document.querySelector(`body`).style.backgroundRepeat = "no-repeat";
    document.querySelector(`body`).style.backgroundPosition = "center";
    document.querySelector(`body`).style.backgroundPositionY = "200px";
}
setTimeout(setPage, 1500);

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
            pushStuff(pokemonData);
            getNames(pokemonData);
            for(let i = 0;i<pokemonData.length;i++){
                let pokemons = stuff[i];
                setTypePic(stuff[i]);
            }
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
    
}
const displayPokemon = (objectResult) => {
    console.time();
    let pokemonHTMLString = objectResult.map(pokemons => 
        `
    <a id = "${(pokemons.id)}" target = "_blank" style = "text-decoration:none;" onClick = "reply_click(this.id)">
    <ul class = "card">
        <img class = "card-image" src = "${pokemons.image}"/>
        <h1 class = "card-title"> ${pokemons.name} </h1>
        <p class = "card-subtitle">${pokemons.id}</p>
        <img class = "type-image1" src = "${pokemons.typePic[0]}"/>
        <img class = "type-image2" src = "${pokemons.typePic[1]}"/>
    </ul>
    </a>
    `
    )
    
    pokedex.innerHTML = pokemonHTMLString;
    console.timeEnd();
}


function getNames (pokemonData) {
    for(let i = 0; i<pokemonData.length; i++){
        keyWords.push(pokemonData[i].name);
    }
}

const resultsBox = document.querySelector(".result-box");
const inputBox = document.getElementById("input-box");

inputBox.onkeyup = function(){
    let result = [];
    let input = inputBox.value;
    let word = "";
    if(input.length){
        result = keyWords.filter((word)=>{
            return word.toLowerCase().substring(0,input.length) == (input.toLowerCase());
        });
    }
    letsGetThisObject(result.sort());   
}

function letsGetThisObject(result){
    let objectResult = [];

    for(let i = 0; i<result.length;i++){
        for(let j = 0; j<stuff.length;j++){
        if(stuff[j].name == result[i]){
            objectResult.push(stuff[j]);
        }
    }
}
displayPokemon(objectResult);
}

const sayHi = () => {
    console.log("hi");
}


function reply_click(clicked_id){
    let v = (clicked_id);
    let pokemonPromise = findObject(v);
    pokemonPromise.then(pokemon => {
        let page = window.open(`pokemon/template.html`);
        if(page == null){
            page = window;
        }
        
        page.addEventListener(`DOMContentLoaded`, () => {
            // adding details after page is loaded
            
            const evoChain = getEvoChain(pokemon);
            evoChain.then(async function(evoChain){
                let promiseArray = evoChain;
                for(let i = 0; i<evoChain.length; i++){
                    for(let j = 0; j<evoChain[i].length; j++){
                        promiseArray[i][j] = findObject(evoChain[i][j]);
                    }
                }
                const promise4All = Promise.all(promiseArray.map(Promise.all.bind(Promise)));
                const resolvedPromises = await promise4All;
                // const resolvedPromises = await Promise.all(promiseArray)
                Promise.all(resolvedPromises).then( () => {
                    // add conditionals for no evo, 1 evo
                    displayEggMoves(resolvedPromises[0][0], page);
                    if(resolvedPromises.length == 1){
                        page.document.querySelector(`.evoContainers`).innerText = "This Pokemon does not evolve."
                    }

                    else if(resolvedPromises.length == 2){
                        page.document.getElementById(`evo1`).innerHTML = ``;
                        page.document.getElementById(`evo2`).innerHTML = ``;
                        for(let i = 0; i<resolvedPromises[0].length; i++){
                            page.document.getElementById(`evoListOne`).innerHTML += `
                            <img class = "smallSprite" id = "smallSprite1" src = "${resolvedPromises[0][i].sprites["front_default"]}"/>
                            ${resolvedPromises[0][i].name[0].toUpperCase()+resolvedPromises[0][i].name.substring(1)}
                            →`
                        }
                        page.document.getElementById(`evo3`).style.visibility = "hidden";
                        for(let i = 0; i<resolvedPromises[1].length; i++){
                            page.document.getElementById(`evoTwoList`).innerHTML +=  `
                            <li>
                            <img class = "smallSprite" id = "smallSprite1" src = "${resolvedPromises[1][i].sprites["front_default"]}"/>
                            ${resolvedPromises[1][i].name[0].toUpperCase()+resolvedPromises[1][i].name.substring(1)}
                            </li>
                            `
                        }
                    }
                    else if(resolvedPromises.length == 3){
                        page.document.getElementById(`evo1`).innerHTML = ``;
                        page.document.getElementById(`evo2`).innerHTML = ``;
                        page.document.getElementById(`evo3`).innerHTML = ``;
                        for(let i = 0; i<resolvedPromises[0].length; i++){
                            page.document.getElementById(`evoListOne`).innerHTML += `
                            <a id = "${(resolvedPromises[0][i].id)}" target = "_blank" style = "text-decoration:none;">
                            <img class = "smallSprite" id = "smallSprite1" src = "${resolvedPromises[0][i].sprites["front_default"]}"/>
                            ${resolvedPromises[0][i].name[0].toUpperCase()+resolvedPromises[0][i].name.substring(1)}
                            →
                            </a>`
                            page.document.getElementById(`${(resolvedPromises[0][i].id)}`).addEventListener("click", function() {reply_click(resolvedPromises[0][i].id)});

                        }
                        for(let i = 0; i<resolvedPromises[1].length; i++){
                            page.document.getElementById(`evoTwoList`).innerHTML +=  `
                            <a id = "${(resolvedPromises[1][i].id)}" target = "_blank" style = "text-decoration:none;">
                            <li>
                            <img class = "smallSprite" id = "smallSprite1" src = "${resolvedPromises[1][i].sprites["front_default"]}"/>
                            ${resolvedPromises[1][i].name[0].toUpperCase()+resolvedPromises[1][i].name.substring(1)}
                            →
                            </li>
                            </a>`
                            page.document.getElementById(`${(resolvedPromises[1][i].id)}`).addEventListener("click", function() {reply_click(resolvedPromises[1][i].id)});
                        }
                        for(let i = 0; i<resolvedPromises[2].length; i++){
                            page.document.getElementById(`evoThreeList`).innerHTML +=  `
                            <a id = "${(resolvedPromises[2][i].id)}" target = "_blank" style = "text-decoration:none;">
                            <li>
                            <img class = "smallSprite" id = "smallSprite1" src = "${resolvedPromises[2][i].sprites["front_default"]}"/>
                            ${resolvedPromises[2][i].name[0].toUpperCase()+resolvedPromises[2][i].name.substring(1)}
                            </li>
                            </a>
                            `
                            page.document.getElementById(`${(resolvedPromises[2][i].id)}`).addEventListener("click", function() {reply_click(resolvedPromises[2][i].id)});
                        }
                    }
                    else{
                        console.log("what?");
                    }
        
                }
                )
            })
            let types = pokemon.types
            .map((type)=>type.type.name);
            let typePics = [];
            for(let i = 0; i<types.length;i++){
                typePics[i] = typePicDict[types[i]].substring(1);
            }
            if(types.length==1){
              typePics[1] = "/public/noDualType.png"
            }
            let abilitiesList = []
            let newAbility = ``;
            for(let i = 0; i<pokemon.abilities.length;i++){
                newAbility = page.document.createElement(`dd`);
                newAbility.id = pokemon.abilities[i].ability.url;
                newAbility.innerText = getCaps(pokemon.abilities[i].ability.name);
                newAbility.class = `ability`;
                console.log(newAbility.class);
                newAbility.setAttribute("onclick", "displayAbilityDescription(this.id)");
                console.log(newAbility.onclick);
                page.document.querySelector(`#abilitiesWrapper`).appendChild(newAbility);
                // pokemon.abilities[i].ability.name[0].toUpperCase()+pokemon.abilities[i].ability.name.substring(1);
            }
            let abilityString = abilitiesList.join(", ");
            let name = pokemon.name[0].toUpperCase()+pokemon.name.substring(1)
            const mainImage = page.document.getElementById(`mainImg`);
            mainImage.src = pokemon.sprites["front_default"];
            page.document.getElementById(`name`).innerText = name;
            page.document.getElementById(`num`).innerText = "#"+pokemon.id;
            page.document.getElementById(`type1`).src = typePics[0];
            page.document.getElementById(`type2`).src = typePics[1];
            page.document.getElementById(`htwt`).innerText = (((pokemon.height)/10) +" cm, "+((pokemon.weight)/10)+" kg");
            // page.document.getElementById(`abilities`).innerText = abilityString;
            page.document.getElementById(`hp`).innerText = pokemon.stats[0].base_stat;
            page.document.getElementById(`atk`).innerText = pokemon.stats[1].base_stat;
            page.document.getElementById(`def`).innerText = pokemon.stats[2].base_stat;
            page.document.getElementById(`spatk`).innerText = pokemon.stats[3].base_stat;
            page.document.getElementById(`spdef`).innerText = pokemon.stats[4].base_stat;
            page.document.getElementById(`spd`).innerText = pokemon.stats[5].base_stat;
            console.log(pokemon);
            page.document.getElementById(`hpBar`).style.width = `${pokemon.stats[0].base_stat}px`;
            page.document.getElementById(`atkBar`).style.width = `${pokemon.stats[1].base_stat}px`;
            page.document.getElementById(`defBar`).style.width = `${pokemon.stats[2].base_stat}px`;
            page.document.getElementById(`spatkBar`).style.width = `${pokemon.stats[3].base_stat}px`;
            page.document.getElementById(`spdefBar`).style.width = `${pokemon.stats[4].base_stat}px`;
            page.document.getElementById(`spdBar`).style.width = `${pokemon.stats[5].base_stat}px`;
            page.document.getElementById(`totalNum`).innerText = `${getTotal(pokemon)}`
            displayLevelUpMoves(pokemon, page);
            displayMachineMoves(pokemon, page);
            displayTutorMoves(pokemon, page);
            const bars = [`hpBar`, `atkBar`, `defBar`, `spatkBar`, `spdefBar`, `spdBar`];
            for(let i = 0; i<pokemon.stats.length; i++){
                page.document.getElementById(bars[i]).style.backgroundColor = getStatColor(pokemon.stats[i].base_stat);
            }
            console.log(page.document.querySelector(`.moveContainer`));
        })
    })
}

const getStatColor = (stat) => {
    if(stat<45){
        return `red`;
    }
    else if(stat < 80){
        return `orange`;
    }
    else if(stat < 120){
        return `green`;
    }
    else{
        return `purple`
    }
}

function displayEvo2(page, resolvedPromises){
    for(let i = 0; i<resolvedPromises[1].length;i++){
        page.document.getElementById(`evo2`).innerHTML += `
        <img class = "smallSprite" id = "smallSprite1" src = "${resolvedPromises[1][i].sprites["front_default"]}"/>
        ${resolvedPromises[1][i].name[0].toUpperCase()+resolvedPromises[1].name.substring(1)}`
        }
}

function getTotal(pokemon){
    let result = 0;
    for(let i = 0; i<pokemon.stats.length; i++){
        result += pokemon.stats[i].base_stat;
    }
    return result;
}


async function getSpecies(pokemon){
    const response = await(fetch(pokemon.species.url));
    const data = await response.json();
    return data;
}
async function getEvoChain(pokemon){
    const pokeData = await getSpecies(pokemon);
    const response = await fetch(pokeData.evolution_chain.url);
    const data = await response.json();
    const evoChain = [];
    evoChain.push([data.chain.species.url.substring(42, data.chain.species.url.length-1)]);
    try{
    if(data.chain.evolves_to.length > 0){
        let chain2 = [];
        for(let i = 0; i<data.chain.evolves_to.length;i++){
            chain2.push(data.chain.evolves_to[i].species.url.substring(42, data.chain.evolves_to[i].species.url.length-1));
        }
        evoChain.push(chain2);
    if(data.chain.evolves_to[0].evolves_to.length > 0){
        let chain3 = [];
        for(let i = 0; i<data.chain.evolves_to[0].evolves_to.length;i++){
            chain3.push([data.chain.evolves_to[0].evolves_to[i].species.url.substring(42, data.chain.evolves_to[0].evolves_to[i].species.url.length-1)]);
        }
        evoChain.push(chain3);
    }
    }
    } catch(error){
        throw error;
    }
    return evoChain;
}


async function findObject(v){
    try{
    const url = `https://pokeapi.co/api/v2/pokemon/${v}/`
    const response = await fetch(url);
    if(!response.ok){
        throw new Error("Request failed");
    }
    const data = await response.json();
    return data;
    } catch(error){
        console.error(error);
        throw error;
    }   
}

function message_me() {
    console.log("hello");
}

async function displayLevelUpMoves(pokemon, page) {
    let moves = pokemon.moves;
    // let moveMethods = getMoveMethods(moves);
    let levelUpMoves = getMoveMethods(moves)[0];
    page.document.getElementById(`moveSet`).innerHTML = ``;
    for (let i = 0; i < levelUpMoves.length; i++) {
      const moveHTML = await giveMoveCards(levelUpMoves[i], page, `moveSet`);
      };
    }
async function displayMachineMoves(pokemon, page){
    let moves = pokemon.moves;
    // let moveMethods = getMoveMethods(moves);
    let levelUpMoves = getMoveMethods(moves)[1];
    page.document.getElementById(`tmSet`).innerHTML = ``;
    for(let i = 0; i<levelUpMoves.length; i++){
        await giveMoveCards(levelUpMoves[i], page, `tmSet`);
    }
}
async function displayTutorMoves(pokemon, page){
    let moves = pokemon.moves;
    // let moveMethods = getMoveMethods(moves);
    let levelUpMoves = getMoveMethods(moves)[2];
    page.document.getElementById(`tutorSet`).innerHTML = ``;
    for(let i = 0; i<levelUpMoves.length; i++){
        await giveMoveCards(levelUpMoves[i], page, `tutorSet`);
    }
}
async function displayEggMoves(pokemon, page){
    let moves = pokemon.moves;
    // let moveMethods = getMoveMethods(moves);
    let levelUpMoves = getMoveMethods(moves)[3];
    page.document.getElementById(`eggSet`).innerHTML = ``;
    for(let i = 0; i<levelUpMoves.length; i++){
        await giveMoveCards(levelUpMoves[i], page, `eggSet`);
    }
}

function getCaps(word){
    let wordSplit = word.split("-");
    let result = ``;
    wordSplit.map(word =>{
        result+= (word[0].toUpperCase()+word.substring(1)+` `)
    })
    return (result.substring(0,result.length-1));
}

function getMoveMethods(moves){
    let methodLists = [];
    let levelUp = [];
    let machine = [];
    let moveTutor = [];
    let egg = [];
    let unknown = [];
    moves.map(move => {
        if(move.version_group_details[move.version_group_details.length-1].move_learn_method.name == `level-up`){
            levelUp.push(move)
        }
        else if(move.version_group_details[move.version_group_details.length-1].move_learn_method.name == `machine`){
            machine.push(move);
        }
        else if(move.version_group_details[move.version_group_details.length-1].move_learn_method.name == `tutor`){
            moveTutor.push(move);
        }
        else if(move.version_group_details[move.version_group_details.length-1].move_learn_method.name == `egg`){
            egg.push(move);
        }
        else{
            unknown.push(move);
        }
    })
    levelUp = levelUpSort(levelUp);
    methodLists = [levelUp, machine, moveTutor, egg, unknown];
    return methodLists;
}

function numSort(nums){
    let list = nums;
    for(let i = 1; i<list.length;i++){
        let index = i;
        while(list[index]<list[index-1]&&index>0){
            let temp = list[index-1];
            list[index-1] = list[index];
            list[index] = temp;
            index--;

        }
    }
    return list;
}

function levelUpSort(levelUp){
    let list = levelUp;
    for(let i = 1; i<list.length;i++){
        let index = i;
        while(index>0&&(list[index].version_group_details[list[index].version_group_details.length-1].level_learned_at)<(list[index-1].version_group_details[list[index-1].version_group_details.length-1].level_learned_at)){
                let temp = list[index-1];
                list[index-1] = list[index];
                list[index] = temp;
                index--;
            
        }
    }
    return list;
}

async function giveMoveCards(move, page, idString)
    {
        let anotherPage = page;
        const response = await(fetch(move.move.url));
        const data = await response.json();
        let accuracy = ``;
        if(data.accuracy == null){
            accuracy = `-`;
        }
        else{
            accuracy = `${data.accuracy}%`
        }

        let level = ``;
        if(move.version_group_details[move.version_group_details.length-1].level_learned_at < 2){
            level = `-`;
        }
        else{
            level = `L${move.version_group_details[move.version_group_details.length-1].level_learned_at}`
        }
        let movesHTML = (`
        <ul>
                <div class = "moveContainer" id = "${move.move.url}" onclick = "displayMoveDescription(this.id)">
                    <li id = "levelCol">${level}</li>
                    <li id = "nameCol">${getCaps(data.name)}</li>
                    <li id = "typeCol">
                        <img src = "${typePicDict[data.type.name].substring(1)}"/>
                    </li>
                    <li id = "accCol">
                        <dt>Accuracy: </dt>
                        <dd>${accuracy}</dd>
                    </li>
                    <li id = "ppCol">
                        <dt>PP</dt>
                        <dd>${data.pp}</dd>
                    </li>
                </div>  
            </ul>
        `)
        page.document.getElementById(idString).innerHTML += movesHTML;
        return page.document.getElementById(data.name);
    }


fetchPokemon();   
