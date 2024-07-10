import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AuthState } from '@/store/auth';

export function useAuth(): void {
    const navigate = useNavigate();
    const isAuth = useSelector((state: { auth: AuthState }) => state.auth.token !== null);

    useEffect(() => {
        if (!isAuth) {
            navigate('/login');
        }
    }, [navigate, isAuth]);
}