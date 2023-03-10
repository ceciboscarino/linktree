import AuthProvider from "../components/authProvider"
import { useNavigate, Link } from "react-router-dom"
import {useState} from "react"
import DashboardWrapper from "../components/dashboardWrapper"
import { v4 as uuidv4 } from "uuid"
import { getLinks, insertNewLink } from "../firebase/firebase"

export default function DashboardView() {
    const navigate = useNavigate()
    const [currentUser, setCurrentUser] = useState({})
    const [state, setState] = useState(0)
    const [title, setTitle] = useState('')
    const [url, setUrl] = useState('')
    const [links, setLinks] = useState([])

    async function handleUserLoggedIn(user){
        setCurrentUser(user)
        setState(2)
        const resLinks = await getLinks(user.uid)
        setLinks([...resLinks])
    }
    function handleUserNotRegistered(user){
        navigate('/login')
    }
    function handleUserNotLoggedIn(){
        navigate('/login')
    }

    if(state === 0){
        return(
            <AuthProvider 
            onUserLoggedIn={handleUserLoggedIn} 
            onUserNotRegistered={handleUserNotRegistered}
            onUserNotLoggeedIn={handleUserNotLoggedIn} 
            >
                Loading
            </AuthProvider>
            )
        }
    
    function handleOnSubmit(e){
        e.preventDefault()
        addLink()
    }

    function addLink(){
        if (title !== '' && url !== ''){
            const newLink = {
                id: uuidv4(),
                title: title,
                url: url,
                uid: currentUser.uid,
            };
            const res = insertNewLink(newLink)
            newLink.docId = res.id;
            setTitle('')
            setUrl('')
            setLinks([... links, newLink])
        }
    }

    function handleOnChange(e){
        const value = e.target.value 
        if (e.target.name === 'title'){
            setTitle(value);
        }else if (e.target.name === 'url' ) {
            setUrl(value);
        }
        
    }


    return (
        <DashboardWrapper> 
            <div>
                <h1>Dashboard</h1>

                <form action="" onSubmit={handleOnSubmit}>
                    <label htmlFor="title">Title</label>
                    <input type="text" name="title" onChange={handleOnChange}/>
                    
                    <label htmlFor="url">Url</label>
                    <input type="text" name="url" onChange={handleOnChange}/>

                    <input type="submit" value="Create new link"/>

                </form>
                <div>
                    {
                        links.map((link) => (
                            <div key={link.id}> <a href={link.url}>{link.title}</a></div>
                        ))
                    }
                </div>
            </div>
        </DashboardWrapper>
    ) 
    
}


