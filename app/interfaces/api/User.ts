export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}
