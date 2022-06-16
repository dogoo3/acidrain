import React from 'react';

const Waiting = ({ acidlogic, socketIO }) => {
    console.log(`waiting ID : ${socketIO.id}`);
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