import express from "express";
import "express-async-errors";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { Server } from "socket.io";
import requestRouter from "./router/request.js";
import * as userdata from "./data/userdata.js";

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan("tiny"));

app.use("/request", requestRouter);

app.use((req, res, next) => {
    res.sendStatus(404);
})

app.use((error, req, res, next) => {
    console.error(error);
    res.sendStatus(500);
})

export let index = -1;
let _flag = false;
const server = app.listen(7000);
export const socket = new Server(server, {
    cors: {
        origin: "*",
    },
});

function MakeRoom()
{
    // 방을 만든 후
    userdata.room.push({
        id_p1: userdata.ingameList[0], 
        id_p2: userdata.ingameList[1],  
        score_p1: 0,
        score_p2: 0,
        timer: 120,
        words: userdata.GetWords(),
    });
    // 소켓 ID를 찍어본 목적은 페이지에서 보내는 ID와 저장된 ID가 같은지 확인하기 위함
    console.log(`room id 1 : ${userdata.room[userdata.room.length-1].id_p1}`);
    console.log(`room id 2 : ${userdata.room[userdata.room.length-1].id_p2}`);
    // 각 클라이언트로 랜덤으로 뽑은 단어를 보낸다
    socket.to(userdata.room[userdata.room.length-1].id_p1).emit("setwords", userdata.room[userdata.room.length-1].words);
    socket.to(userdata.room[userdata.room.length-1].id_p2).emit("setwords", userdata.room[userdata.room.length-1].words);
    // 인게임 대기열을 초기화한다.
    userdata.ingameList.length = 0;
}

socket.on("connection", socket => {
    if (_flag) // 페이지 이동시 소켓ID를 재할당하기위해 Flag도 조건에 포함
    {
        _flag = false;
        console.log("재할당");
        userdata.socketList[index] = socket.id;
    }
    socket.on("enter", message => { // 유저가 대기열에 입장
        userdata.socketList.push(socket.id);
    });

    socket.on("disconnect", () => {
        for (let i = 0; i < userdata.socketList.length; i++) {
            if (userdata.socketList[i] == socket.id) {
                console.log("삭제");
                index = i;
                _flag = true; // 페이지 이동시 재할당을 위한 Flag
                break;
            }
        }
    });

    socket.on("ingame", () => {
        // 인게임 리스트에 2명의 유저가 들어오면(페이지가 넘어가면서 emit되기때문에 거의 동시에 접속함)
        userdata.ingameList.push(socket.id); 
        if(userdata.ingameList.length >= 2)
            MakeRoom(); // 방을 개설한다
    });

    socket.on("sendword", (word) => {
        console.log(`GET WORD : ${word}`);
    
        console.log(socket.id)
        for(let i =0;i<userdata.room.length;i++){   //방 찾기
            if(socket.id==userdata.room[i].id_p1 || socket.id==userdata.room[i].id_p2){

                console.log('방찾음');
                for(let j=0; j<userdata.room[i].words.length;j++){  //단어 찾기
                    if(userdata.room[i].words[j]==word){
                        if(socket.id==userdata.room[i].id_p1){  //p1이 단어를 입력했을 때
                            console.log('1');
                            userdata.room[i].score_p1++;
                            socket.emit("updatemyscore", userdata.room[i].score_p1) //p1의 변경된 점수를 '나'의 점수로 업데이트
                            
                            socket.to(userdata.room[i].id_p2).emit("updateotherscore", userdata.room[i].score_p1);  //p1의 변경된 점수를 '상대'의 점수로 업데이트

                            // 단어 업데이트
                            userdata.room[i].words[j]='';
                            socket.emit("setwords", userdata.room[i].words);    //송신한 클라에 단어 업데이트
                            socket.to(userdata.room[i].id_p2).emit("setwords", userdata.room[i].words);
                        }
                        if(socket.id==userdata.room[i].id_p2){  //p2가 단어를 입력했을 때
                            console.log('2');
                            userdata.room[i].score_p2++;
                            socket.emit("updatemyscore", userdata.room[i].score_p2) //p2의 변경된 점수를 '나'의 점수로 업데이트
                            
                            socket.to(userdata.room[i].id_p1).emit("updateotherscore", userdata.room[i].score_p2);  //p2의 변경된 점수를 '상대'의 점수로 업데이트
                       
                            // 단어 업데이트
                            userdata.room[i].words[j]='';
                            socket.emit("setwords", userdata.room[i].words);    //송신한 클라에 단어 업데이트
                            socket.to(userdata.room[i].id_p1).emit("setwords", userdata.room[i].words);
                        }
                        console.log('단어찾음');
                        break;
                    }
                }

            }
        }
    })
});