import express from "express";
import "express-async-errors";
import * as waiting from "../data/userdata.js";

const router = express.Router();

router.put('/', (req, res, next) => {
    let {nickname, level} = req.body;
    level *= 1; // 자동 형변환
    const _flag = waiting.AddPerson(nickname, level); // 대기열에 유저를 추가한다
    res.status(200);
})

export default router;