import { useEffect, useRef, useState } from "react";
import { ChatLogo } from "../Logos/ChatLogo";

import { useParams, useLocation } from "react-router-dom";

export function Dashboard(){
    const { roomId } = useParams();
    const location = useLocation();
    const username = (location.state as { username?: string })?.username || "Anonymous";
    
    const inputRef=useRef<HTMLInputElement>(null);
    const wsRef=useRef<WebSocket | null>(null);
    type ChatMsg = { senderId: string; message: string };
    const [messages, setMessages] = useState<(string | ChatMsg)[]>(["Welcome!"]);

      useEffect(() => {
      const ws = new WebSocket("ws://localhost:8000");
      ws.onopen = () => {
        ws.send(JSON.stringify({
          type: "join",
          payload: { roomId, senderId: username },
        }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === "chat" && data.payload) {
            setMessages((m) => [...m, {
              senderId: data.payload.senderId,
              message: data.payload.message
            }]);
          } else if (data.senderId && data.message) {
            // already flat object
            setMessages((m) => [...m, data]);
          } else {
            setMessages((m) => [...m, String(event.data)]);
          }
        } catch {
          setMessages((m) => [...m, String(event.data)]);
        }
    };



  wsRef.current = ws;

  return () => ws.close();
}, [roomId]);  //  run only once when roomId changes

    return(
    <div className='h-screen bg-black flex justify-center'>
        <div className=" w-1/2 mt-6 mb-6 border-gray-700 border-2">
        <div className=" flex items-center pt-2 pl-4 relative">
          
        {<ChatLogo/>}
        <p className="text-2xl pl-2 text-white  font-medium font-serif">Real Time Chat</p>
        <p className="text-white pl-10 absolute text-2xl font-serif top-2 right-2 pr-2">{roomId}</p>
        </div>
        <p className="text-white pl-4 pt-1 font-serif">temporary room that expires after all users exit</p>
     <div className='h-[65vh] mt-4 mb-6 ml-2 mr-2 border-2 border-gray-700 flex flex-col overflow-y-auto'>

           {messages.map((msg, idx) => {
            if (typeof msg === "string") {
              return (
                <div key={idx} className="m-4 font-serif text-gray-400">
                  {msg}
                </div>
              );
            }

        // msg is ChatMsg here
        const isMe = msg.senderId === username;
    return (
          <div
          key={idx}
          className={`w-full flex my-2 ${isMe ? "justify-end pr-4" : "justify-start pl-4"}`}
          >
          <div
            className={`px-3 py-2 rounded-2xl max-w-[70%] break-words ${
              isMe ? "bg-purple-600 text-white" : "bg-gray-700 text-white"
            }`}
          >
            {!isMe && (
              <p className="text-xs font-serif text-gray-300 mb-1">{msg.senderId}</p>
            )}
            <p>{msg.message}</p>
          </div>
      </div>
        );
      })}


      </div>

      <div className='w-full flex p-4'>
        <input ref={inputRef} type="text" className='flex-1  border-2 border-gray-700 text-white' ></input>
        <button onClick={()=>{
          const message=inputRef.current?.value;
          wsRef.current?.send(JSON.stringify({
            type:"chat",
            payload:{
              roomId, 
              senderId: username,
              message:message
            }
          }))
          if(inputRef.current){
            inputRef.current.value="";
          }
          
          
        }}
        className='bg-purple-600 text-white p-4 cursor-pointer'>Send Message</button>
      </div>
      </div>
    </div>
    )
}