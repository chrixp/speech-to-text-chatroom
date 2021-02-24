import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { socket } from './socket'

const Message = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 500px;
  height: 500px;
  border: 1px solid black;
`
const SenderImage = styled.img`
  width: 300px;
  object-fit: contain;
`
const App = () => {
  useEffect(() => {
    socket.on('message', (newMessage) => setReceived(newMessage))
    return
  }, [])
  const [id, setId] = useState('')
  const [message, setMessage] = useState('')
  const [received, setReceived] = useState({})
  const sendMessage = () => {
    socket.emit('message', { id, message })
  }

  return (
    <div>
      <div>
        <label>Input your ID</label>
        <input type="text" value={id} onChange={e => setId(e.target.value)}></input>
        <label>Message</label>
        <textarea value={message} onChange={e => setMessage(e.target.value)} />
        <button onClick={sendMessage}>Send</button>
        
      </div>
      <Message>
        {received['imageURI'] && 
          <>
            <SenderImage src={`data:image/png;base64,${received['imageURI']}`} alt="Sender" />
            <h2>{received['name']} sent you a message</h2>
            <h3>{received['message']}</h3>
          </>}
      </Message>
      
    


    </div>
  )
}

export default App