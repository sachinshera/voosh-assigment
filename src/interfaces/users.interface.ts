export interface User {
  id?: number;
  email: string;
  password: string;
  photo: string;
  name: string;
  bio: string;
  phone:number;
  signupMethod: string;
  isPublic: boolean;
  isAdmin: boolean;
}
