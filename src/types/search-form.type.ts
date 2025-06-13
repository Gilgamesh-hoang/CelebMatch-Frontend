export type SearchFormType = {
    songs: string[],
    awards: string[],
    bio: string,
}

export type SearchResultType = {
    id: number,
    full_name: string,
    occupation: string,
    nationality: string,
    birth_date: Date,
    residence: string,
    image: string,
    biography: string,
    awards: string[],
    songs: string[],
}[]