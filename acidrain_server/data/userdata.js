import * as app from "../app.js";

let waitingList = []; // 유저의 ID와 타수를 저장 
export let socketList = []; // 유저의 소켓 ID를 저장

export function AddPerson(username, level) {
    const _isMatched = Matching(username, level);

    PrintList();
    if (_isMatched) // 매칭된 유저를 대기열에서 삭제함
        return true;
    else// 매칭되지 않았을경우 대기열에 합류함
        return false;
}

function Matching(p_username, p_level) {
    //console.log(`app socket : ${app.socket}`);
    // console.log(`SOCKET : ${socketList[socketList.length-1]}`);
    // 가까운 범위 내의 user가 대기열에 있으면
    for (let i = 0; i < waitingList.length; i++) {
        if (p_level - 50 < waitingList[i].level &&
            p_level + 50 > waitingList[i].level)
        {
            //app.socket.emit("gamestart", "Message");
            console.log(`A : ${socketList[socketList.length - 1]}`);
            console.log(`B : ${socketList[i]}`);
            app.socket.to(socketList[i]).emit("gamestart", "Message");
            app.socket.to(socketList[socketList.length-1]).emit("gamestart", "Message");
            console.log(`BEFORE : ${socketList.length}`);
            waitingList.splice(i, 1); // 해당하는 유저의 정보 삭제
            socketList.splice(i, 1); // 해당하는 유저의 소켓ID 삭제
            socketList.splice(socketList.length-1, 1);
            console.log(`${i}, ${socketList.length-1}`);
            console.log(`W : ${waitingList.length}, S : ${socketList.length}`);
            return true;
        }
    }
    waitingList.push({ username: p_username, level: p_level});     
    app.socket.to(socketList[socketList.length-1]).emit("enter", "Message");
    return false;
}

function PrintList() {
    for(let i = 0;i<waitingList.length;i++)
    {
        console.log(waitingList[i]);
        console.log(socketList[i]);
    }
    console.log("--------------");
}