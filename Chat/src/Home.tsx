import { useEffect, useRef, useState } from 'react'
import  {ChatLogo}  from './Logos/ChatLogo';
import './App.css'
import { useNavigate } from "react-router-dom";
import  Button  from './components/Button';
import  CodeInput  from './components/CodeInput';
import  RoomButton  from './components/RoomButton';
import CopyButton  from './components/CopyButton';


export function Home(){
      const roomRef = useRef<HTMLInputElement>(null);
  const wsRef=useRef<WebSocket | null>(null);
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState<string | null>(null);
  const [username, setUsername] = useState("");  

  const handleClick = () =>{
    const randomId = Math.floor(100000 + Math.random() * 900000).toString();
    setRoomId(randomId);
    
  }

  async function copyto(text:string){
    try{
      await navigator.clipboard.writeText(text);
      console.log("Copy successfully");
    }catch(err){
      console.log("error will copying "+err);
    }
  }
  useEffect(()=>{
    const ws=new WebSocket("ws://localhost:8000");
    wsRef.current=ws;

    return () => {
      ws.close();
    };
    
  },[]);
    return (
         <div className='flex justify-center items-center h-screen bg-black'>
          <div className="m-8 bg-black-200 h-100 w-200 rounded-md  border-1 border-gray-700">
                  <div className='inline-flex pl-6 pt-4'>
                  <div>{<ChatLogo/>}</div>
                  <div className='text-2xl font-medium font-serif text-white p-1'>  Real Time Chat</div>
                  </div>
                  <p className='text-white font-serif pl-12'>temporary room that expires after all users exit</p>
                 <div className='mt-4 flex justify-center'> {<Button onClick={handleClick}/>}</div>
                 <div className='p-5'>
                 <CodeInput label="Username" onChange={(e:any) => setUsername(e.target.value)} />
                 <div className='inline-flex'>

                 
                 {<CodeInput label="Room_ID" ref={roomRef}/>}
                 <div className='mt-5 mr-0 p-0'>
                  { <RoomButton
                onClick={() => {
                  const roomId = roomRef.current?.value
                  if (roomId && username) {
                    wsRef.current?.send(
                      JSON.stringify({
                        type: "join",
                        payload: { roomId,username }, 
                      })
                    )
                    navigate(`/Dashboard/${roomId}`, { state: { username } });
                  }
                }}
              />}
                  </div>
                 </div>
                 </div>

                 {roomId && (
                    <div className='fixed inset-0 backdrop-blur-sm bg-transparent flex items-center justify-center z-50'>
                      <div className='relative  bg-black bg-opacity-50 border-1 border-gray-700 h-80 w-100 rounded-md'>
                       <button className='text-white absolute top-2 right-2 text-2xl cursor-pointer' onClick={() => setRoomId(null)}>
                          
                                &times;
                          </button>
                         <div className='inline-flex pl-6 pt-4'>
                        <div>{<ChatLogo/>}</div>
                            <div className='text-2xl font-medium font-serif text-white p-1'>  Real Time Chat</div>  
                            
                        </div>
                      
                      <div className='flex justify-center items-center flex-col mt-10'>
                        <p className='text-white'>Share this code with your friend</p>
                        <h1 className='text-2xl text-white mt-4'>{roomId}</h1>
                      </div>
                      <div className='flex justify-center items-center mt-10'><CopyButton onClick={() => copyto(roomId?.toString() ?? "")} /></div>
                      </div>
                    </div>
                  )}
          </div>
          
          
    </div>
    )
}