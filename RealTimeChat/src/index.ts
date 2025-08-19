import { WebSocketServer,WebSocket } from "ws";

const wss= new WebSocketServer({port:8000});

interface User{
    socket:WebSocket;
    room:String;
    userId: String;
}

let allSockets: User[] =[];  

wss.on("connection",(socket)=>{

    socket.on("message",(message)=>{
        //"{"type":"join" ..}"  in websockets here always comes a string first need to change this string object

        //@ts-ignore
        const parsedMessage = JSON.parse(message);   //convert string into object
        if(parsedMessage.type==="join"){
            allSockets.push({
                socket,
                room:parsedMessage.payload.roomId,
                userId:parsedMessage.payload.userId

            })
        }

        
        if(parsedMessage.type === "chat"){
            let currentUserRoom=null;
            //what does this loop inside the traverse whole the array and find this browser who wants to send msg have send join ???
            for(let i=0;i<allSockets.length;i++){
                if(allSockets[i].socket === socket){
                    currentUserRoom=allSockets[i].room;
                }
            }

            //jo msg currentuser se aaya vo sabhi members of this ko send kar do
            for(let i=0;i<allSockets.length;i++){
                if(allSockets[i].room==currentUserRoom){
                    allSockets[i].socket.send(JSON.stringify({
                        message: parsedMessage.payload.message,
                        senderId: parsedMessage.payload.senderId
                    }));
                }
            }
        }
    })
    
});

