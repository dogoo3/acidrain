export default class AcidService {
    constructor(http) {
        this.http = http;
        this.gamestart = false;
        console.log(this.http);
    }

    async Join(p_nickname, p_level, p_socket) {
        p_socket.EMIT("enter", "Message");
        return this.http.fetch('/request', {
            method: "PUT",
            body:JSON.stringify({nickname:p_nickname, level:p_level})
        });
    }

    SetGameStart(_flag)
    {
        this.gamestart = _flag;
    }

    GetGameStartFlag()
    {
        return this.gamestart;
    }
}