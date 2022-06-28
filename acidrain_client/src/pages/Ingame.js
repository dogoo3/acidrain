import React, { useEffect, useRef, useState } from 'react';
import "../css/Ingame.css";
import Popup from "../service/resultpopup";

let myscore = 0, otherscore = 0;
let isGameOver = false;
const Ingame = ({ acidlogic, socketIO }) => {
    const [words, updateWords] = useState([]); // 단어 갱신시 hook을 통해 리렌더링
    const canvas = useRef(); // 캔버스의 레퍼런스?를 따오는 변수인 듯

    const [timer, updatetimer] = useState(120);

    // 팝업창과 관련한 useState
    const [popupOpen_win, winPopupOpen] = useState(false);
    const [popupOpen_lose, losePopupOpen] = useState(false);
    const [popupOpen_draw, drawPopupOpen] = useState(false);
    const [popupOpen_disconnection, disconnectionPopupOpen] = useState(false);
    
    // 플레이어의 점수 차이에 따른 색깔과 관련한 useState
    const [myColor, setMyColor] = useState({color: "black"});
    const [anotherColor, setanotherColor] = useState({color: "black"});
    
    const openWinPopup = () => {
        winPopupOpen(true);
    }
    const closeWinPopup = () => {
        window.location.href = '/';
        winPopupOpen(false);
    }

    const openLosePopup = () => {
        losePopupOpen(true);
    }
    const closeLosePopup = () => {
        window.location.href = '/';
        losePopupOpen(false);
    }

    const openDrawPopup = () => {
        drawPopupOpen(true);
    }
    const closeDrawPopup = () => {
        window.location.href = '/';
        drawPopupOpen(false);
    }

    const openDisconnectPopup = () => {
        disconnectionPopupOpen(true);
    }
    const closeDisconnectionPopup = () => {
        window.location.href = '/';
        disconnectionPopupOpen(false);
    }

    let ctx = null;

    // 소켓 ID는 서버에 한번만 주면 되기 때문에 logic.js에 플래그 변수를 만듬
    if (!acidlogic.GetGameStartFlag()) {
        socketIO.EMIT("ingame"); // 페이지 접속 시 소켓 ID를 서버로 전송
        acidlogic.SetGameStart(true); // 서버에 ID를 주면 플래그를 걸음
    }

    socketIO.ONCE("setwords", (p_words) => { // 단어 리스트를 받았을 때
        console.log("setwords");
        updateWords(p_words); // 서버에서 받아온 단어리스트를 hook으로 넘김
    })

    socketIO.ONCE("updatemyscore", (p_score) => { //변경된 나의 점수를 받았을 때
        console.log("updatemyscore");
        myscore = p_score;
        if(myscore > otherscore)
        {
            setMyColor({color: "red"});
            setanotherColor({color: "blue"});
        }
        else if(myscore == otherscore)
        {
            setMyColor({color: "black"});
            setanotherColor({color: "black"});
        }    
        //useEffect();
    })

    socketIO.ONCE("updateotherscore", (p_score) => { // 변경된 상대의 점수를 받았을 때
        console.log("updateotherscore");
        otherscore = p_score;
        
        if(otherscore > myscore)
        {
            setMyColor({color: "blue"});
            setanotherColor({color: "red"});
        }
        else if(otherscore == myscore)
        {
            setMyColor({color: "black"});
            setanotherColor({color: "black"});
        }    
        //useEffect();
    })

    socketIO.ONCE("disconnection", () => {
        openDisconnectPopup();
        isGameOver = true;
        updatetimer('게임종료!');
    })

    socketIO.ONCE("gotomain", () => { //게임 종료시 '/'로 이동
        console.log('gotomain')
        isGameOver = true;
        if (myscore > otherscore) { //css 잘 모르겠어서 timer에 승패 적어둠, 바꿔야함
            openWinPopup();
        } else if (myscore < otherscore) {
            openLosePopup();
        } else {
            openDrawPopup();
        }
        
        updatetimer('게임종료!');
    })

    socketIO.ONCE("timer", (time) => {
        socketIO.EMIT("delay", '');

        updatetimer(`남은 시간 : ${time}`);
    })


    const SendWord = (event) => { // 엔터 키를 눌러서 접속하는 함수
        if (event.key === "Enter" && !isGameOver) {
            let inputValue = document.getElementById("wordinputfield").value;

            // 아무것도 입력하지 않으면 서버로 보내지 않는다
            if (inputValue.length === 0) {
                return;
            }
            for (let i = 0; i < inputValue.length; i++) {
                if (inputValue[i] === ' ') {
                    document.getElementById("wordinputfield").value = ''; //단어 입력창 공백으로
                    return;
                }
            }
            socketIO.EMIT("sendword", inputValue);
            document.getElementById("wordinputfield").value = ''; //단어 입력창 공백으로
        }
    };

    const writeWords = () => {
        let x = 0, y = 0;

        for (let i = 0; i < 120; i++) {
            if (i % 12 === 0) { // 한 줄에 12개씩 단어를 작성
                x = 50; // 1열의 위치(좌표값)로 복귀
                y += 70; // 1행 내려줌
            }
            ctx.fillText(words[i], x + 25, y - 40); // 글씨를 쓴 뒤
            x += 150; // 1열 옮겨줌
        }
    }

    useEffect(() => {
        // 텍스트 작성을 위한 사전작업임
        const canvasEle = canvas.current;
        canvasEle.width = canvasEle.clientWidth;
        canvasEle.height = canvasEle.clientHeight;
        ctx = canvasEle.getContext("2d");
        ctx.font = "30px gothic";
        ctx.textAlign = "center";

        writeWords();
    });

    console.log('현재 시간' + timer);
    return (
        <div>
            <canvas ref={canvas} id="ingamecanvas" width="1800" height="700"></canvas>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <h1 id="label_myscore" style={myColor}>My Score : {myscore}</h1>
                <h1 id="label_timer">{timer}</h1>
                <h1 id="label_otherscore" style={anotherColor}> Other Score : {otherscore}</h1>

            </div>
            <Popup
                open={popupOpen_win} close={closeWinPopup} header="게임 결과">
                축하합니다! 승리하셨습니다!
            </Popup>
            <Popup
                open={popupOpen_lose} close={closeLosePopup} header="게임 결과">
                아쉽습니다! 패배하셨습니다!
            </Popup>
            <Popup
                open={popupOpen_draw} close={closeDrawPopup} header="게임 결과">
                무승부입니다!
            </Popup>
            <Popup
                open={popupOpen_disconnection} close={closeDisconnectionPopup} header="게임 결과">
                상대방의 접속이 끊겼습니다!
            </Popup>
            <input type="text" id="wordinputfield" onKeyPress={SendWord} />
        </div>

    );
}
export default Ingame;