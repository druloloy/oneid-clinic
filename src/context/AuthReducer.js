const states = {
    AUTHENTICATED: {
        authenticated: true,
        role : ""
    },
    LOGGED_OFF: {
        authenticated: false,
        role : ""
    }
}

const AuthReducer = (state, action) => {
    switch (action.type) {
        case "AUTHENTICATED":
            localStorage.setItem("role", action.payload.role);
            localStorage.setItem("auth", true);

            states.AUTHENTICATED.role = action.payload.role;
            return states.AUTHENTICATED;
        case "LOGGED_OFF":
            localStorage.removeItem("role");
            localStorage.setItem("auth", false);

            states.LOGGED_OFF.role = "";
            return states.LOGGED_OFF;
        default:
            return state;
    }
}

export default AuthReducer;