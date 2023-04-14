export function UpdateAll(){
    console.log("updating all")
    UpdateProfilPage()

    DisplayAttemptsGraph()
    
    for (const [skill,amount] of SKILLS.entries()){
        DisplaySkill(skill,amount)
    }
}



///////////// PROFIL ////////////////

export function UpdateProfilPage(){
    currentChanSpan.innerHTML = "Profil"
    levelSpan.innerHTML = LEVEL
    totalXPSpan.innerHTML ="total XP : " + TOTAL_XP
    completedExSpan.innerHTML = "completed exercices : " + COMPLETED_EX
    completedProjectSpan.innerHTML = "completed projects : " + COMPLETED_PROJECTS
    rankProgressBar.style.width = LEVEL+"%"
    document.getElementById("identifier").innerHTML = LOGIN

    UpdateAuditGraph()
    GenerateLevelGraph()
    DisplayRank()
}

function GenerateLevelGraph(){
    //    <line x1="0" y1="0" x2="200" y2="200" style="stroke:rgb(255,0,0);stroke-width:2" />
    //    <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
    const axisYlength = 400
    const axisXlength = 900

    const beginningDate = new Date(USER_CREATION_DATE)
    const daysSinceBeginning = (new Date() - beginningDate)

    for (const data of LEVEL_TRANSACTIONS){
        const dotY = 450 - axisYlength * data.level / LEVEL
        const dotX = (data.date-beginningDate)*axisXlength/daysSinceBeginning + 50

        const dot = document.createElementNS("http://www.w3.org/2000/svg","circle")
        dot.setAttribute("cx",dotX)
        dot.setAttribute("cy",dotY)
        dot.setAttribute("r",4)
        dot.setAttribute("level",data.level)
        dot.setAttribute("project",data.project)
        dot.classList.add("graph-dot")
        rankSVG.append(dot)

        dot.addEventListener("mouseover",()=>{
            const text = document.createElementNS("http://www.w3.org/2000/svg","text")
            text.setAttribute("x",dotX+20)
            text.setAttribute("y",dotY+20)
            text.classList.add("graph-dot-details")
            text.innerHTML = "level "+dot.getAttribute("level")+" reached with "+dot.getAttribute("project")
            rankSVG.append(text)
            setTimeout(()=>text.style.opacity = 0,1500)
            setTimeout(()=>text.remove(),2000)
        })

    }
}

function DisplayRank(){
    const rank = document.getElementById("rank-span")

    if (LEVEL<10){
        rank.innerHTML = "Aspiring developer"
        return
    }
    if (LEVEL>=10 && LEVEL<20){
        rank.innerHTML = "Beginner developer"
        return
    }
    if (LEVEL>=20 && LEVEL<30){
        rank.innerHTML = "Apprentice developer"
        return
    }
    if (LEVEL>=30 && LEVEL<40){
        rank.innerHTML = "Assistant developer"
        return
    }
    if (LEVEL>=40 && LEVEL<50){
        rank.innerHTML = "Basic developer"
        return
    }
    if (LEVEL>=50 && LEVEL<55){
        rank.innerHTML = "Junior developer"
        return
    }
    if (LEVEL>=55 && LEVEL<60){
        rank.innerHTML = "Confirmed developer"
        return
    }
    if (LEVEL>=60){
        rank.innerHTML = "Full-Stack developer"
        return
    }
}

function UpdateAuditGraph(){
    const defaultRectWidth = 200
    let ratio = (AUDIT_UP/AUDIT_DOWN).toFixed(2)

    const rectangle = document.getElementById("audit-up")
    rectangle.setAttribute("width",Math.round(defaultRectWidth*ratio))
    const ratioText = document.getElementById("audit-ratio")
    ratioText.innerHTML = ratio

    document.getElementById("audit-xp-up").innerHTML = "+ "+AUDIT_UP.toFixed(0)
    document.getElementById("audit-xp-down").innerHTML = "- "+AUDIT_DOWN.toFixed(0)
}

///////////// SKILLS ////////////////

export function DisplaySkill(skill,amount){
    const container = document.createElement("div")
    container.className = "skill-container"

    const spanContainer = document.createElement("div")
    spanContainer.className = "skill-span-container"

    const nameSpan = document.createElement("span")
    nameSpan.className = "skill-name"
    nameSpan.innerText = skill

    const percentageSpan = document.createElement("span")
    percentageSpan.className = "progress-bar-percentage"
    percentageSpan.innerText = amount+"%"

    const progressBar = document.createElement("div")
    progressBar.className = "progress-bar"

    const fill = document.createElement("div")
    fill.className = "progress-bar-fill"
    fill.style.width = amount+"%"

    progressBar.append(fill)
    spanContainer.append(nameSpan,percentageSpan)
    container.append(spanContainer,progressBar)

    if (TECHNICAL_SKILLS.includes(skill)){
        techSkills.append(container)
        return
    }
    if (SPECIALTIES_SKILLS.includes(skill)){
        speSkills.append(container)
        return
    }
    if (skill == "prog"){
        nameSpan.innerText = "cursus"
        examSkills.append(container)
        return
    }
    languageSkills.append(container)
}

// ATTEMPTS

export function DisplayAttemptsGraph(){
    const attemptsContainer = document.getElementById("attempts-container")
    attemptsContainer.innerHTML = ""
    let data = FilterByPiscine()

    for (const d of data){
        const nameSpan = document.createElement("span")
        nameSpan.className = "attempt-name"
        nameSpan.innerText = d.name

        const itemsContainer = document.createElement("div")
        itemsContainer.className = "attempt-items"

        const attemptBar = document.createElement("div")
        attemptBar.className = "progress-bar"
        attemptBar.style.width = 2*Math.round(d.failure/d.success)+"%"

        const attemptSpan = document.createElement("span")
        attemptSpan.className = "attempt-span"
        attemptSpan.innerText = `(${d.success+d.failure} attempt)`

        itemsContainer.append(attemptBar,nameSpan,attemptSpan)
        attemptsContainer.append(itemsContainer)
    }


}

function FilterByPiscine(){
    switch (SELECTED_PISCINE) {
        case 0:
            return PROGRESSES.filter((data)=>{
                return data.path.startsWith("/rouen/piscine-go")
            })
        case 1:
            return PROGRESSES.filter((data)=>{
                return data.path.startsWith("/rouen/div-01/piscine-js")
            })
        case 2:
            return PROGRESSES.filter((data)=>{
                data.path.startsWith("/rouen/div-01/piscine-rust")
            })
        default:
            alert("unknown piscine selected")
            break;
    }
}
