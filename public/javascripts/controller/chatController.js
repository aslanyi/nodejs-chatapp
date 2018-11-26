app.controller('chatController',['$scope','userFactory','chatFactory',($scope,userFactory,chatFactory)=>{


    function init(){
        userFactory.getUser().then(user=>{
            $scope.user = user;
        });
    }

    init();

    $scope.activeTab = 1;
    $scope.roomList=[];
    $scope.onlinelist=[];
    $scope.chatActive = false;
    $scope.chatName = "";
    $scope.message = "";
    $scope.roomId ="";
    $scope.messages = [];
    $scope.user = {};

    const socket = io.connect("http://localhost:3000");
    socket.on('onlinelist',(data)=>{
        $scope.onlinelist = data;
        $scope.$apply();
    });

    socket.on('roomList',(data)=>{
        $scope.roomList = data;
        $scope.$apply();
    });

    socket.on('recieveMessage',(data)=>{
        $scope.messages[data.roomId].push({
            userId : data.userId,
            name:data.name,
            surname:data.surname,
            message:data.message
        });
        $scope.$apply();
    });

    $scope.newMessage=()=>{
        if($scope.message.trim()!==''){
            socket.emit('newMessage',{
                message : $scope.message,
                roomId : $scope.roomId
            });
            $scope.messages[$scope.roomId].push({
                userId : $scope.user._id,
                name:$scope.user.name,
                surname:$scope.user.surname,
                message:$scope.message
            });
            
            $scope.message="";
        }
    };


    $scope.showRoom = (room)=>{
        $scope.chatActive = true;
        $scope.chatName = room.roomName;
        $scope.roomId = room.id;
        if(!$scope.messages.hasOwnProperty(room.id)){
            chatFactory.getMessages(room.id).then(data=>{
                $scope.messages[room.id] = data;
            });
        }
        
           
    };

    $scope.newRoom = ()=>{
        // let randomName = Math.random().toString(36).substring(5);
        let roomName = window.prompt('Enter a room name');
        if(roomName!==null && roomName!==""){
            socket.emit('newRoom',roomName);
        }
   
    };
    $scope.changeTab = tab => {
		$scope.activeTab = tab;
    };
    
}])