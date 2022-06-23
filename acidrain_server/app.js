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

function AAA()
{
    userdata.room.push({
        id_p1: userdata.ingameList[0], 
        id_p2: userdata.ingameList[1],  
        score_p1: 0,
        score_p2: 0,
        timer: 120,
        words: userdata.GetWords(),
    });
    console.log(`room id 1 : ${userdata.room[0].id_p1}`);
    console.log(`room id 2 : ${userdata.room[0].id_p2}`);
    socket.to(userdata.room[0].id_p1).emit("setwords", userdata.room[0].words);
    socket.to(userdata.room[0].id_p2).emit("setwords", userdata.room[0].words);
    // socket.emit("setwords", userdata.room[0].words);
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
        userdata.ingameList.push(socket.id);
        if(userdata.ingameList.length >= 2)
            AAA();
        for(let i=0;i<userdata.ingameList.length;i++)
        {
            console.log(`${i + 1} : ${userdata.ingameList[i]}`);
        }
        if (userdata.ingameList.length >= 2) // 2명 이상의 유저가 매칭될 경우
        {
            
        }
    });

    socket.on("sendword", (word) => {
        console.log(`socket ID : ${socket.id}`);
    })
});