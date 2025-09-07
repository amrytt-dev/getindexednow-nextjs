// src/hooks/useCreditHoldData.ts
import { useState, useCallback, useEffect } from 'react';
import { getWithAuth } from '@/utils/fetchWithAuth';

interface CreditHoldData {
    holds: any[];
    pagination?: {
        currentPage: number;
        pageSize: number;
        totalCount: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
    billingCycle?: {
        periodStart: string;
        periodEnd: string;
        planName: string;
    };
    summary?: {
        totalTasks: number;
        activeHolds: number;
        creditUsed: number;
        completedTasksWithHolds: number;
        totalHeldCredits: number;
        totalCreditsUsed: number;
    };
}

export const useCreditHoldData = (page: number = 1, pageSize: number = 10, selectedPeriod?: { periodStart: string; periodEnd: string } | null) => {
    const [holds, setHolds] = useState<any[]>([]);
    const [pagination, setPagination] = useState<CreditHoldData['pagination']>();
    const [billingCycle, setBillingCycle] = useState<CreditHoldData['billingCycle']>();
    const [summary, setSummary] = useState<CreditHoldData['summary']>();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchHolds = useCallback(async (currentPage: number = page, currentPageSize: number = pageSize) => {
        try {
            setError(null);
            const query = new URLSearchParams({ page: String(currentPage), pageSize: String(currentPageSize) });
            if (selectedPeriod?.periodStart && selectedPeriod?.periodEnd) {
                query.set('periodStart', selectedPeriod.periodStart);
                query.set('periodEnd', selectedPeriod.periodEnd);
            }
            const data = await getWithAuth<CreditHoldData>(`/user/credits/holds?${query.toString()}`);
            setHolds(data.holds || []);
            setPagination(data.pagination);
            setBillingCycle(data.billingCycle);
            setSummary(data.summary);
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        }
    }, [page, pageSize, selectedPeriod?.periodStart, selectedPeriod?.periodEnd]);

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchHolds();
        setRefreshing(false);
    };

    const handlePageChange = async (newPage: number) => {
        setLoading(true);
        await fetchHolds(newPage, pageSize);
        setLoading(false);
    };

    const handlePageSizeChange = async (newPageSize: number) => {
        setLoading(true);
        await fetchHolds(1, newPageSize);
        setLoading(false);
    };

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            await fetchHolds();
            setLoading(false);
        };
        load();
    }, [fetchHolds]);

    return { 
        holds, 
        pagination,
        billingCycle, 
        summary, 
        loading, 
        refreshing, 
        error, 
        handleRefresh,
        handlePageChange,
        handlePageSizeChange
    };
};
