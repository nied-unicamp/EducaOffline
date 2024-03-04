import { environment } from "src/environments/environment";

export interface LoginState {
  email: string;
  token: { value: string, validUntil: string };
  userId: number;
  isOffline: boolean;
  apiUrl: string;
}

export const loginInitialState: LoginState = {
  email: null,
  token: { value: null, validUntil: null },
  userId: null,
  isOffline: null,
  apiUrl: environment.apiUrl
};
