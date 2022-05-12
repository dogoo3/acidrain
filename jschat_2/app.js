//서버 구동
const express = require("express");
const http = require("http");
const app =express();
const path = require("path");
const server = http.createServer(app);  //app이 http를 통해서 실행
//console.log('a');
const socketIO = require("socket.io");

const io = socketIO(server);


const users=[];



app.use(express.static(path.join(__dirname, "src")));  //프로젝트 주소 + public
const PORT = process.env.PORT || 5000;

io.on("connection",(socket)=>{
    socket.on("chatting",(data=>{       //서버에서 데이터 받기  data:클라에서 보냄
        //console.log(data);
        //console.log('1');  
        users.push(data.score);
        console.log(data.score);
        console.log(users);
        io.emit("chatting",data);   //to client
    }))
}); //connection이 이루어지면 연결에 대한 정보를 소캣에 담음

server.listen(PORT,()=>console.log(`server is reunning ${PORT}`));