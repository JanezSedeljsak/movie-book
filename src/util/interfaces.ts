export interface Movie {
    title: string,
    year: number,
    imgSrc?: string
}

export interface MovieWithRating extends Movie {
    avgRating: number,
    numberOfRatings: number
}