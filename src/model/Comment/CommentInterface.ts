import { LikeOrDislikeComment } from "../LikeDislike/LikeDislikeCommentInterface";

export interface CreatorObj {
  id: string;
  name: string;
}

export interface CommentsObj {
  id: string;
  name: string;
}

export interface CommentModel {
  id: string;
  idPost: string;
  content: string;
  likes: number;
  dislikes: number;
  createdAt: string;
  updatedAt: string;
  creator: CreatorObj;
  impressions: LikeOrDislikeComment;
}

export interface CommentDB {
  id: string;
  id_user: string;
  id_post: string;
  content: string;
  likes: number;
  dislikes: number;
  created_at: string;
  updated_at: string;
}