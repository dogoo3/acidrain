"use strict"

let myscore = -1;

const socket = io();

const nickname = document.querySelector("#nickname");
const scoreList = document.querySelector(".score-list");
const scoreInput = document.querySelector(".score-input");
const sendButton = document.querySelector(".send-button");

sendButton.addEventListener("click",()=>{  

    const param = {
        name : nickname.value,
        score: scoreInput.value
    }
    
    myscore = scoreInput.value;
    console.log(myscore);
    socket.emit("chatting", param);
})

//socket.emit("chatting", "from front");  //to server

socket.on("chatting", (data)=>{     //on은 받기
    //console.log(data)
    const li  = document.createElement("li");
    li.innerText = `${data.name}님이 - ${data.score}`;
    scoreList.appendChild(li)
    //console.log(scoreList);
})


console.log(socket);