import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import api from '../services/api';
import { toast } from 'react-toastify';

interface BillingHistoryItem {
  id: number;
  productName: string;
  quantity: number;
  amount: number;
  createdAt: string;
  currency: string;
  status: string;
  stripePaymentId?: string;
  stripeCustomerId?: string;
  productId?: string;
}

export interface Bill {
  id: string;
  plan: string;
  startDate: string;
  endDate: string;
  package: string;
  price: string;
  status: string;
}

interface BillingState {
  bills: Bill[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    pageNumber: number;
    pageSize: number;
    totalCount: number;
  } | null;

  getBillingHistory: (pageNumber?: number, pageSize?: number) => Promise<void>;
}

const endPoint = {
  billingHistory: '/v1/user/payment/invoices',
};

export const useBillingStore = create<BillingState>()(
  devtools(
    (set) => ({
      bills: [],
      isLoading: false,
      error: null,
      pagination: null,

      getBillingHistory: async (pageNumber: number = 0, pageSize: number = 10) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.get(`${endPoint.billingHistory}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
          
          const items: BillingHistoryItem[] = response.data.items;
          
          // Transform API data to UI model with fake data
          const transformedBills: Bill[] = items.map((item) => {
            const startDate = new Date(item.createdAt).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            }).replace(/\//g, '.');
            const endDateObj = new Date(item.createdAt);
            endDateObj.setFullYear(endDateObj.getFullYear() + 1);
            const endDate = endDateObj.toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            }).replace(/\//g, '.');

            const getCurrencySymbol = (currency: string) => {
              const symbolMap: { [key: string]: string } = {
                usd: '$',
                eur: '€',
                gbp: '£',
                jpy: '¥',
              };
              return symbolMap[currency?.toLowerCase()] || '$';
            };

            const currencySymbol = getCurrencySymbol(item.currency);

            return {
              id: item.id.toString(),
              plan: item.productName ,
              startDate: startDate,
              endDate: endDate , // Fake data
              package: `${item.quantity} CVs`,
              price: `${currencySymbol}${item.amount}`,
              status: item.status,
            };
          });

          set({
            bills: transformedBills,
            pagination: {
              pageNumber,
              pageSize,
              totalCount: response.data.count,
            },
            isLoading: false,
            error: null
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Failed to fetch billing history';
          set({
            isLoading: false,
            error: errorMessage
          });
          toast.error(errorMessage);
        }
      },
    }),
    {
      name: 'billing-store'
    }
  )
);