import {createContext, useState} from "react";
import {jwtDecode} from "jwt-decode";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        var token = localStorage.getItem('token');
        if (token !== null && token !== undefined) {
            const roleFromToken = jwtDecode(token).role;
            let roles = [];
            switch (roleFromToken){
                case 'ADMIN':
                    roles.push(5150);
                    break;
                case 'USER':
                    roles.push(2001);
                    break;
                default:
                    roles = [0];
            }
            return{ roles, token };
        }
        return {};
    });
    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;