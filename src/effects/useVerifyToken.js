import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import UserService from "../services/UserService";
const useVerifyToken = () => {
    const {_state, dispatch} = useContext(AuthContext);
    useEffect(() => {
        UserService.me().then((response) => {
            dispatch({type: "AUTHENTICATED", payload: {role: response.content.role}});
        }).catch((error) => {
            dispatch({type: "LOGGED_OFF"});
        });
    }, [dispatch]);
}

export default useVerifyToken;