import z from "zod";
import { CommentModel } from "../../model/Comment/CommentInterface";

export interface GetCommentInputDTO {
  token: string;
  idPost: string;
}

export interface GetCommentOutputDTO {
  message: string;
  products: CommentModel;
}

export const GetCommentSchema = z
  .object({
    token: z.string().min(1),
  })
  .transform((data) => data as GetCommentInputDTO);
