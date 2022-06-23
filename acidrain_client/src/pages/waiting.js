import React from 'react';

const Waiting = ({ acidlogic, socketIO }) => {
    socketIO.ON("gamestart", () => {
        window.location.href = "/ingame";
    })
    return (
        <div>
            <h1>대기중...</h1>
        </div>
    );
}
export default Waiting;