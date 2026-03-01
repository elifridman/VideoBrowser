export interface Genre {
    id: number;
    name: string;
  }
  
  //  client format of the video
  export interface Video {
    id: number;
    title: string;
    artist: string;
    releaseYear: number;
    genreId: number;
    imageUrl: string;
  }
  
  // raw data coming directly from hook/API
  export interface RawVideo {
    id: number;
    title: string;
    artist: string;
    release_year: number;
    genre_id: number;
    image_url: string;
  }
  
  // The shape of the full API response
  export interface ApiResponse {
    videos: RawVideo[];
    genres: Genre[];
  }