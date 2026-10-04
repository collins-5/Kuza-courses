import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const API = "https://movie-box-backend-1kgs.onrender.com";
// export const API = "http://localhost:8000";

export const categories = [
  { title: "Top Rated", query: "best movie all time" },
  { title: "Popular Movies", query: "blockbuster 2024" },
  { title: "Top Series", query: "best series all time" },
  { title: "Action & Adventure", query: "action adventure" },
  { title: "Drama", query: "award winning drama" },
  { title: "Comedy", query: "best comedy movie" },
  { title: "Thriller & Crime", query: "thriller crime" },
  { title: "Sci-Fi & Fantasy", query: "science fiction fantasy" },
  { title: "Animation", query: "animated movie" },
  { title: "Horror", query: "best horror movie" },
];
