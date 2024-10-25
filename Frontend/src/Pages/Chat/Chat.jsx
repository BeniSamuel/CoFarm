import React from 'react'
import ChatLeftNav from '../../Components/ChatLeftNav/ChatLeftNav'
import ChatMessage from '../../Components/ChatMessage/ChatMessage'
import ProfileChat from '../../Components/ProfileChat/ProfileChat'

const Chat = () => {
  return (
    <div className=' flex flex-row'>
        <ChatLeftNav/>
        <ChatMessage/>
        <ProfileChat/>
    </div>
  )
}

export default Chat