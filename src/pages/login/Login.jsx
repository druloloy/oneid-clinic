import React,{useState, useContext} from 'react'
import './login.scss'
import {Link} from 'react-router-dom'
import UserService from '../../services/UserService'
import { AuthContext } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const {_, dispatch} = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const login = (e) => {
        e.preventDefault();
        UserService.loginUser(username, password).then(data => {
            dispatch({
                type: 'AUTHENTICATED',
                payload: {
                    role: data.content.role,
                }
            });
            navigate('/staff');
        })
    }

  return (
    <div className="login-form">
        <div className="top">
            <div className="logo">
                <img src="./images/compressed/oneid_256x256.png" alt="" className='imgLogo'/>
            </div>
        </div>
        <div className="inputs-container">
            <form className="inputs" onSubmit={login}>
                <input type="username" className="user" onChange={e=>setUsername(e.target.value)} placeholder="Username"/>
                <input type="password" className="pass" onChange={e=>setPassword(e.target.value)} placeholder="Password" />
                <input type="submit" className="login-btn" value={"sign in"}/>
            </form>
        </div>
    </div>
  )
}
export default Login