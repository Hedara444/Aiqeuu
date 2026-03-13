import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import api from '../services/api';
import { toast } from 'react-toastify';
import { useAuthStore } from './authStore';

interface ProfileState {
    profile: User | null;
    balance: number | null;
    history: TransactionHistory[] | null;
    products: Product[] | null;
    stats: {
        positionsCount: number;
        avgCriteriasPerUseCase: number;
        processedResumesCount: number;
        avgScore: number;
    } | null;
    isLoading: boolean;
    error: string | null;

    // Methods
    getProfileData: () => Promise<void>;
    getBalance: () => Promise<void>;
    getHistory: (pageNumber: number, pageSize?: number) => Promise<void>;
    getProducts: () => Promise<void>;
    getStats: () => Promise<void>;
    changePassword: (data: ChangePasswordFormData) => Promise<void>;
    buyProduct: (productId: string, quantity: number) => Promise<{ url: string }>;
    submitFeedback: (title: string, description: string, imageUrl: string) => Promise<void>;
    uploadPhoto: (file: File) => Promise<{ url: string }>;
    clearError: () => void;
}

const endPoint = {
    profile: "/v1/user/profile",
    balance: "/v1/user/pointsCharges/balance",
    history: "/v1/user/pointsCharges/history",
    changePassword: "/v1/user/profile/password",
    stats: "/v1/user/profile/stats",
    products: "/v1/user/payment/products",
    buyProduct: "/v1/user/payment/one-time",
    feedback: "/v1/user/feedbacks",
    uploadPhoto: "/v1/user/uploads/feedback"
};

// Request interceptor - get token from auth store
api.interceptors.request.use(
    (config) => {
        const { accessToken } = useAuthStore.getState();
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const useProfileStore = create<ProfileState>()(
    devtools(
        persist(
            (set, get) => ({
                profile: null,
                balance: null,
                history: null,
                products: null,
                stats: null,
                isLoading: false,
                error: null,

                getProfileData: async () => {
                    set({ isLoading: true, error: null });
                    try {
                        const response = await api.get(endPoint.profile);
                        set({
                            profile: response.data,
                            isLoading: false,
                            error: null
                        });
                    } catch (error: any) {
                        const errorMessage = error.response?.data?.message || 'Failed to fetch profile data';
                        set({
                            isLoading: false,
                            error: errorMessage
                        });
                        toast.error(errorMessage);
                        throw error;
                    }
                },

                getBalance: async () => {
                    set({ isLoading: true, error: null });
                    try {
                        const response = await api.get(endPoint.balance);
                        set({
                            balance: response.data.balance || response.data,
                            isLoading: false,
                            error: null
                        });
                    } catch (error: any) {
                        const errorMessage = error.response?.data?.message || 'Failed to fetch balance';
                        set({
                            isLoading: false,
                            error: errorMessage
                        });
                        toast.error(errorMessage);
                        throw error;
                    }
                },

                getHistory: async (page: number, pageSize: number = 20) => {
                    set({ isLoading: true, error: null });
                    try {
                        const response = await api.get(`${endPoint.history}?pageNumber=${page}&pageSize=${pageSize}`);
                        set({
                            history: response.data.items,
                            isLoading: false,
                            error: null
                        });
                    } catch (error: any) {
                        const errorMessage = error.response?.data?.message || 'Failed to fetch transaction history';
                        set({
                            isLoading: false,
                            error: errorMessage
                        });
                        toast.error(errorMessage);
                        throw error;
                    }
                },

                getProducts: async () => {
                    set({ isLoading: true, error: null });
                    try {
                        const response = await api.get(endPoint.products);
                        set({
                            products: response.data,
                            isLoading: false,
                            error: null
                        });
                    } catch (error: any) {
                        const errorMessage = error.response?.data?.message || 'Failed to fetch products';
                        set({
                            isLoading: false,
                            error: errorMessage
                        });
                        toast.error(errorMessage);
                        throw error;
                    }
                },

                getStats: async () => {
                    set({ isLoading: true, error: null });
                    try {
                        const response = await api.get(endPoint.stats);
                        set({
                            stats: response.data,
                            isLoading: false,
                            error: null
                        });
                    } catch (error: any) {
                        const errorMessage = error.response?.data?.message || 'Failed to fetch stats';
                        set({
                            isLoading: false,
                            error: errorMessage
                        });
                        toast.error(errorMessage);
                        throw error;
                    }
                },

                changePassword: async (data: ChangePasswordFormData) => {
                    set({ isLoading: true, error: null });
                    try {
                        await api.patch(endPoint.changePassword, data);
                        set({
                            isLoading: false,
                            error: null
                        });
                        toast.success('Password changed successfully!');
                    } catch (error: any) {
                        const errorMessage = error.response?.data?.message || 'Failed to change password';
                        set({
                            isLoading: false,
                            error: errorMessage
                        });
                        toast.error(errorMessage);
                        throw error;
                    }
                },

                buyProduct: async (productId: string, quantity: number) => {
                    set({ isLoading: true, error: null });
                    try {
                        const response = await api.post(endPoint.buyProduct, { productId, quantity });
                        set({
                            isLoading: false,
                            error: null
                        });
                        return response.data;
                    } catch (error: any) {
                        const errorMessage = error.response?.data?.message || 'Failed to purchase product';
                        set({
                            isLoading: false,
                            error: errorMessage
                        });
                        toast.error(errorMessage);
                        throw error;
                    }
                },

                submitFeedback: async (title: string, description: string, imageUrl: string) => {
                    set({ isLoading: true, error: null });
                    try {
                        await api.post(endPoint.feedback, {
                            title,
                            description,
                            imageUrl,
                        });
                        set({
                            isLoading: false,
                            error: null
                        });
                        toast.success('Feedback submitted successfully!');
                    } catch (error: any) {
                        const errorMessage = error.response?.data?.message || 'Failed to submit feedback';
                        set({
                            isLoading: false,
                            error: errorMessage
                        });
                        toast.error(errorMessage);
                        throw error;
                    }
                },

                uploadPhoto: async (file: File) => {
                    set({ isLoading: true, error: null });
                    try {
                        const formData = new FormData();
                        formData.append('file', file);

                        const response = await api.post(endPoint.uploadPhoto, formData, {
                            headers: { 'Content-Type': 'multipart/form-data' }
                        });

                        set({
                            isLoading: false,
                            error: null
                        });

                        return response.data;
                    } catch (error: any) {
                        const errorMessage = error.response?.data?.message || 'Failed to upload photo';
                        set({
                            isLoading: false,
                            error: errorMessage
                        });
                        toast.error(errorMessage);
                        throw error;
                    }
                },

                clearError: () => {
                    set({ error: null });
                    toast.dismiss();
                }
            }),
            {
                name: 'profile-storage',
                partialize: (state) => ({
                    profile: state.profile,
                    balance: state.balance,
                    history: state.history,
                    products: state.products,
                    stats: state.stats
                })
            }
        ),
        {
            name: 'profile-store'
        }
    )
);
