import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/api';

// Custom hook for user authentication
export const useAuth = () => {
    const queryClient = useQueryClient();

    // Login mutation
    const loginMutation = useMutation({
        mutationFn: authService.login,
        onSuccess: (data) => {
            if (data.data && data.data.token) {
                // Store token in localStorage
                localStorage.setItem('token', data.data.token);
                // Invalidate and refetch user profile
                queryClient.invalidateQueries({ queryKey: ['user'] });
            }
        },
    });

    // Register mutation
    const registerMutation = useMutation({
        mutationFn: authService.register,
    });

    // Get user profile
    const { data: user, isLoading: isUserLoading } = useQuery({
        queryKey: ['user'],
        queryFn: authService.getProfile,
        enabled: !!localStorage.getItem('token'), // Only fetch if token exists
    });

    // Logout function
    const logout = () => {
        localStorage.removeItem('token');
        queryClient.removeQueries({ queryKey: ['user'] });
    };

    // Check if user is authenticated
    const isAuthenticated = !!localStorage.getItem('token') && !!user?.data;

    return {
        user: user?.data,
        isUserLoading,
        isAuthenticated,
        login: loginMutation.mutate,
        loginLoading: loginMutation.isPending,
        loginError: loginMutation.error,
        register: registerMutation.mutate,
        registerLoading: registerMutation.isPending,
        registerError: registerMutation.error,
        logout,
    };
};
