import styled from 'styled-components'
import { Avatar, IconButton } from '@mui/material'
import ChatIcon from '@mui/icons-material/Chat'
import UpdateIcon from '@mui/icons-material/Update'
import SearchIcon from '@mui/icons-material/Search'
import CustomMore from '../components/CustomMore'
import { useEffect, useRef, useState } from 'react'
import { collection, getDocs, query, where, onSnapshot } from '@firebase/firestore'
import { db } from '../firebase';
import Friend from './Friend';
import { useAuth } from '../Auth'
import Chat from './Chat'
import Fuse from 'fuse.js'

const Sidebar = () => {
    const [friends, setFriends] = useState([])
    const [chats, setChats] = useState([])
    const [searchFriends, setSearchFriends] = useState(false)
    const inputAreaRef = useRef(null)
    const { currentUser } = useAuth()
    const [input, setInput] = useState('')
    const fuse = new Fuse(friends, { keys: ['email', 'displayName'] })
    const friends_results = fuse.search(input)

    useEffect(() => {
        const chatsRef = collection(db, 'chats')
        const q = query(chatsRef, where('users', 'array-contains', currentUser.uid))
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            setChats(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })))
        })
        return () => {
            unsubscribe
        }
    }, [])

    useEffect(() => {
        async function fetchFriends() {
            const usersRef = collection(db, 'users')
            const q = query(usersRef, where('email', '!=', currentUser?.email))
            const querySnapshot = await getDocs(q)
            setFriends(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })))
        }
        fetchFriends()
    }, [])

    useEffect(() => {
        const checkIfClickedOutside = e => {
            if (!inputAreaRef.current.contains(e.target)) {
                setTimeout(() => {
                    setSearchFriends(false)
                }, 2000)    //without timeout search won't work
            } else {
                setSearchFriends(true)
            }
        }
        document.addEventListener('mousedown', checkIfClickedOutside)
        return () => {
            document.removeEventListener('mousedown', checkIfClickedOutside)
        }
    }, [])
    return (
        <Container>
            <Header>
                <IconButton>
                    <UserAvatar src={currentUser.photoURL} />
                </IconButton>
                <IconGroup>
                    <IconButton>
                        <UpdateIcon />
                    </IconButton>
                    <IconButton>
                        <ChatIcon />
                    </IconButton>
                    <CustomMore />
                </IconGroup>

            </Header>
            <SearchContainer>
                <Search>
                    <SearchIcon />
                    <SearchInput ref={inputAreaRef} placeholder='Search or start a new chat' onChange={e => setInput(e.target.value)} />
                </Search>
            </SearchContainer>
            {searchFriends ? <>
                {friends_results.map(({ item }) => (<Friend key={item.id} photoURL={item.photoURL} displayName={item.displayName} id={item.id} />))}
            </> : <>
                {chats?.map(chat => (<Chat
                    key={chat.id}
                    id={chat.id}
                    users={chat.users}
                    latestMessage={chat.latestMessage}
                    timestamp={chat.timestamp} />))}</>}

        </Container>
    )
}

export default Sidebar

const Container = styled.div`
    background: #fff;
    max-width: 300px;
    height: 100%;
`
const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    background-color: white;
    padding: 0.5em 1em;
    width: 100%;
    border-bottom: 1px solid whitesmoke;
`
const UserAvatar = styled(Avatar)`
    cursor: pointer;
    background-color: lavender;
    
`

const IconGroup = styled.div``
const SearchContainer = styled.div`
    display: grid;
    place-items: center;
    padding: 0.5em 1em;
    background-color: whitesmoke;
    border-bottom: 1px solid whitesmoke;

`
const Search = styled.div`
    background-color: white;
    padding: 0.5em 1em;
    display: flex;
    align-items: center;
    border-radius: 2em;

`
const SearchInput = styled.input`
    border: none;
    outline: none;
    flex: 1;
    margin-left: 1em;
`