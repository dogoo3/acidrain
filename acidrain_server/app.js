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
        id_p1: userdata.ingameList[0], // 유저의 소켓 ID
        id_p2: userdata.ingameList[1],
        delay_p1: 0, // 유저의 접속 여부를 파악하는 딜레이카운트
        delay_p2: 0,  
        cor_count_p1: 0, // 타이핑에 성공한 단어 갯수
        cor_count_p2: 0,
        score_p1: 0, // 점수
        score_p2: 0,
        combo_p1: 0, // 콤보
        combo_p2: 0,
        timer: 120,  //테스트용 10초, 120초로 바꿔야함 
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

    RoomTimer(userdata.room[userdata.room.length-1]);
}

function RoomTimer(room){
    if(room.timer>0){
        setTimeout(function(){
            room.timer--;
            console.log(room.timer);
            socket.to(room.id_p1).emit("timer", room.timer);
            socket.to(room.id_p2).emit("timer", room.timer);

            room.delay_p1++;
            room.delay_p2++;

            console.log(`D1 : ${room.delay_p1}`);
            console.log(`D2 : ${room.delay_p2}`);

            if(room.delay_p1 > 3 || room.delay_p2 > 3)
            {
                GameOver(room.id_p1, room.id_p2, "disconnection");
                return;
            }
            else
            {
                RoomTimer(room);
            }
        },1000)
    }
    else
    {
        GameOver(room.id_p1, room.id_p2, "gotomain");
    }
    
}

function UpdateWords(room, index_i, index_j) // 올바른 단어 입력 시 단어를 업데이트해주는 함수
{
    room[index_i].words[index_j] = '';
    socket.emit("setwords", room[index_i].words);    //송신한 클라에 단어 업데이트
    socket.to(room[index_i].id_p1).emit("setwords", room[index_i].words);
}

function GameOver(id_p1, id_p2, emit_message)
{
    console.log('게임 종료!')
    socket.to(id_p1).emit(emit_message);
    socket.to(id_p2).emit(emit_message);

    socket.emit(emit_message);

    // 모든 ROOM은 Queue의 형태(FIFO)를 띄므로 이렇게 코딩해도 무방하다고 판단됨
    userdata.room.splice(0,1);
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

    socket.on("delay", () => {
        for(let i=0;i<userdata.room.length;i++)
        {
            if(userdata.room[i].id_p1 == socket.id)
            {
                userdata.room[i].delay_p1 = 0;
                break;
            }
            if(userdata.room[i].id_p2 == socket.id)
            {
                userdata.room[i].delay_p2 = 0;
                break;
            }
        }
    });

    socket.on("sendword", (word) => {
        console.log(`GET WORD : ${word}`);
    
        console.log(socket.id)
        for(let i =0;i<userdata.room.length;i++){   //방 찾기
            if(socket.id==userdata.room[i].id_p1 || socket.id==userdata.room[i].id_p2){
                // if(word=='게임종료'){   //테스트용 코드 단어 입력란에 '게임종료' 입력하면 '/'로 이동
                //     console.log('종료시작');
                //     socket.to(userdata.room[i].id_p1).emit("gotomain");
                //     socket.to(userdata.room[i].id_p2).emit("gotomain");
            
                //     socket.emit("gotomain");
                // }
                console.log('방찾음');
                let j;
                for(j=0; j<userdata.room[i].words.length;j++){  //단어 찾기
                    if(userdata.room[i].words[j]==word){
                        if(socket.id==userdata.room[i].id_p1){  //p1이 단어를 입력했을 때
                            userdata.room[i].combo_p1++; // 콤보 증가
                            userdata.room[i].score_p1 += userdata.room[i].combo_p1; //콤보만큼 점수 추가
                            userdata.room[i].cor_count_p1++; // 타이핑 갯수 계상(시간내로 모두 입력했는지 판별하기 위함)
                            socket.emit("updatemyscore", userdata.room[i].score_p1) //p1의 변경된 점수를 '나'의 점수로 업데이트
                            
                            socket.to(userdata.room[i].id_p2).emit("updateotherscore", userdata.room[i].score_p1);  //p1의 변경된 점수를 '상대'의 점수로 업데이트
                        }
                        if(socket.id==userdata.room[i].id_p2){  //p2가 단어를 입력했을 때
                            userdata.room[i].combo_p2++; // 콤보 증가
                            userdata.room[i].score_p2 += userdata.room[i].combo_p2; //콤보만큼 점수 추가
                            userdata.room[i].cor_count_p2++; // 타이핑 갯수 계상(시간내로 모두 입력했는지 판별하기 위함)
                            socket.emit("updatemyscore", userdata.room[i].score_p2) //p2의 변경된 점수를 '나'의 점수로 업데이트
                            
                            socket.to(userdata.room[i].id_p1).emit("updateotherscore", userdata.room[i].score_p2);  //p2의 변경된 점수를 '상대'의 점수로 업데이트
                        }
                        
                        // 단어 업데이트
                        UpdateWords(userdata.room, i, j);

                        // 매번 120개의 단어리스트를 검사하면 performance가 너무 많이 먹으니, 이렇게 최적화 할게요
                        if(userdata.room[i].cor_count_p1 + userdata.room[i].cor_count_p2 == userdata.room[i].words.length)
                            GameOver(room.id_p1, room_id.p2, "gotomain");
                        break;
                    }
                }

                if(j == userdata.room[i].words.length){
                    if(socket.id==userdata.room[i].id_p1){
                        userdata.room[i].combo_p1=0;
                    }
                    if(socket.id==userdata.room[i].id_p2){
                        userdata.room[i].combo_p2=0;
                    }
                }

            }
        }
    })
});