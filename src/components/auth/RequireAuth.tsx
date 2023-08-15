// RequireAuth.js
import { useLocation, Navigate } from 'react-router-dom';
import { useAuthenticator } from '@aws-amplify/ui-react';

export function RequireAuth({ children }: any) {
    
    const location = useLocation();
    const { authStatus } = useAuthenticator((context) => [context.authStatus]);

    switch (authStatus) {
        case 'authenticated':
            return children
        case 'unauthenticated':
            return <Navigate to="/signin" state={{ from: location }} replace />;
        default:
            return 'loading'
    }
}