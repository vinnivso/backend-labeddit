import z from "zod";

export interface LikeOrDislikeInputDTO {
  token: string;
  id: string;
  like: boolean;
}

export const likeOrDislikeScheme = z
  .object({
    token: z.string().min(1),
    id: z.string().min(1, "'id' must be at least 1 character."),
    like: z.boolean(),
  })
  .transform((data) => data as LikeOrDislikeInputDTO);
