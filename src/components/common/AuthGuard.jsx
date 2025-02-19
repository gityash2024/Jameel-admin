import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authAPI } from '../../services/api';
import { setUser } from '../../features/auth/authSlice';

const AuthGuard = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      console.log('Token from localStorage:', token);
      
      if (!token) {
        console.log('No token found, redirecting to login');
        navigate('/login');
        return;
      }

      try {
        console.log('Fetching user data...');
        const response = await authAPI.getMe();
        console.log('User data response:', response.data);
        const user = response.data.data.user;
        
        // Store full response in localStorage for debugging
        localStorage.setItem('lastUserResponse', JSON.stringify(response.data));
        
        // Check both role formats
        const isAdmin = Boolean(
          (user.role && typeof user.role === 'object' && user.role.name === 'admin') ||
          (user.role && typeof user.role === 'string' && (
            user.role === '67b5a1037e3966fd9456afca' || 
            user.role === 'admin'
          ))
        );
        
        console.log('Is admin check result:', isAdmin);
        console.log('Role data:', user.role);

        if (!isAdmin) {
          console.log('Not an admin, clearing storage and redirecting');
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }

        console.log('Admin verified, setting user data');
        dispatch(setUser(user));
        setIsLoading(false);
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate, dispatch]);

  if (isLoading) {
    return <div>Loading...</div>; // Add a proper loading component
  }

  return children;
};

export default AuthGuard;