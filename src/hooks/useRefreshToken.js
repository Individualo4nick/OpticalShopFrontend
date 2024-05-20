import axios from '../api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await axios.get('/auth/refresh', {
            withCredentials: true
        });
        setAuth(prev => {
            console.log(JSON.stringify(prev));
            return { ...prev, accessToken: response.data.accessToken }
        });
        localStorage.setItem('token', response.data.accessToken);
        // if (response.status !== 200) {
        //     localStorage.removeItem('token');
        //     return response.data.accessToken;
        // } else {
        //     localStorage.setItem('token', response.data.accessToken);
        //     return null;
        // }
        return response.data.accessToken;
    }
    return refresh;
};

export default useRefreshToken;
