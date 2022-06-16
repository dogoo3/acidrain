import React from 'react';
import "../css/Ingame.css"

const Ingame = () => {
    return (
        <div>
            <canvas id="ingamecanvas" width="1024" height="768"></canvas>
            <div>
                <input type="text" id="wordinputfield" />
                <h1>인게임</h1>
            </div>
        </div>
    );
}
export default Ingame;