const express = require('express');
const router = express.Router();

//libs
const Message = require('../src/lib/Messages');

router.get('/list',(req,res,next)=>{
    Message.list(req.query.roomId,(messages)=>{
        res.send(messages);
    });
});

module.exports = router;