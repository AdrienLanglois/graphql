import { SetAllAnimation } from "./anim.js"
import { UpdateAll } from "./display.js"
import { HandleEveryInputs } from "./inputs.js"

//fetch parameters
const DATABASE_URL = "https://zone01normandie.org/api/graphql-engine/v1/graphql"
const QUERY_LIMIT = 50

onload = ()=>{
    FetchData()
    HandleEveryInputs()
    SetAllAnimation()
}

function FetchData(offset=0){
    const myQuery = `
    query{
        user(where: {login: {_eq: "alangloi"}}) {
            login
            
            transactions (where:{type:{_in:["level","xp","up","down"]}}  
                        offset:`+offset+`){
                amount
                type
                path
                createdAt
                
                object{
                    type
                    name
                }
            }

            skills:transactions (where:{type:{_nin:["level","xp","up","down"]}}
                                offset:${offset}){
                amount
                type
            }

            progresses(
                offset:${offset} 
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

    const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxNDE4IiwiaWF0IjoxNjc5MzQ4ODI1LCJpcCI6IjgwLjEyLjg5LjE5NCwgMTcyLjE4LjAuMiIsImV4cCI6MTY3OTQzNTIyNSwiaHR0cHM6Ly9oYXN1cmEuaW8vand0L2NsYWltcyI6eyJ4LWhhc3VyYS1hbGxvd2VkLXJvbGVzIjpbInVzZXIiXSwieC1oYXN1cmEtY2FtcHVzZXMiOiJ7fSIsIngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6InVzZXIiLCJ4LWhhc3VyYS11c2VyLWlkIjoiMTQxOCIsIngtaGFzdXJhLXRva2VuLWlkIjoiZTE5N2I5YmEtZGQ2MC00Y2E4LWIxOGMtY2EyNmRkMmZmMDVhIn19.ztOUy7mwNL-QWQZ9t6lKrjG0OsxKP1moq0ukbuzdZWI" 
    fetch(DATABASE_URL,{
        method:"POST",

        headers:/*token && */{
            // Authorization : `Bearer ${token}`,
            "Content-Type":"application/json",
            "Accept":"application/json",
        },

        body:JSON.stringify({
            query:myQuery
        })
    }).then(response =>{

        return response.json()

    }).then(api=>{
        LOGIN = api.data.user[0].login
        GetProfilData(api.data.user[0].transactions)
        GetSkills(api.data.user[0].skills)
        GetAttempts(api.data.user[0].progresses)

        // fetch until there's no more data to fetch
        // update front-end when everything has been fetched
        if (api.data.user[0].transactions.length == QUERY_LIMIT
        || api.data.user[0].skills.length == QUERY_LIMIT
        || api.data.user[0].progresses.length == QUERY_LIMIT){
            FetchData(offset+QUERY_LIMIT)
        }else{
            UpdateAll()
        }

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


