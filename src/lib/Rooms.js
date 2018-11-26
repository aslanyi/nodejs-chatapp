const redisClient = require('../redisClient');
const shortid = require('shortid');
 function Rooms() {
	this.client = redisClient.getClient();
}
 module.exports = new Rooms();

 Rooms.prototype.upsert = function (roomName) {
    const id = shortid.generate();
    this.client.hset(
		"rooms",
		'@Room'+id,
        JSON.stringify({
            id :'@Room'+id,
			roomName,
			when: Date.now()
		}),err=>{
            console.log(err);
        }
	)
}
Rooms.prototype.list = function(callback){
    let roomList = [];
    this.client.hgetall("rooms",function(err,rooms){
        if(err){
            console.error(err);
           return callback([]);
        }
        for(let room in rooms){
            roomList.push(JSON.parse(rooms[room]));
        }
        return callback(roomList);    
    });
}