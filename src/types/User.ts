//register local
export interface RegisterLocalRequest {
  email: string;
  password: string;
  name: string;
}
export interface RegisterFormProps {
  onSubmit: (data: RegisterLocalRequest) => void;
  loading: boolean;
  error: string | null;
  onLoginClick: () => void;
}
export interface RegisterLocalResponse {
  message: string;
  account?: {
    id: number;
    email: string;
    provider: string;
    is_verified: boolean;
    created_at: string;
    updated_at: string;
    createdAt: string;
    updatedAt: string;
  };
  user?: {
    user_id: number;
    account_id: number;
    name: string;
    username: string;
    phone: string | null;
    address: string;
    role: string;
    created_at: string;
    updated_at: string;
    createdAt: string;
    updatedAt: string;
  };
}
//verifyAccount(bug)
export interface verifyAccountRequest {
  token: string;
}
export interface verifyAccountResponse {
  message: string;
}

//login
export interface postLoginRequest {
  email: string;
  password: string;
}
export interface postLoginResponse {
  message: string;
  token: string;
  expires: string;
}
//Logout
export interface postLogoutRequest {
  message: string;
}

//requestPasswordReset
export interface requestPasswordReset {
  email: string;
}
export interface responsePasswordReset {
  message: string;
}
//resetPassword
export interface resetPasswordRequest {
  token: string;
  newPassword: string;
}
export interface resetPasswordResponse {
  message: string;
}

//updatePassword after login
export interface updatePasswordRequest {
  oldPassword: string;
  newPassword: string;
}
export interface updatePasswordResponse {
  message: string;
}
//update avatar (chưa test)

//getUserProfile
export interface getUserProfileResponse {
  success: boolean;
  data: UserData;
}
export interface UserData {
  user_id: number;
  account_id: number;
  name: string;
  username: string;
  avatar: string | null;
  phone: string | null;
  address: string;
  role: string;
  created_at: string;
  updated_at: string;
}



//googleauthen
export interface googleAuthenResponse {
  message: string;
  user: {
    id: number;
    email: string;
    google_id: string;
    provider: "google";
    is_verified: boolean;
  };
}


// getMe
export interface getMeResponse {
  success: boolean;
  user: {
    id: number;
    account_id: number;
    name: string;
    username: string;
    avatar: string | null;
    email: string;
    phone: string | null;
    address: string;
    role: string;
    created_at: string;
    updated_at: string;
  };
}

export interface adminLoginRequest {
  email: string;
  password: string;
}
export interface adminLoginResponse {
  message: string;
  token: string;
  expires: string;
}