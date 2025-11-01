export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  role: "admin" | "listener" | "artist";
  status: string;
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface Artist {
  id: string;
  name: string;
  bio?: string;
  imageUrl?: string;
  isActive: boolean;
  genres: string[];
  followers: number;
  createdAt: string;
  updatedAt: string;
}
