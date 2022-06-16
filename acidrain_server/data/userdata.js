import * as app from "../app.js";
import * as word from "./worddata.js";

let waitingList = []; // 유저의 ID와 타수를 저장 
export let socketList = []; // 유저의 소켓 ID를 저장

export function AddPerson(username, level) {
    const _isMatched = Matching(username, level);

    PrintList();
    if (_isMatched) // 매칭된 유저를 대기열에서 삭제함
        return true;
    else // 매칭되지 않았을경우 대기열에 합류함
        return false;
}

function Matching(p_username, p_level) {
    // 가까운 범위 내의 user가 대기열에 있으면
    for (let i = 0; i < waitingList.length; i++) {
        if (p_level - 50 < waitingList[i].level &&
            p_level + 50 > waitingList[i].level)
        {
            const worddata = GetWords();
            for(let i=0;i<worddata.length;i++)
                console.log(`${i} : ${worddata[i]}`);
            
            app.socket.to(socketList[i]).emit("gamestart", "Message");
            app.socket.to(socketList[socketList.length-1]).emit("gamestart", "Message");
            waitingList.splice(i, 1); // 해당하는 유저의 정보 삭제
            socketList.splice(i, 1); // 해당하는 유저의 소켓ID 삭제
            socketList.splice(socketList.length-1, 1); // 합류한 유저의 소켓ID 삭제
            return true;
        }
    }
    waitingList.push({ username: p_username, level: p_level});     
    app.socket.to(socketList[socketList.length-1]).emit("enter", "Message"); // 합류한 유저의 URL을 대기열로 옮겨줌
    return false;
}

function GetWords()
{
    let words = [], index = [], count = 0, _flag = false;

    while(count < 120)
    {
        _flag = false;
        // 인덱스를 하나 뽑아낸다
        let _index = Math.floor(Math.random() * word.word.length); 

        // 동일한 인덱스가 있으면 처음으로 돌아간다
        for(let i = 0;i<index.length;i++) 
        {
            if(_index === index[i])
            {
                _flag = true;
                break;
            }
        }
        if(_flag)
            continue;

        words.push(word.word[_index]); // 단어를 넣어준다
        index.push(_index); // 넣은 단어의 인덱스 번호를 넣어준다(중복 검사용)
        count++; // 정상적으로 값 추출시 카운트 1 증가
    }
    return words;
}
function PrintList() {
    for(let i = 0;i<waitingList.length;i++)
    {
        console.log(waitingList[i]);
        console.log(socketList[i]);
    }
    console.log("--------------");
}