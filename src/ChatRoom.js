import React, { useState, useEffect, useCallback } from 'react';
import { useBeforeunload } from 'react-beforeunload'
import VoiceRecorder from './voiceRecorder'
import ErrorModal from './errorModal'
import styled from 'styled-components'
import { socket } from './socket'
import faker from 'faker'

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
`
const ConversationBox = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    margin: 1em;
    padding: 1em;
    border: 1px solid black;
`

const MessageContainer = styled.div`
    display: flex;  
    flex-direction: row;
    align-items: center;
    margin: 0.1em;
`

const Username = styled.span`
    margin: 0.2em;
    font-weight: bold;
`

const BigLabel = styled(Username)`
    font-size: 2em;
`

const BigUserName = styled.span`
    font-size: 3em;
`


const Notification = styled.span`
    margin: 0.2em;
    font-weight: bold;
    color: ${props => props.color};
`

const OnlineUser = styled.span`
    margin: 0;
    margin-left: 0.5em;
`
const OnlineCircle = styled.span`
    height: 25px;
    width: 25px;
    border-radius: 50%;
    background-color: #7CFC00;
`
const ConversationItem = (props) => {
    return (
        props.notification ? 
            <Notification color={props.color}>{props.message}</Notification> : 
            <MessageContainer>
                <Username>{props.username}: </Username>
                <span>{props.message}</span>
            </MessageContainer>
    )
}

const OnlineUsers = (props) => (
    <ConversationBox>
        <Notification color={"black"}>Online users:</Notification>
        {props.users && props.users.map(user => <MessageContainer>
            <OnlineCircle />
            <OnlineUser>{user}</OnlineUser>
        </MessageContainer>)}   
    </ConversationBox>
)

function App() {
    const [username] = useState(faker.internet.userName())
    const [members, setMembers] = useState([])
    const [error, setError] = useState(null)
    const [conversation, setConversation] = useState([]);
    
    const disconnect  = useCallback(() => {
        socket.emit('leaveroom', username)
        socket.disconnect()
    }, [username])

    useBeforeunload(() => disconnect())

    useEffect(() => {
      socket.emit('enterroom',username)
      socket.on('message',(newMessage) => setConversation(convo => [...convo,newMessage]))
      socket.on('memberReset',(members) => setMembers(members))
      socket.on('conversionError',(err) => showAudioError(err))

      return disconnect
    },[disconnect, username]);

    const upload = (audio) => {
        if(audio) {
            socket.emit("audioMessage",{ username, audio })
        } else {
            showAudioError("empty")
        }
    }

    const showAudioError = (details="invalid") => {
        setError(`The audio you uploaded is ${details}. Please record again and reupload`)
    }
  
    return (
      <Container>
        <ErrorModal error={error} close={() => setError(null)}/>
        <BigLabel>Your username:</BigLabel>
        <BigUserName>{username}</BigUserName>
        <VoiceRecorder upload={(file) => upload(file)} />
        <OnlineUsers users={members} />
        <BigLabel>Senior Design Speech-To-Voice Live Chat</BigLabel>
        <ConversationBox>
            {conversation.map(item => <ConversationItem key={item.message} {...item} />)}
        </ConversationBox>
      </Container>
    );
  }
  
export default App;
