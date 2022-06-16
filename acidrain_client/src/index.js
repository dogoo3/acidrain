import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import HttpClient from "./http/http";
import AcidLogic from "./service/logic";
import SocketIO from "./service/socket";

// const baseURL = process.env.REACT_APP_BASE_URL;
const httpClient = new HttpClient("http://localhost:7000");
const acidlogic = new AcidLogic(httpClient);
const socketIO = new SocketIO("http://localhost:7000");

socketIO.CheckError();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //<React.StrictMode>
    <App acidlogic={acidlogic} socketIO={socketIO}/>
  //</React.StrictMode>
);
