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

export function getMovies(): MovieWithRating[] {
    const imgLink = 'https://i.pinimg.com/236x/0e/a8/42/0ea84268bdf37c4112d138bf2fec40f5.jpg';

    return [
        {title: 'Film1', year: 2010, imgSrc: imgLink, avgRating: 4.3, numberOfRatings: 140 },
        {title: 'Film2', year: 2015, imgSrc: imgLink, avgRating: 4.3, numberOfRatings: 140 },
        {title: 'Film3', year: 2009, imgSrc: imgLink, avgRating: 4.3, numberOfRatings: 150 },
        {title: 'Film4', year: 2009, imgSrc: imgLink, avgRating: 4.3, numberOfRatings: 150 },
        {title: 'Film5', year: 2019, imgSrc: imgLink, avgRating: 4.3, numberOfRatings: 150 },
    ];
}


export function getAllMovies(): MovieWithRating[] {
    const imgLink = 'https://i.pinimg.com/236x/0e/a8/42/0ea84268bdf37c4112d138bf2fec40f5.jpg';

    return [
        {title: 'Test', year: 2010, imgSrc: imgLink, avgRating: 2.3, numberOfRatings: 140 },
        {title: 'Film', year: 2015, imgSrc: imgLink, avgRating: 4.1, numberOfRatings: 140 },
        {title: 'Tecaj', year: 2009, imgSrc: imgLink, avgRating: 4.3, numberOfRatings: 150 },
        {title: 'Kekec', year: 2009, imgSrc: imgLink, avgRating: 4.5, numberOfRatings: 150 },
        {title: 'Martin Krpan', year: 2019, imgSrc: imgLink, avgRating: 5.0, numberOfRatings: 150 },
        {title: 'Tu pa tam', year: 2010, imgSrc: imgLink, avgRating: 4.9, numberOfRatings: 140 },
        {title: 'Film23', year: 2015, imgSrc: imgLink, avgRating: 2.0, numberOfRatings: 140 },
        {title: 'Film34', year: 2009, imgSrc: imgLink, avgRating: 2.1, numberOfRatings: 150 },
        {title: 'Film45', year: 2009, imgSrc: imgLink, avgRating: 3.3, numberOfRatings: 150 },
        {title: 'Film56', year: 2019, imgSrc: imgLink, avgRating: 4.3, numberOfRatings: 150 },
    ];
}