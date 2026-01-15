import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { CircularProgress, Box } from '@mui/material';
import { useProfileStore } from '@/store/profileStore';

import { MainLayout } from './layout/MainLayout';

const ProtectedRoute = () => {
    const { isAuthenticated } = useAuthStore();
    const { getProfileData, getBalance } = useProfileStore()
    const [isLoading, setIsLoading] = useState(true)
    const location = useLocation();

    useEffect(() => {

        const fetchData = async () => {
            setIsLoading(true)
            await getProfileData()
            await getBalance()
            setIsLoading(false)
        }

        if (isAuthenticated) {
            fetchData()
        }

    }, [isAuthenticated])

    // If not authenticated, redirect to signin with return url
    if (!isAuthenticated) {
        return <Navigate to="/signin" state={{ from: location }} replace />;
    }

    // If still loading, show a loading spinner
    if (isLoading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
            >
                <CircularProgress />
            </Box>
        );
    }

    // If authenticated, render the child routes
    return (
        <MainLayout>
            <Outlet />
        </MainLayout>
    );
};

export default ProtectedRoute;