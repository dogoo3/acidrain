import React, { useEffect, useRef, useState } from 'react';
import "../css/Ingame.css"

// const test_words = [
//     "갈무리", "고등어", "나모쥭", "이리듐", "카드뮴", "슭곰발", "해질녘", "돋을별", "사이다", "사기꾼",
//     "무릎팍", "도토리", "강아지", "고양이", "나들목", "로터리", "교차로", "신호등", "공매도", "장마감",
//     "상한가", "하한가", "코스피", "코스닥", "공장장", "압구정", "땅보탬", "바깥말", "오리온", "로스웰",
//     "사미자", "나훈아", "김경호", "갤럭시", "아이폰", "코이즈", "마우스", "키보드", "모니터", "신도림",
//     "핸드폰", "오지랖", "고사리", "고스트", "고추장", "곰탱이", "구렁이", "지렁이", "수술실", "공격력",
//     "방어력", "네이비", "그레이", "귀공자", "글로리", "경마장", "꽃바람", "꾸띠르", "꿀단지", "꼬맹이",
//     "까마귀", "나이키", "논스톱", "늴리리", "닌텐도", "웨하스", "포카칩", "달변가", "댄싱퀸", "담채화",
//     "덴티티", "데자뷰", "들레꽃", "딸바보", "레퀴엠", "록펠러", "루시드", "마틸다", "마카오", "메소드",
//     "무지개", "미란다", "물수건", "밀라노", "빠삐용", "삐에로", "뽀로로", "뿜빠이", "블랙잭", "바루스",
//     "빌리진", "사령관", "상하이", "삼겹살", "쌍꺼풀", "세라핌", "소나무", "손세탁", "스텔라", "쓰레기",
//     "싸인회", "아리수", "애니멀", "엽록소", "옵저버", "와일드", "오스카", "유리창", "윈도우", "리눅스",
//     "유닉스", "은메달", "내린천", "인디언", "인물값", "인셉션", "인터넷", "일관성", "이벤트", "의형제"
// ];

const Ingame = ({ acidlogic, socketIO }) => {
    const [words, updateWords] = useState([]);
    const canvas = useRef();

    let myscore = 0, otherscore = 0;
    let ctx = null;

    if(!acidlogic.GetGameStartFlag())
    {
        socketIO.EMIT("ingame"); // 페이지 접속 시 소켓 ID를 서버로 전송
        acidlogic.SetGameStart(true);
    }
    
    socketIO.ON("setwords", (p_words) => { // 단어 리스트를 받았을 때
        console.log(p_words[0]);
        updateWords(p_words);
    })
    const SendWord = (event) => { // 엔터 키를 눌러서 접속하는 함수
        if (event.key === "Enter")
        {
            socketIO.EMIT("sendword", document.getElementById("wordinputfield").value);
        }
    };

    const writeWords = () => {
        let x = 0, y = 0;

        for (let i = 0; i < 120; i++) {
            if (i % 12 === 0) { // 한 줄에 12개씩 단어를 작성
                x = 50;
                y += 80;
            }
            ctx.fillText(words[i], x + 25, y + -50);
            x += 150;
        }
    }

    useEffect(() => {
        const canvasEle = canvas.current;
        canvasEle.width = canvasEle.clientWidth;
        canvasEle.height = canvasEle.clientHeight;
        ctx = canvasEle.getContext("2d");
        ctx.font = "30px gothic";
        ctx.textAlign = "center";

        writeWords();
    });
    return (
        <div>
            <canvas ref={canvas} id="ingamecanvas" width="1800" height="800"></canvas>
            <div style={{display:"flex", justifyContent:"center"}}>
                <h1 id="myscore">{myscore}</h1>
                <input type="text" id="wordinputfield" onKeyPress={SendWord} />
                <h1 id="otherscore">{otherscore}</h1>            
            </div>
        </div>
    );
}
export default Ingame;