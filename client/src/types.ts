export interface SearchResult {
  id: string;
  title: string;
  year?: number;
  type: number; // 1 = Movie, 2 = Series
  poster?: string;
  rating?: string;
  genre?: string;
  seasons?: number;
  description?: string;
}

export interface Episode {
  episode: number;
  title: string;
}

export interface Seasons {
  [season: string]: Episode[];
}

export interface NowPlaying {
  item: SearchResult;
  season: number;
  episode: number;
}