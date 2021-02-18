export interface AuthyCreateUserResponseInterface {
  message: string;
  user: User;
  success: boolean;
}

export interface User {
  id: number | string;
}
