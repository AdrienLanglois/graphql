//parameters
const TECHNICAL_SKILLS = ["tcp","stats","front-end","back-end","algo"]
const SPECIALTIES_SKILLS = ["game"]

// user data

let LOGIN = ""
let TOTAL_XP = 0
let LEVEL = 0
let COMPLETED_EX = 0
let COMPLETED_PROJECTS = 0
let LEVEL_TRANSACTIONS = []
let USER_CREATION_DATE = 0
let SKILLS = new Map()
let AUDIT_UP = 0
let AUDIT_DOWN = 0
let PROGRESSES = []

// TV animations
let TV_ON = false
let CURRENT_CHANNEL = 0
const currentChanSpan = document.getElementById("current-channel")
const powerBtn = document.getElementById("tv-power-button")
const channelBtn = document.getElementById("tv-channel-button")

//sounds
let SOUND_ENABLE = false
const rainOnBrick = new Audio("../assets/sounds/Rain_on_Brick.mp3")


// profil page
const profilWrapper = document.getElementById("profil-wrapper")
const levelSpan = document.getElementById("level")
const totalXPSpan = document.getElementById("total-xp")
const completedExSpan = document.getElementById("completed-ex")
const completedProjectSpan = document.getElementById("completed-projects")
const rankProgressBar = document.getElementById("rank-progress-bar-fill")
const rankSVG = document.getElementById("rank-svg")

// skill page
const skillsWrapper = document.getElementById("skills-wrapper")
const examSkills = document.getElementById("exam-skills")
const techSkills = document.getElementById("technical-skills")
const speSkills = document.getElementById("specialties-skills")
const languageSkills = document.getElementById("language-skills")

// piscine page
let SELECTED_PISCINE = 0
const piscineWrapper = document.getElementById("piscine-wrapper")
const piscineBtn = document.getElementById("switch-piscine")
const piscineFilterBtn = document.getElementById("piscine-filter-button")
