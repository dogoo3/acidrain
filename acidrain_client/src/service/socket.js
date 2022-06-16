import socket from "socket.io-client";

export default class SocketIO {
    constructor(baseURL) {
      this.socket_io = socket(baseURL);
    }

    CheckError()
    {
        console.log("에러 체크 완료");
        this.socket_io.on("connect-error", error => {
            console.log("socket Error", error);
        })
    }

    Test()
    {
        console.log("Socket에서 가져온 함수");
    }

    EMIT(event, message)
    {
        this.socket_io.emit(event, message);
    }

    ON(event, callback)
    {
        this.socket_io.on(event, callback);
    }
  }
  