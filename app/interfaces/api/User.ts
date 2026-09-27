export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  admin: false;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}


export interface UpdateUserPayload {
  name: string;
  email: string;
  password?: string;
}