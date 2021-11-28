import styled from 'styled-components'
import { Avatar } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import getFriendData from '../utils/getFriendData'
import moment from 'moment'

const Chat = ({ id, users, timestamp = '', latestMessage = '' }) => {
    const router = useRouter()
    const enterChat = () => { router.push(`/chat/${id}`) }
    const [friend, setFriend] = useState({})
    useEffect(() => {
        if (users.length > 0) {
            getFriendData(users).then((data) => { setFriend(data) })
        }
    }, [])
    return (
        <Container onClick={enterChat}>
            <UserAvatar src={friend?.photoURL} />
            <ChatGrid>
                <p>{friend?.displayName?.length > 10 ? `${friend?.displayName.slice(0, 10)}...` : friend?.displayName}</p>
                <p>{timestamp ? moment(timestamp?.toDate()).format('LT') : ''}</p>
                <p>{latestMessage.slice(0, 15)}</p>
                <p>Icon</p>
            </ChatGrid>

        </Container>
    )
}

export default Chat

const Container = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 0.7em 1em;
    max-width: 100%;
    position: relative;
    
    :hover{
        background-color: #f9f9f9;
    }

`

const UserAvatar = styled(Avatar)`
    cursor: pointer;
    background-color: lavender;
    
`

const ChatGrid = styled.div`
    flex:1;
    margin-left: 1em;
    display: grid;
    align-items: center;
    grid-template-columns: 2fr 1fr;
    grid-template-rows: 1fr 1fr;
    color: gray;
    font-size: .9rem;
    padding-bottom: 0.5em;
    border-bottom: 1px solid lightgray;

    p:nth-of-type(even){
        text-align: right;
    }
    p:nth-child(1){
        color: black;
        font-size: 1.02rem;
    }
`