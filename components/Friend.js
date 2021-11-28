import styled from 'styled-components'
import { Avatar } from '@mui/material'
import { useAuth } from '../Auth'
import { db } from '../firebase'
import { addDoc, collection, getDocs, query, where } from '@firebase/firestore'

const Friend = ({ photoURL, displayName, id }) => {
    const { currentUser } = useAuth()
    const createChat = async (id) => {
        console.log('check');
        const chatsRef = collection(db, 'chats')
        const q = query(chatsRef, where('users', 'array-contains', currentUser.uid))
        const querySnapshot = await getDocs(q)
        const chatAlreadyExists = (friend_id) => !!querySnapshot?.docs.find(chat => chat.data().users.find(user => user === friend_id)?.length > 0)
        console.log('create chat')
        if (!chatAlreadyExists(id)) {
            addDoc(chatsRef, { users: [currentUser.uid, id] })
        } else {
            console.log("chat already exists");
        }

    }

    return (
        <Container onClick={() => createChat(id)}>
            <UserAvatar src={photoURL} />
            <ChatGrid>
                <p>{displayName}</p>
            </ChatGrid>
        </Container>
    )
}

export default Friend

const Container = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 0.7em 1em;
    word-break: break-word;
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
    font-size: .9rem;
    padding-block: 0.5em;
    border-bottom: 1px solid lightgray;

`