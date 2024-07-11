import { useState, useEffect } from 'react';
import { config } from "@/config";
import { enqueueSnackbar } from 'notistack';
import { MovieWithRating } from './interfaces';

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

export async function fetchData<T>(endpoint: string, token: string | null = null): Promise<T> {
    try {
        const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {};
        const res = await fetch(`${config.API_URI}${endpoint}`, {
            headers: headers
        });

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

export function getActiveRouteStyle() {
    return {
        boxShadow: 'rgba(50, 50, 93, 0.45) 0px 6px 12px -2px, rgba(0, 0, 0, 0.6) 0px 3px 7px -3px'
    }
}