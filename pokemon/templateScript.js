const typePicDict = {
    fire: "../public/fire.png",
    bug: "../public/bug.png",
    dark: "../public/dark.png",
    dragon: "../public/dragon.png",
    electric: "../public/electric.png",
    fairy: "../public/fairy.png",
    fighting: "../public/fighting.png",
    flying: "../public/flying.png",
    ghost: "../public/ghost.png",
    grass: "../public/grass.png",
    ground: "../public/ground.png",
    ice:  "../public/ice.png",
    normal: "../public/normal.png",
    poison: "../public/poison.png",
    psychic: "../public/psychic.png",
    rock: "../public/rock.png",
    steel: "../public/steel.png",
    water: "../public/water.png",
    special: "../public/special.png",
    status: "../public/status.png",
    physical: "../public/physical.png"
};

const setPage = () => {
    console.log("page loaded");
    document.querySelector(`#mainBody`).style.display = "inline";
    document.querySelector(`#loadingScreen`).style.display = "none";
}
setTimeout(setPage, 250);



let altTabOpen = false;

const displayMoveDescription = async (data) => {
    altTabOpen = true;
    document.querySelector(`#altWrapper`).style.display = "inline";
    const moveDataPromise = (await fetch(data)).json();
    const moveData = await moveDataPromise.then(data => {modifyDisplayMoveDescriptionDOM(data)});
}

const modifyDisplayMoveDescriptionDOM = (move) => {
    console.log(move);
    document.querySelector(`#desc1Img`).style.display = "inline";
    document.querySelector(`#desc2Img`).style.display = "inline";
    document.querySelector(`#typeDescTitle`).style.display = "inline";
    document.querySelector(`#typeDescWrapper`).style.display = "flex";
    document.querySelector(`#basePowerWrapper`).style.display = "flex";
    document.querySelector(`#accuracyDescWrapper`).style.display = "inline";
    document.querySelector(`#ppDescWrapper`).style.display = "inline";
    let shortDescText = ``;
    if(move.effect_entries.length>0){
            shortDescText += (move.effect_entries[0].effect.replace(`$effect_chance%`, `${move.effect_chance}%`));
    }
    else{
        shortDescText = `This move has no additional effects.`;
    }
    let accuracy = ``;
    if(move.accuracy == null){
        accuracy = `-`;
    }
    else{
        accuracy = move.accuracy + "%";
    }
    let basePower = ``;
    if(move.power == null){
        document.querySelector(`#basePowerWrapper`).style.display = "none";
    }
    else{
        document.querySelector(`#basePowerWrapper`).style.display = "inline";
        basePower = move.power;
    }
    document.querySelector(`#moveDescName`).innerText = getCaps(move.name);
    document.querySelector(`#desc1Img`).src = typePicDict[move.type.name].substring(2);
    document.querySelector(`#desc2Img`).src = typePicDict[move.damage_class.name].substring(2);
    document.querySelector(`#ppDescNumber`).innerText = move.pp;
    document.querySelector(`#moveShortDesc`).innerText = shortDescText;
    document.querySelector(`#basePowerNum`).innerText = basePower;
    document.querySelector(`#accuracyDescNumber`).innerText = accuracy;
}

const getCaps = (word) => {
    let wordSplit = word.split("-");
    let result = ``;
    wordSplit.map(word =>{
        result+= (word[0].toUpperCase()+word.substring(1)+` `)
    })
    return (result.substring(0,result.length-1));
}

const displayAbilityDescription = async (url) => {
    altTabOpen = true;
    document.querySelector(`#altWrapper`).style.display = "inline";
    const moveDataPromise = (await fetch(url)).json();
    const moveData = await moveDataPromise.then(data => {modifyDisplayAbilityDescriptionDOM(data)});
}

const modifyDisplayAbilityDescriptionDOM = (data) => {
    document.querySelector(`#moveDescName`).innerText = getCaps(data.name);
    document.querySelector(`#desc1Img`).style.display = "none";
    document.querySelector(`#desc2Img`).style.display = "none";
    document.querySelector(`#typeDescTitle`).style.display = "none";
    document.querySelector(`#typeDescWrapper`).style.display = "none";
    document.querySelector(`#basePowerWrapper`).style.display = "none";
    document.querySelector(`#accuracyDescWrapper`).style.display = "none";
    document.querySelector(`#ppDescWrapper`).style.display = "none";
    document.querySelector(`#moveShortDesc`).innerText = data.effect_entries[1].short_effect;    
}

const backButtonPressed = () => {
    console.log("hi");
    const backButton = document.querySelector(`#backButton`);
    if(altTabOpen){
        altTabOpen = false;
        document.querySelector(`#altWrapper`).style.animation = "moveDescriptionSlideOut 0.5s";
        setTimeout(function() {document.querySelector(`#altWrapper`).style.display = "none";
        document.querySelector(`#altWrapper`).style.animation = "moveDescriptionSlideIn 0.5s";
    }, 500);
    }else{
        window.location = "/"
    }
}
