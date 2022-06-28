import React from 'react';

const Waiting = ({ acidlogic, socketIO }) => {
    socketIO.ONCE("gamestart", () => {
        window.location.href = "/ingame";
    })
    return (
        <div>
            <h1>대기중...</h1>
        </div>
    );
}
export default Waiting;