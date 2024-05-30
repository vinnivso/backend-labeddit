export interface LikeOrDislikePostDB {
  id_user: string;
  id_post: string;
  like: number | null;
}

export interface LikeOrDislikePost {
  idUser: string;
  like: number | null;
}