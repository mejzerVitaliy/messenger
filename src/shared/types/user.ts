export interface UpdateAccountRequest {
  email: string;
  username: string;
}

export interface UpdatePasswordRequest {
  password: string;
  newPassword: string;
  newPasswordConfirmation: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
}
