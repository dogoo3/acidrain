import React from 'react';
import "../css/InputMyLevel.css"

const InputMyLevel = ({ acidlogic, socketIO }) => {
    socketIO.ON("enter", () => {
        window.location.href = "/waiting";
    });
    socketIO.ON("gamestart", () => {
        window.location.href = "/ingame";
    })
    const Join = () => { // 버튼을 클릭해서 접속하는 함수
        const nickname = document.getElementById("nickname").value;
        const score = document.getElementById("score").value;
        let flag = true;
        for (let i = 0; i < nickname.length; i++) {
            if (nickname[i] === ' ') // 닉네임에 공백이 있으면 대기열 참가 불가능
            {
                flag = false;
                break;
            }
        }
        if (flag)
            acidlogic.Join(nickname, score, socketIO);
    };

    const PressEnter = (event) => { // 엔터 키를 눌러서 접속하는 함수
        if (event.key === "Enter")
            Join();
    };
    return (
        <div>
            <h1>당신의 정보를 입력하세요!</h1>
            <div>
                닉네임 :
                <input id="nickname" className="inputlevel"></input>
            </div>
            <div>
                타자 수 :
                <input id="score" type="number" onKeyPress={PressEnter} className="inputlevel"></input>
            </div>

            <div>
                <button className="access" onClick={Join}>대기열 접속</button>
            </div>
        </div>
    );
}
export default InputMyLevel;