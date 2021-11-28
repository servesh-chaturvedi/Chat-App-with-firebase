import Head from 'next/head'
import styled from "styled-components"
import Button from '@mui/material/Button'
import GoogleIcon from '@mui/icons-material/Google'
import { auth, provider } from '../firebase'
import { signInWithPopup } from '@firebase/auth'

const login = () => {
    const loginWithGoogle = () => {
        signInWithPopup(auth, provider)
    }
    return (
        <Container>
            <Head>
                <title>Login</title>
            </Head>
            <LoginContainer>
                <Logo src='https://freepngimg.com/thumb/logo/70086-logo-whatsapp-computer-viber-icons-free-download-image.png' />

                <Button color='secondary' variant='outlined' startIcon={<GoogleIcon />} onClick={loginWithGoogle}>Sign In with Google</Button>
            </LoginContainer>

        </Container>
    )
}

export default login

const Container = styled.div`
    display: grid;
    place-items: center;
    height: 100vh;
    background-color: orchid;
    background-image: linear-gradient(315deg, #4c4177 0%, #2a5470 74%);
    width: 100vw;
`
const LoginContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 3em;
    background-color: white;
    border-radius: 1rem;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
`
const Logo = styled.img`
    width: 100px;
    aspect-ratio: 1;
    margin-bottom: 2em;
`