// Tipus de dades
export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  overview: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
  tagline?: string;
  original_language: string;
  original_title: string;
  popularity: number;
  adult: boolean;
  video: boolean;
}

export interface Trailer {
  id: string;
  key: string;
  movieTitle: string;
  published_at?: string;
}

// API KEY
export const API_KEY = '2903fc4c6bd618022e8965d44f45e020';

// Fetch: Popular Movies
export const fetchPopularMovies = async (): Promise<Movie[]> => {
  const res = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=ca-ES&page=1`);
  if (!res.ok) {
    throw new Error(`Error carregant pel·lícules populars: ${res.status}`);
  }
  const data = await res.json();
  return data.results as Movie[];
};

// Fetch: Trending Movies
export const fetchTrendingMovies = async (): Promise<Movie[]> => {
  const res = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}&language=ca-ES&page=1`);
  if (!res.ok) {
    throw new Error(`Error carregant trending movies: ${res.status}`);
  }
  const data = await res.json();
  return data.results as Movie[];
};

// Fetch: Search by Text
export const fetchMoviesByQuery = async (query: string): Promise<Movie[]> => {
  if (!query) return [];
  const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=ca-ES&page=1&query=${encodeURIComponent(query)}`);
  if (!res.ok) {
    throw new Error(`Error buscant pel·lícules: ${res.status}`);
  }
  const data = await res.json();
  return data.results as Movie[];
};

// Fetch: Trailers from Movies
export const fetchTrailersFromMovies = async (movies: Movie[]): Promise<Trailer[]> => {
  const trailers: Trailer[] = [];

  for (const movie of movies) {
    try {
      const res = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${API_KEY}&language=ca-ES`);
      if (!res.ok) {
        console.warn(`Error carregant tràiler per ${movie.title}: ${res.status}`);
        continue;
      }

      const data = await res.json();
      const trailer = data.results.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer');

      if (trailer) {
        trailers.push({
          id: trailer.id,
          key: trailer.key,
          movieTitle: movie.title,
          published_at: trailer.published_at,
        });
      }
    } catch (error) {
      console.warn(`Error carregant tràiler per ${movie.title}:`, error);
    }
  }

  return trailers;
};

// Fetch: Free to Watch
export const fetchFreeToWatch = async (): Promise<Movie[]> => {
  const res = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_watch_monetization_types=free&page=1&language=ca-ES`);
  if (!res.ok) {
    throw new Error(`Error carregant Free to Watch: ${res.status}`);
  }
  const data = await res.json();
  return data.results as Movie[];
};