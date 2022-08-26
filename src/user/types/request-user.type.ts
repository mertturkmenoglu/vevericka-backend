export type RequestUser = {
  email: string;
  password: string;
  userId: number;
  user: {
    id: number;
    username: string;
    email: string;
    name: string;
    image: string;
  };
};
