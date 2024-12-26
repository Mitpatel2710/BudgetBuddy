export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  updated_at: string;
}

export interface UserWithProfile {
  email: string;
  first_name: string;
  last_name: string;
}