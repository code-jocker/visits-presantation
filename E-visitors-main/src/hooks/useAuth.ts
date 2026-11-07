import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi, type AuthResponse } from '../api/auth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { tokenManager } from '../lib/auth';

export function useAuth() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const loginMutation = useMutation({
        mutationFn: async (credentials: { email: string; password: string; phone?: string }) => {
            const response = await authApi.login({
                email: credentials.email,
                password: credentials.password,
                phone: credentials.phone
            });
            return response;
        },
        onSuccess: (data: AuthResponse) => {
            if (data?.result?.accessToken) {
                tokenManager.saveToken(data.result.accessToken, true);
            }
            
            // Determine the redirect path based on user role
            const user = data?.result?.user;
            const roleType = user?.roleType;
            const firstRole = user?.roles?.[0]?.name;
            
            // Determine dashboard path
            let dashboardPath = '/dashboard';
            if (roleType === 'owner') {
                dashboardPath = '/dashboard';
            } else if (firstRole) {
                // Map role names to their dashboard paths
                const rolePathMap: Record<string, string> = {
                    'helpdesk': '/dashboard/helpdesk',
                    'data_manager': '/dashboard/dataManager',
                    'team_leader': '/dashboard/teamLeader',
                    'staff': '/dashboard/staff',
                    'system_office': '/dashboard/systemOffice',
                    'human_resource': '/dashboard/humanResource',
                    'protocals': '/dashboard/protocals',
                    'check_point': '/dashboard/checkPoint',
                };
                dashboardPath = rolePathMap[firstRole] || '/dashboard';
            }
            
            navigate(dashboardPath);
        },

        onError: (error: any) => {
            console.log('LOGIN ERROR:', error);
            const startTime = Date.now();
            const errorMessage = error?.response?.data?.message || error?.message || 'Login failed';
            
            if(error?.response?.data?.message){
                errorMessage
            };

            // handle specific error
            if (errorMessage?.toLowerCase().includes('verification') || errorMessage?.toLowerCase().includes('approval')) {
                navigate('/auth/approval_required');
            } else {
                const toastId = toast.error(errorMessage, { 
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    onClose: () => {
                        const endTime = Date.now();
                        const duration = endTime - startTime;
                        console.log('ACTUAL DURATION:', duration, 'ms =', (duration/1000).toFixed(2), 'seconds');
                    }
                });
                
                console.log('Toast ID:', toastId);
            }
        },
    });

    const signupMutation = useMutation({
        mutationFn: authApi.signup,
        onSuccess: (data: AuthResponse) => {
            if (data?.result?.accessToken) {
                tokenManager.saveToken(data.result.accessToken, true);
            }
            
            // Determine the redirect path based on user role
            const user = data?.result?.user;
            const roleType = user?.roleType;
            const firstRole = user?.roles?.[0]?.name;
            
            // Determine dashboard path
            let dashboardPath = '/dashboard';
            if (roleType === 'owner') {
                dashboardPath = '/dashboard';
            } else if (firstRole) {
                // Map role names to their dashboard paths
                const rolePathMap: Record<string, string> = {
                    'help_desk': '/dashboard/helpdesk',
                    'data_manager': '/dashboard/dataManager',
                    'team_leader': '/dashboard/teamLeader',
                    'staff': '/dashboard/staff',
                    'system_office': '/dashboard/systemOffice',
                    'human_resource': '/dashboard/humanResource',
                    'protocals': '/dashboard/protocals',
                    'check_point': '/dashboard/checkPoint',
                };
                dashboardPath = rolePathMap[firstRole] || '/dashboard';
            }
            
            navigate(dashboardPath);
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Signup failed';
            toast.error(errorMessage, {
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        },
    });

    const logout = async () => {
        try {
            await authApi.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            tokenManager.removeToken();
            queryClient.clear();
            navigate('/auth/login');
        }
    };

    const currentUserQuery = useQuery({
        queryKey: ['currentUser'],
        queryFn: authApi.getCurrentUser,
        retry: false,
        enabled: tokenManager.hasToken(),
        staleTime: 5 * 60 * 1000,
    });

    return {
        logout,
        login: loginMutation.mutate,
        signup: signupMutation.mutate,
        isLoading: loginMutation.isPending || signupMutation.isPending,
        currentUser: currentUserQuery.data?.result?.user,
        isLoadingUser: currentUserQuery.isLoading,
    };
}