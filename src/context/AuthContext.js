import {createContext, useReducer} from 'react'
import useVerifyToken from '../effects/useVerifyToken';
import AuthReducer from './AuthReducer';
const INITIAL_STATE = {
    authenticated: localStorage.getItem("auth") || false, 
    role: localStorage.getItem("role") || ""
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

    return(
        <AuthContext.Provider value={{state, dispatch}}>
            {children}
        </AuthContext.Provider>
    )
}
