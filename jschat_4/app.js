//서버 구동
const express = require("express");
const http = require("http");
const app =express();
const path = require("path");
const server = http.createServer(app);  //app이 http를 통해서 실행
//console.log('a');
const socketIO = require("socket.io");

const io = socketIO(server);


const users_name=[];
const users_score=[];



app.use(express.static(path.join(__dirname, "src")));  //프로젝트 주소 + public

//-----------------------------------------
app.get('/game', (req, res) => {
    //res.sendFile(__dirname + "/ingame");
    res.sendFile(__dirname + "/src/ingame.html");
    
});
//----------------------------------------
const PORT = process.env.PORT || 5000;

io.on("connection",(socket)=>{
    socket.on("chatting",(data=>{       //서버에서 데이터 받기  data:클라에서 보냄
        //console.log(data);
        //console.log('1');  
        if(users_score.indexOf(data.score)!=-1){
            const user_set = {
                user1_name : data.name,
                user1_score: data.score,

                user2_name : users_name.splice(users_score.indexOf(data.score),1),
                user2_score: users_score.splice(users_score.indexOf(data.score),1)
            }
            io.emit("matching",user_set);
        }
        else{
            users_name.push(data.name);
            users_score.push(data.score);
            //console.log(users);
            console.log(users_name);
            console.log(users_score);
            io.emit("chatting",data);
        }
        
        //console.log(typeof(data.score));
        
           //to client
    }))
//--------------------------------------------------
    socket.on("chatting2",(data=>{       //서버에서 데이터 받기  data:클라에서 보냄
        //console.log(data);
        //console.log('1');  
        
        io.emit("chatting2",data);   //to client
    }))
//--------------------------------------------------
}); //connection이 이루어지면 연결에 대한 정보를 소캣에 담음

server.listen(PORT,()=>console.log(`server is reunning ${PORT}`));