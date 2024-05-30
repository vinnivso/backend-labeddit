import { CommentsObj } from "../Comment/CommentInterface";
import { LikeDislikePost } from "../LikeDislike/LikeDislikePost";

export interface CreatorObj {
  id: string;
  name: string;
}

export interface PostModel {
  id: string;
  content: string;
  likes: number;
  dislikes: number;
  createdAt: string;
  updatedAt: string;
  creator: CreatorObj | undefined;
  comments: CommentsObj;
  impressions: LikeDislikePost;
}

export interface PostDB {
  id: string;
  creator_id?: string;
  content: string;
  likes: number;
  dislikes: number;
  created_at: string;
  updated_at: string;
}