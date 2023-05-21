import { DisplayAttemptsGraph } from "./display.js"

export function HandleEveryInputs(){
    channelBtn.onclick = HandleChannelButton
    piscineBtn.onclick = HandlePiscineButton
}

let disconnectBtn = document.getElementById("disconnect-btn")
disconnectBtn.onclick = ()=>{
    location.reload()
}

function HandleChannelButton(){
    if (!TV_ON){
        return
    }

    CURRENT_CHANNEL++

    //reset all
    ResetAll()

    switch (CURRENT_CHANNEL) {
    case 0:// profil
        profilWrapper.style.opacity = 1
        currentChanSpan.innerText = "Profile"
        mainDiv.style.height = "200vh"
        break;
    case 1:// skills
        skillsWrapper.style.opacity = 1
        skillsWrapper.style.zIndex = 1
        currentChanSpan.innerText = "Skills"
        mainDiv.style.height = "200vh"
        break;
    case 2:// piscine
        piscineWrapper.style.opacity = 1
        piscineWrapper.style.zIndex = 1
        currentChanSpan.innerText = "Piscine"
        piscineBtn.disabled = false
        piscineFilterBtn.disabled = false
        mainDiv.style.height = "600vh"
        break;
    default:
        CURRENT_CHANNEL = 0
        profilWrapper.style.opacity = 1
        currentChanSpan.innerText = "Profile"
        break;
    }
}

function ResetAll(){
    skillsWrapper.style.opacity = 0
    profilWrapper.style.opacity = 0
    piscineWrapper.style.opacity = 0
    piscineBtn.disabled = "true"
    piscineFilterBtn.disabled = "true"
}   

function HandlePiscineButton(){
    SELECTED_PISCINE++
    if (SELECTED_PISCINE == 3){
        SELECTED_PISCINE=0
    }
    DisplayAttemptsGraph()
}