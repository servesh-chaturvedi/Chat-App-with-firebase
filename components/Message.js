import moment from 'moment'
import styled from 'styled-components'
import { useAuth } from '../Auth'

const Message = ({ user, message, timestamp }) => {
    const { currentUser } = useAuth()
    const loginMail = currentUser.email
    const MssgType = user === loginMail ? MyMssg : FrndMssg
    return (
        <Container>
            <MssgType>{message}
                <Timestamp>{moment(timestamp).format('LT')}</Timestamp></MssgType>
        </Container>
    )
}

export default Message

const Container = styled.div`
    display: flex;
`

const MssgBubble = styled.div`
    padding: 0.5em 0.5em 1.2em 0.5em;
    font-size: 0.9rem;
    text-align: right;
    background-color: azure;
    margin-bottom: 0.5em;
    min-width: 3.5em;
    position: relative;
`

const MyMssg = styled(MssgBubble)`
    --bgColor: #7cffcb;
    margin-left: auto;
    background-color: var(--bgColor);
    background-image: linear-gradient(315deg, #7cffcb 0%, #74f2ce 74%);
    border-radius: 0.5em 0 0.5em 0.5em;
    ::after{
        content: "";
        position: absolute;
        top: 0;
        left: 99%;
        border: 0.5rem solid;
        border-color: var(--bgColor) transparent transparent var(--bgColor);
    }
`

const FrndMssg = styled(MssgBubble)`
    --bgColor: azure;
    text-align: left;
    border-radius: 0 0.5em 0.5em 0.5em;
    ::after{
        content: "";
        position: absolute;
        top: 0;
        right: 99%;
        border: 0.5rem solid;
        border-color: var(--bgColor) var(--bgColor) transparent transparent ;
    }
`
const Timestamp = styled.span`
    color: gray;
    font-size: 0.6rem;
    text-align: right;
    position: absolute;
    bottom: 0;
    right: 0;
    padding: 0.2em 0.5em;
`