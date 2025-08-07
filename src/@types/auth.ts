export type AuthRequestStatus = "success" | "failed" | "";

// ✅ Fixed: SignUpResponse now includes status & message
export type SignUpResponse = {
  status: AuthRequestStatus; // ✅ Status of signup request
  message: string; // ✅ API response message (e.g., "Signup successful")
  token?: string; // ✅ Token returned after successful signup (optional)
  user?: {
    uuid: string;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: "male" | "female";
    authority: string[];
    avatar?: string;
  };
};

// ✅ SignUpCredential matches form fields
export type SignUpCredential = {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  phone: string;
  dateOfBirth: string; // ISO formatted date (YYYY-MM-DD)
  gender: "male" | "female";
  password: string;
};

// ✅ SignIn Types
export type SignInCredential = {
  username: string;
  password: string;
};

export type SignInResponse = {
  status: AuthRequestStatus; // ✅ Now includes status
  message: string; // ✅ Now includes API message
  token?: string;
  user?: {
    uuid: string;
    userName: string;
    authority: string[];
    avatar?: string;
    email: string;
  };
};

// ✅ Other Authentication Types
export type ForgotPassword = {
  email: string;
};

export type ResetPassword = {
  password: string;
};

// ✅ AuthResult is used in API responses
export type AuthResult = Promise<{
  status: AuthRequestStatus;
  message: string;
}>;

export type User = {
  uuid?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  userName?: string | null;
  email?: string | null;
  phone?: string | null;
  dateOfBirth?: string | null;
  gender?: "Male" | "Female" | null;
  authority?: string[];
  avatar?: string | null;
  type?: string | null;
};

export type SignUpFormSchema = {
  firstName: string;
  lastName: string;
  gender: string;
  phone: string;
  email: string;
  dateOfBirth: string; // Stored as ISO stringçç
  termsAccepted: boolean;
  password: string;
  passwordConfirmation: string;
};

// ✅ Fixed typo: refereshToken → refreshToken
export type Token = {
  accessToken: string;
  refreshToken?: string;
};

export type OauthSignInCallbackPayload = {
  onSignIn: (tokens: Token, user?: User) => void;
  redirect: () => void;
};
