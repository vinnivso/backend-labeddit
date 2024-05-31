import z from "zod";

export interface LoginInputDTO {
  email: string;
  password: string;
}

export interface LoginOutputDTO {
  message: string;
  token: string;
}

export const loginScheme = z.object({
  email: z.string().min(1).email(),
  password: z.string().min(1),
});
