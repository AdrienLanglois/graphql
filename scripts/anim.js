export function SetAllAnimation(){
    MakeItRain()
    powerBtn.onclick = HandlePowerButton
}

function HandlePowerButton(){
    TV_ON = !TV_ON

    if (TV_ON){
        CURRENT_CHANNEL = 0
        // wait for the animation to finish, then remove transition
        setTimeout(()=>{
            profilWrapper.style.transition = "0s"
        },1500)

        DisplayRain()
        TurnLightOn()
        return
    }

    // TV OFF
    TurnLightOff()
    
}

function TurnLightOn(){
    // play music
    PlayAudio(rainOnBrick)

    //general animation
    const mainDiv = document.getElementById("main")
    mainDiv.style.opacity = 1
    main.style.animation = "neonTube 2.5s infinite alternate"

    // display profil page
    document.getElementById("profil-wrapper").style.opacity=1

    //turn on TV
    document.getElementById("tv-screen").style.backgroundColor = "rgb(30,30,30)"
    currentChanSpan.innerHTML = "Profil"
    Blink(currentChanSpan)
    Blink(document.querySelector(".tv-span"))
}

function TurnLightOff(){
    profilWrapper.style.opacity = 0.1
    skillsWrapper.style.opacity = 0
    const mainDiv = document.getElementById("main")
    mainDiv.style.animation = "none"
    
    for (const screenSpan of document.querySelectorAll(".tv-span")){
        screenSpan.style.opacity = 0
    }
}

function Blink(html){
    //     animation: neonTube 4.5s infinite alternate;
    setTimeout(()=>html.style.opacity=1,250)
    setTimeout(()=>html.style.opacity=0,350)
    setTimeout(()=>html.style.opacity=1,450)
    setTimeout(()=>html.style.opacity=0,550)
    setTimeout(()=>html.style.opacity=1,700)
}

///////////// RAIN ////////////////////

function MakeItRain(){
    const rainDiv = document.getElementById("rain")
    //rain
    for (let i = 0;i<100;i++){
        
        setTimeout(()=>{
            let x = RandomValue(0,20)
            if (i%2 == 0){
                x+=80
            }

            const drop = document.createElement("div")
            drop.className = "drop"
            drop.style.left = x + "%"
            //     transform:translateY(130vh);
            drop.style.transform = "translateY("+RandomValue(125,135)+"vh)"
            rainDiv.append(drop)

        },RandomValue(0,1000))
    }

    for (let i=0;i<20;i++){
        setTimeout(()=>{
            let x = RandomValue(0,20)
            let y = RandomValue(133,145)
            if (i%2 == 0){
                x+=80
            }
    
            const splash = document.createElement("div")
            splash.className = "splash"
            splash.style.left = x + "%"
            splash.style.top = y + "vh"
            splash.style.animation = "splash 0.5s linear infinite"
            rainDiv.append(splash)
        },RandomValue(0,500))
    }
}

function DisplayRain(){
    const drops = document.querySelectorAll(".drop")
    for (const drop of drops){
        drop.style.opacity = 0.3
    }

    const splashs = document.querySelectorAll(".splash")
    for (const splash of splashs){
        splash.style.opacity = 0.8
    }
}

///////////// UTILITIES ////////////////

function RandomValue(min,max){
    return Math.round(Math.random() * (max - min) + min);
}

function PlayAudio(html){
    if (SOUND_ENABLE){
        html.play()
    }
}


