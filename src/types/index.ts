export type Genre = {
    id: number;
    name: string;
};

export type Video = {
    id: number;
    artist: string;
    title: string;
    release_year: number;
    genre_id: number;
    image_url: string;
};

export type ApiResponse = {
    genres: Genre[];
    videos: Video[];
};

// Types are better for "Unions" (e.g., Status can ONLY be one of these)
export type LoadingStatus = 'idle' | 'loading' | 'success' | 'error';