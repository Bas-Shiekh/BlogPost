interface signupInterface {
  name: string
  email: string;
  password: string;
  confirmationPassword: string;
}

interface loginInterface {
  email: string;
  password: string;
}

interface createUserInterface {
  name: string;
  email: string;
  password: string;
}

interface PayloadInterface {
  id: number;
  name: string;
  email: string;
}

export {
  signupInterface,
  loginInterface,
  createUserInterface,
  PayloadInterface,
};