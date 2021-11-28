import SearchIcon from '@mui/icons-material/Search'
import { Avatar, IconButton } from '@mui/material'
import styled from 'styled-components'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import MicIcon from '@mui/icons-material/Mic'
import Message from './Message'
import { useEffect, useState } from 'react'
import getFriendData from '../utils/getFriendData'
import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from '@firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../Auth'
import moment from 'moment'
import { useRef } from 'react'

const ChatContent = ({ chat, chat_id, messagesProps }) => {
    const [friend, setFriend] = useState({})
    const [messages, setMessages] = useState([])
    const chatParse = JSON.parse(chat)
    const [input, setInput] = useState('')
    const { currentUser } = useAuth()
    const messageEndRef = useRef(null)

    const scrollToBottom = () => {
        messageEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => { scrollToBottom() }, [messages])

    useEffect(() => {
        setMessages(JSON.parse(messagesProps))
    }, [])

    useEffect(() => {
        const messagesRef = collection(db, 'chats', chat_id, 'messages')
        const q = query(messagesRef, orderBy('timestamp', 'asc'))
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            setMessages(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc, timestamp: doc.data().timestamp?.toDate().getTime() })))
        })
        return unsubscribe
    }, [chat_id])

    useEffect(() => {
        if (chatParse.users?.length > 0) {
            getFriendData(chatParse.users).then(data => { setFriend(data) })
        }
        else {
            console.log('no chatparse');
        }
    }, [chat_id])

    const sendMesssage = async (e) => {
        e.preventDefault()
        const usersRef = doc(db, 'users', currentUser.uid)
        setDoc(usersRef, { lastSeen: serverTimestamp() }, { merge: true })

        const messagesRef = collection(db, 'chats', chat_id, 'messages')
        await addDoc(messagesRef, {
            timestamp: serverTimestamp(),
            message: input,
            user: currentUser.email,
            photoURL: currentUser.photoURL
        })

        const chatsRef = doc(db, 'chats', chat_id)
        setDoc(chatsRef, {
            latestMessage: input,
            timestamp: serverTimestamp(),
        }, { merge: true })
        console.log("here");
        setInput('')
    }
    return (
        <Container>
            <Header>
                <Avatar src={friend?.photoURL} />
                <HeaderInfo>
                    <h4>{friend?.displayName}</h4>
                    <p>Last active: {moment(friend?.lastSeen?.toDate()).fromNow()}</p>
                </HeaderInfo>
                <IconButton>
                    <SearchIcon />
                </IconButton>
                <IconButton>
                    <MoreVertIcon />
                </IconButton>
            </Header>

            <MssgContainer>
                {messages.map(message => <Message
                    key={message.id}
                    user={message.user}
                    message={message.message}
                    timestamp={message.timestamp} />)}
                <div style={{ marginBottom: 20 }} ref={messageEndRef} />
            </MssgContainer>

            <InputContainer>
                <IconButton>
                    <EmojiEmotionsIcon color="secondary" />
                </IconButton>
                <IconButton>
                    <AttachFileIcon color="secondary" />
                </IconButton>
                <Input onChange={e => setInput(e.target.value)} placeholder="Type your message..." value={input} />
                <button hidden disabled={!input} type="submit" onClick={sendMesssage}>Send Message</button>
                <IconButton>
                    <MicIcon color="secondary" />
                </IconButton>
            </InputContainer>

        </Container>
    )
}

export default ChatContent

const Container = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100%;
`
const Header = styled.div`
    position: sticky;
    background-color: white;
    z-index: 1000;
    top: 0;
    display: flex;
    padding: 1em;
    align-items: center;
    border-bottom: 1px solid whitesmoke;
`

const HeaderInfo = styled.div`
    margin-left: 1em;
    flex: 1;

    p{
    font-size: 0.9rem;}
`
const MssgContainer = styled.div`
    padding: 1.5em;
    background: linear-gradient(to top, #feac5e, #c779d0, #4bc0c8); 
    /* background-image: url("bgimg.jpg");
    background-repeat: no-repeat;
    background-attachment: fixed; */
    flex: 1;
`

const InputContainer = styled.form`
    display: flex;
    align-items: center;
    padding: 0.5em 1em;
    position: sticky;
    bottom: 0;
    background-color: #f0f0f0;
    z-index: 1000;
`
const Input = styled.input`
    flex: 1;
    outline: none;
    border: none;
    padding: 1em;
    border-radius: 2em;
    margin-inline: 1em;
`