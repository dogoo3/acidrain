import React, { useEffect, useRef, useState } from 'react';
//import { socket } from '../../../acidrain_server/app';    //갑자기 이부분 에러난다길래 주석처리함
import "../css/Ingame.css"
let myscore = 0, otherscore = 0;   



const Ingame = ({ acidlogic, socketIO }) => {
    const [words, updateWords] = useState([]); // 단어 갱신시 hook을 통해 리렌더링
    const canvas = useRef(); // 캔버스의 레퍼런스?를 따오는 변수인 듯

    const [timer, updatetimer] = useState(120);

    
    let ctx = null;

    // 소켓 ID는 서버에 한번만 주면 되기 때문에 logic.js에 플래그 변수를 만듬
    if(!acidlogic.GetGameStartFlag())  
    {
        socketIO.EMIT("ingame"); // 페이지 접속 시 소켓 ID를 서버로 전송
        acidlogic.SetGameStart(true); // 서버에 ID를 주면 플래그를 걸음
    }
    
    socketIO.ON("setwords", (p_words) => { // 단어 리스트를 받았을 때
        console.log("setwords");
        updateWords(p_words); // 서버에서 받아온 단어리스트를 hook으로 넘김
    })

    socketIO.ON("updatemyscore", (p_score) => { //변경된 나의 점수를 받았을 때
        console.log("updatemyscore");
        myscore = p_score;
        //useEffect();
    })

    socketIO.ON("gotomain", () => { //게임 종료시 '/'로 이동
        console.log('gotomain')
        if(myscore>otherscore){ //css 잘 모르겠어서 timer에 승패 적어둠, 바꿔야함
            updatetimer('승리!');
        }else if(myscore<otherscore){
            updatetimer('패배');
        }else{
            updatetimer('무승부');
        }
        setTimeout(() =>{
            window.location.href = "/";

        },4000);
        // 나중에는 승리/패배 팝업창을 띄우고, 버튼으로 '/'으로 이동할 수 있게 구현 필요
        
    })

    socketIO.ON("timer", (time) => { 
        console.log('받아온 시간'+timer);
        
        updatetimer(time);
        
    })

    socketIO.ON("updateotherscore", (p_score) => { // 변경된 상대의 점수를 받았을 때
        console.log("updateotherscore");
        otherscore=p_score;
        //useEffect();
    })


    const SendWord = (event) => { // 엔터 키를 눌러서 접속하는 함수
        if (event.key === "Enter")
        {
            let inputValue = document.getElementById("wordinputfield").value;

            // 아무것도 입력하지 않으면 서버로 보내지 않는다
            if (inputValue.length === 0) {
                return;
            }
            for(let i=0;i<inputValue.length;i++)
            {
                if(inputValue[i] === ' ')
                {
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

    console.log('현재 시간'+timer);
    return (
        <div>
            <canvas ref={canvas} id="ingamecanvas" width="1800" height="700"></canvas>
            <h1>남은 시간 : </h1>
            <h1 id="timer">{timer}</h1>
            <div style={{display:"flex", justifyContent:"center"}}> 
                <h1 id="label_myscore">My Score : </h1>
                <h1 id="myscore">{myscore}</h1>
                <input type="text" id="wordinputfield" onKeyPress={SendWord} />
                <h1 id="label_otherscore"> Other Score : </h1>
                <h1 id="otherscore">{otherscore}</h1>            
            </div>
        </div>
    );
}
export default Ingame;