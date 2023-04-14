import { SetAllAnimation } from "./anim.js"
import { UpdateAll } from "./display.js"
import { HandleEveryInputs } from "./inputs.js"
import {DisplayAdminMsg} from "./auth.js"
//fetch parameters
const DATABASE_URL = "https://zone01normandie.org/api/graphql-engine/v1/graphql"
const LOGIN_URL = "https://zone01normandie.org/api/auth/signin"

document.querySelector("form").onsubmit = (event)=>{
    event.preventDefault()

    const username = document.querySelector(".username-input")
    const password = document.querySelector(".password-input")

    GetToken(username.value,password.value)
    .then(token=>{

        if (token.error){
            DisplayAdminMsg("$access denied.$ unrecognized username/email or password.","red")
            return
        }
        FetchData(token)
        setTimeout(()=>DisplayAdminMsg(`Connected successfully, welcome $${NAME}$ !`,"cyan"),1000)
        setTimeout(()=>{
            document.getElementById("auth").remove()
            document.getElementById("main").style.opacity = 1
        },4000)
    })
    
    username.value = ""
    password.value = ""
    return false //prevent page from reloading
}

onload = ()=>{
    DisplayAdminMsg(`Welcome user, please enter your $login$ and $password$.`,"yellow")
    SetAllAnimation()
    HandleEveryInputs()
}

async function GetToken(username,password){
    const auth = btoa(username+":"+password)

    const token = fetch(LOGIN_URL,{
        method:"POST",

        headers:{
            Authorization: "Basic "+auth//basic authentification with base64 encoding (btoa)
        },

    }).then(response=>{
        return response.json()
    }).then(resp=>{
        return resp
    }).catch(()=>{
        alert("error fetching authentification")
    })
    return token
}

function FetchData(token){
    const myQuery = `
    query{
        user {
            login
            attrs
            
            transactions (where:{type:{_in:["level","xp","up","down"]}}){
                amount
                type
                path
                createdAt
                
                object{
                    type
                    name
                }
            }

            skills:transactions (where:{type:{_nin:["level","xp","up","down"]}}){
                amount
                type
            }

            progresses(
                where:{
                  _and:{
                    object:{type:{_eq:"exercise"}},
                    isDone:{_eq:true}
                  }
                }){

                grade
                path
                isDone

                object{
                    type
                    name
                }
            }
        }
    }
    `

    fetch(DATABASE_URL,{
        method:"POST",

        headers:token && {
             Authorization : `Bearer ${token}`,
            "Content-Type":"application/json",
            "Accept":"application/json",
        },

        body:JSON.stringify({
            query:myQuery
        })
    }).then(response =>{
        return response.json()
    }).then(api=>{
        NAME = api.data.user[0].attrs.firstName +" "+ api.data.user[0].attrs.lastName
        LOGIN = api.data.user[0].login
        GetProfilData(api.data.user[0].transactions)
        GetSkills(api.data.user[0].skills)
        GetAttempts(api.data.user[0].progresses)

        UpdateAll()

    }).catch(err =>{
        alert(err)
    })
}

function GetProfilData(transactions){
    for (const data of transactions){

        if (data.object.name == "introduction"){
            USER_CREATION_DATE = data.createdAt
            continue
        }

        if (!IsFromCursus(data.path)){
            continue
        }

        if (data.type == "up"){
            AUDIT_UP+=data.amount
            continue
        }

        if (data.type == "down"){
            AUDIT_DOWN+=data.amount
            continue
        }

        if (data.type == "level"){

            if (data.amount>LEVEL){
                LEVEL = data.amount
            }

            LEVEL_TRANSACTIONS.push({
                level:data.amount,
                date:new Date(data.createdAt),
                project:data.object.name
            })
            continue
        }

        if (data.object.type == "exercise"){
            COMPLETED_EX++
        }

        if (data.object.type == "project"){
            COMPLETED_PROJECTS++
        }

        TOTAL_XP+=data.amount
    }
}

function GetSkills(transactions){
    for (const transaction of transactions){
        const type = transaction.type.split("_")[1]

        if (type == undefined){
            alert("skill type is undefined")
        }
        
        if (SKILLS[type]<transaction.amount || SKILLS[type] == undefined){
            SKILLS.set(type,transaction.amount)
        }
    }
}

function GetAttempts(progresses){
    if (progresses.length == 0){
        return
    }

    if (PROGRESSES.length == 0){
        PROGRESSES.push(NewProgress(progresses[0].object.name,progresses[0].path))
    }

    for (const p of progresses){
        let currentProgress = PROGRESSES[PROGRESSES.length - 1]

        if (p.object.name != currentProgress.name){
            currentProgress = NewProgress(p.object.name,p.path)
            PROGRESSES.push(currentProgress)
        }

        if (p.grade == 0){
            currentProgress.failure++
        }
        if (p.grade == 1){
            currentProgress.success++
        }
    }
}

function NewProgress(exerciceName,myPath){
    return {
        name:exerciceName,
        success:0,
        failure:0,
        path:myPath
    }
}

//////////// UTILITIES //////////////

function IsFromCursus(path){
    return path.startsWith("/rouen/div-01") && !path.startsWith("/rouen/div-01/piscine")
}