import { doc, serverTimestamp, setDoc } from '@firebase/firestore'
import { useState, useEffect, useContext, createContext } from 'react'
import Loading from './components/Loading'
import { auth, db } from './firebase'
import Login from './pages/login'

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        return auth.onIdTokenChanged(async (user) => {
            if (!user) {
                console.log('No User');
                setCurrentUser(null)
                setLoading(false)
                return
            }
            const token = await user.getIdToken()
            const userData = {
                displayName: user.displayName,
                email: user.email,
                lastSeen: serverTimestamp(),
                photoURL: user.photoURL
            }
            await setDoc(doc(db, 'users', user.uid), userData)
            setCurrentUser(user)
            setLoading(false)
        })

    }, [])
    if (loading) {
        return <Loading />
    }
    if (!currentUser) {
        return <Login />
    }

    else {
        return (
            <AuthContext.Provider
                value={{ currentUser }}>{children}</AuthContext.Provider>
        )
    }
}

export const useAuth = () => useContext(AuthContext)