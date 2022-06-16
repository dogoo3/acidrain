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

socket.on("connection", socket => {
    if(index > -1 && _flag) // 페이지 이동시 소켓ID를 재할당하기위해 Flag도 조건에 포함
    {
        _flag = false; 
        console.log("재할당");
        userdata.socketList[index] = socket.id;
    }
    socket.on("enter", message => { // 유저가 대기열에 입장
        userdata.socketList.push(socket.id);
    });

    socket.on("disconnect", () => {
        for(let i = 0;i<userdata.socketList.length;i++)
        {
            if(userdata.socketList[i] == socket.id)
            {
                console.log("삭제");
                index = i;
                _flag = true; // 페이지 이동시 재할당을 위한 Flag
                break;
            }
        }
    });
});