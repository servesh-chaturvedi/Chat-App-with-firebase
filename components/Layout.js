import styled from 'styled-components'
import Sidebar from './Sidebar'

const Layout = ({ children }) => {
    return (
        <Wrapper>
            <Container>
                <Sidebar />
                {children}

            </Container>
        </Wrapper>
    )
}

export default Layout

const Wrapper = styled.div`
    display: grid;
    place-items: center;
`
const Container = styled.div`
    display: flex;
    width: 80%;
    height: 95vh;
    margin-block: 1em;
    box-shadow: 0px 10px 15px -3px rgba(0,0,0,0.1);

    @media (max-width: 700px){ 
        width: 100%;
        height: 100vh;
        margin: 0;
    }
`
