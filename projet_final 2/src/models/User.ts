export interface User {
  id?: number;
  username: string;
  password: string;
  role: 'user' | 'admin';
  created_at?: Date;
}

export interface UserInput {
  username: string;
  password: string;
  role?: 'user' | 'admin';
}

export interface UserResponse {
  id: number;
  username: string;
  role: 'user' | 'admin';
  created_at: Date;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: UserResponse;
}
