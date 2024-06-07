import axios from '../api/axios';
import useAuth from './useAuth';
import {useNavigate} from "react-router-dom";

const useRefreshToken = () => {
    const { setAuth } = useAuth();
    const navigate = useNavigate();

    const refresh = async () => {
        try {
            const response = await axios.get('/auth/refresh', {
                withCredentials: true
            });
            setAuth(prev => {
                console.log(JSON.stringify(prev));
                return {...prev, accessToken: response.data.accessToken}
            });
            localStorage.setItem('token', response.data.accessToken);
            return response.data.accessToken;
        } catch (error) {
            if (error.response.status !== 200) {
                localStorage.removeItem('token');
                navigate('/login');
                return null;
            }
        }
    }
    return refresh;
};

export default useRefreshToken;
