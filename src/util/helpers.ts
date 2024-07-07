import { useState, useEffect } from 'react';
import { config } from "@/config";
import { enqueueSnackbar } from 'notistack';

export function useFetch<T>(fetchFunction: () => Promise<T>): { data: T | null, isLoading: boolean, error: Error | null } {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const doFetch = async () => {
            try {
                const result = await fetchFunction();
                setData(result);
            } catch (error) {
                setError(error as Error);
            } finally {
                setIsLoading(false);
            }
        };

        doFetch();
    }, [fetchFunction]);

    return { data, isLoading, error };
}

export async function fetchData<T>(endpoint: string): Promise<T> {
    try {
        const res = await fetch(`${config.RECOMMENDER_URI}${endpoint}`)
        if (!res.ok) {
            throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
        }
        const data: T = await res.json();
        return data;
    } catch (error) {
        console.error("Fetching error:", error);
        enqueueSnackbar('Fetch error', {
            variant: 'error'
        });

        throw error;
    }
}