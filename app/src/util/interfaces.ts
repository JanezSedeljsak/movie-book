export interface Movie {
    id: string,
    title: string,
    year: number,
    imgSrc?: string
}

export interface MovieWithRating extends Movie {
    avgRating: number,
    numberOfRatings: number
}

export interface MovieWithStats extends MovieWithRating {
    minRating: number,
    maxRating: number,
    userRating: number | null
}