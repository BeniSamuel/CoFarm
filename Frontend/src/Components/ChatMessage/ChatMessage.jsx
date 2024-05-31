import { useState } from 'react'
import React from 'react'
import button from '../../assets/chat-button.png'

const ChatMessage = () => {
  const [message,setMessage]=useState("");
  return (
    <div className=' w-3/6'>
      <div>
        Chat
      </div>
      <div className=' relative top-[31rem] flex flex-row'>
        <input type="text" placeholder='Type a message...' className=' bg-[#83DF75] h-14 w-[36rem] relative left-7 placeholder-black pl-5 rounded-xl border-4 border-[#184B05]' onChange={(e)=>{setMessage(e.target.value)}} />
        <img src={button} className=' absolute top-3 left-[35rem] h-7 w-7' onClick={()=>{ alert(message)}} />
      </div>
    </div>
  )
}

export default ChatMessage