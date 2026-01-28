import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import api from '../services/api';
import { toast } from 'react-toastify';
import { useAuthStore } from './authStore';

interface PositionsState {
  positions: Position[] | null;
  currentPosition: Position | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
  } | null;

  // Methods
  getPositions: (pageNumber: number, pageSize?: number) => Promise<void>;
  getPositionById: (id: string) => Promise<Position>;
  createPosition: (data: PositionFormData) => Promise<Position>;
  updatePosition: (id: string, data: PositionFormData) => Promise<void>;
  duplicatePosition: (id: string) => Promise<void>;
  deletePosition: (id: string) => Promise<void>;
  startProcessing: (id: string) => Promise<void>;
  addResume: (file: File, positionId: string) => Promise<Resume>;
  deleteResume: (id: string) => Promise<void>;
  getResumeFile: (id: string) => Promise<string>;
  addCriteria: (positionId: string, description: string) => Promise<Criteria>;
  addCriteriaFullText: (positionId: string, text: string) => Promise<Criteria[]>;
  deleteCriteria: (id: string) => Promise<void>;
  clearError: () => void;
}

const endPoint = {
  positions: "/v1/user/positions",
  positionById: (id: string) => `/v1/user/positions/${id}`,
  duplicatePosition: (id: string) => `/v1/user/positions/${id}/duplicate`,
  startProcessing: (id: string) => `/v1/user/positions/${id}/startProcessing`,
  uploadResume: '/v1/user/uploads/resume',
  positionResumes: '/v1/user/positions/resumes',
  resumeById: (id: string) => `/v1/user/positions/resumes/${id}`,
  resumeFile: (id: string) => `/v1/user/positions/resumes/${id}/file`,
  positionCriterias: '/v1/user/positions/criterias',
  criteriasFullText: '/v1/user/positions/criterias-full-text',
  criteriaById: (id: string) => `/v1/user/positions/criterias/${id}`,
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

export const usePositionsStore = create<PositionsState>()(
  devtools(
    persist(
      (set, get) => ({
        positions: null,
        currentPosition: null,
        isLoading: false,
        error: null,
        pagination: null,

        getPositions: async (pageNumber: number, pageSize: number = 20) => {
          set({ isLoading: true, error: null });
          try {
            const response = await api.get(`${endPoint.positions}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
            set({
              positions: response.data.items,
              pagination: {
                pageNumber,
                pageSize,
                totalPages: Math.ceil(response.data.count / pageSize),
                totalCount: response.data.count,
              },
              isLoading: false,
              error: null
            });
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch positions';
            set({
              isLoading: false,
              error: errorMessage
            });
            toast.error(errorMessage);
            throw error;
          }
        },

        getPositionById: async (id: string) => {
          set({ isLoading: true, error: null });
          try {
            const response = await api.get(endPoint.positionById(id));
            set({
              currentPosition: response.data,
              isLoading: false,
              error: null
            });
            return response.data

          } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch position';
            set({
              isLoading: false,
              error: errorMessage
            });
            toast.error(errorMessage);
            throw error;
          }
        },

        createPosition: async (data: PositionFormData) => {
          set({ isLoading: true, error: null });
          try {
            const response = await api.post(endPoint.positions, data);
            set({
              currentPosition: response.data,
              isLoading: false,
              error: null
            });
            toast.success('Position created successfully!');
            return response.data;
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to create position';
            set({
              isLoading: false,
              error: errorMessage
            });
            toast.error(errorMessage);
            throw error;
          }
        },

        updatePosition: async (id: string, data: any) => {
          set({ isLoading: true, error: null });
          try {
            const response = await api.put(endPoint.positionById(id), data);
            set({
              currentPosition: response.data,
              isLoading: false,
              error: null
            });
            toast.success('Position updated successfully!');
            return response.data;
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to update position';
            set({
              isLoading: false,
              error: errorMessage
            });
            toast.error(errorMessage);
            throw error;
          }
        },

        duplicatePosition: async (id: string) => {
          set({ isLoading: true, error: null });
          try {
            const response = await api.post(endPoint.duplicatePosition(id), {});
            set({
              isLoading: false,
              error: null
            });
            toast.success('Position duplicated successfully!');
            return response.data;
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to duplicate position';
            set({
              isLoading: false,
              error: errorMessage
            });
            toast.error(errorMessage);
            throw error;
          }
        },

        deletePosition: async (id: string) => {
          set({ isLoading: true, error: null });
          try {
            await api.delete(endPoint.positionById(id));
            set({
              isLoading: false,
              error: null
            });
            toast.success('Position deleted successfully!');
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to delete position';
            set({
              isLoading: false,
              error: errorMessage
            });
            toast.error(errorMessage);
            throw error;
          }
        },

        startProcessing: async (id: string) => {
          set({ isLoading: true, error: null });
          try {
            const response = await api.patch(endPoint.startProcessing(id));
            set({
              currentPosition: response.data,
              isLoading: false,
              error: null
            });
            toast.success('Position processing started!');
            return response.data;
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to start processing';
            set({
              isLoading: false,
              error: errorMessage
            });
            toast.warning(errorMessage);
            throw error;
          }
        },

        addResume: async (file: File, positionId: string) => {
          set({ isLoading: true, error: null });
          try {
            const formData = new FormData();
            formData.append('file', file);

            const uploadResponse = await api.post(endPoint.uploadResume, formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            });

            const path = uploadResponse.data.url;
            const fileName = file.name.replace('.pdf', '');

            const response = await api.post(endPoint.positionResumes, {
              positionId,
              path,
              title: fileName
            });

            set({ isLoading: false, error: null });
            toast.success('Resume added successfully!');
            return response.data;
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to add resume';
            set({
              isLoading: false,
              error: errorMessage
            });
            toast.error(errorMessage);
            throw error;
          }
        },

        deleteResume: async (id: string) => {
          set({ isLoading: true, error: null });
          try {
            await api.delete(endPoint.resumeById(id));
            set({ isLoading: false, error: null });
            toast.success('Resume deleted successfully!');
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to delete resume';
            set({
              isLoading: false,
              error: errorMessage
            });
            toast.error(errorMessage);
            throw error;
          }
        },

        getResumeFile: async (id: string) => {
          set({ isLoading: true, error: null });
          try {
            const response = await api.get(endPoint.resumeFile(id));
            const url = response.data.url;
            set({ isLoading: false, error: null });
            return url;
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to get resume file';
            set({
              isLoading: false,
              error: errorMessage
            });
            toast.error(errorMessage);
            throw error;
          }
        },

        addCriteria: async (positionId: string, description: string) => {
          set({ isLoading: true, error: null });

          try {
            const response = await api.post(endPoint.positionCriterias, {
              positionId,
              description,
            });

            set((state) => ({
              isLoading: false,
              error: null,
              currentPosition: state.currentPosition
                ? {
                  ...state.currentPosition,
                  criterias: [
                    ...state.currentPosition.criterias,
                    response.data, 
                  ],
                }
                : state.currentPosition,
            }));

            toast.success('Criterias added successfully!');
            return response.data;
          } catch (error: any) {
            const errorMessage =
              error.response?.data?.message || 'Failed to add criteria';

            set({ isLoading: false, error: errorMessage });
            toast.error(errorMessage);
            throw error;
          }
        },

        addCriteriaFullText: async (positionId: string, text: string) => {
          set({ isLoading: true, error: null });

          try {
            const response = await api.post(endPoint.criteriasFullText, {
              positionId,
              job_description: text,
            });

            set((state) => ({
              isLoading: false,
              error: null,
              currentPosition: state.currentPosition
                ? {
                  ...state.currentPosition,
                  criterias: [
                    ...state.currentPosition.criterias,
                    ...response.data, // 👈 append new criterias
                  ],
                }
                : state.currentPosition,
            }));

            toast.success('Criteria added successfully!');
            return response.data;
          } catch (error: any) {
            const errorMessage =
              error.response?.data?.message || 'Failed to add criteria';

            set({ isLoading: false, error: errorMessage });
            toast.error(errorMessage);
            throw error;
          }
        },

        deleteCriteria: async (id: string) => {
          set({ isLoading: true, error: null });

          try {
            await api.delete(endPoint.criteriaById(id));

            set((state) => ({
              isLoading: false,
              error: null,
              currentPosition: state.currentPosition
                ? {
                  ...state.currentPosition,
                  criterias: state.currentPosition.criterias.filter(
                    (c) => c.id !== id
                  ),
                }
                : state.currentPosition,
            }));

            toast.success('Criteria deleted successfully!');
          } catch (error: any) {
            const errorMessage =
              error.response?.data?.message || 'Failed to delete criteria';

            set({ isLoading: false, error: errorMessage });
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
        name: 'positions-storage1',
        partialize: (state) => ({
          positions: state.positions,
          currentPosition: state.currentPosition,
          pagination: state.pagination
        })
      }
    ),
    {
      name: 'positions-store'
    }
  )
);