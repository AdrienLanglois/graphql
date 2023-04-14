export function DisplayAdminMsg(message,color){
    const div = document.getElementById("admin-box")
    div.innerText = ""

    let i = 0
    let colorEnabled = false

    let span = document.createElement("span")
    span.style.color = color

    const interval = setInterval(()=>{

        if (message[i] == '$'){
            if (!colorEnabled) div.append(span)
            else{
                span = document.createElement("span")
                span.style.color = color
            }
            
            colorEnabled = !colorEnabled

        }else{
            if (colorEnabled){
                span.innerHTML+=message[i]
            }else{
                div.innerHTML+=message[i]
            }
        }

        i++
        if (i>=message.length) clearInterval(interval)
    },40)
}

