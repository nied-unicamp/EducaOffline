export interface UserJson {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
  aboutMe?: string;
  picture?: string;
  language?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
  aboutMe?: string;
  picture?: string;
  language?: string;
}

export const fromJsonToUser: (json: UserJson) => User = (json: UserJson) => {
  return (!json) ? undefined : {
    ...json
  };
}

export const fromJsonToUserSM: (json: UserJson) => UserSM = (json: UserJson) => {
  return (!json) ? undefined : {
    ...json,
    aboutMe: json.aboutMe ?? ''
  };
}

export interface UserSM {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
  aboutMe: string;
  picture?: string;
  language?: string;
}
