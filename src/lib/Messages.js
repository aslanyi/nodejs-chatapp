const redisClient = require('../redisClient');
const shortId = require('shortid');
const _ = require('lodash');

 function Messages() {
	this.client = redisClient.getClient();
}
 module.exports = new Messages();

 Messages.prototype.upsert = function ({roomId,message,userId,name,surname}) {
     const id = shortId.generate();
    this.client.hset(
		'message:'+roomId,
	    id,
        JSON.stringify({
            userId,
            name,
            surname,
            message,
			when: Date.now()
		}),err=>{
            console.log(err);
        }
	)
}

Messages.prototype.list = function(roomId,callback){
    let messagesList = [];
    this.client.hgetall("message:"+roomId,function(err,messages){
        if(err){
            console.error(err);
           return callback([]);
        }
        for(let message in messages){
            messagesList.push(JSON.parse(messages[message]));
        }
        return callback(_.orderBy(messagesList,'when','asc'));    
    });
}