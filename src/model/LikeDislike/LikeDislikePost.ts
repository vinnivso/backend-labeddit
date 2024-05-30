import { LikeOrDislikePost } from "./LikeDislikePostInterface";

export class LikeDislikePost {
  constructor(
    private idUser: string,
    private idPost: string,
    private like: number | null
  ) { }

  public get IDUSER(): string {
    return this.idUser;
  }

  public get IDPOST(): string {
    return this.idPost;
  }

  public get LIKE(): number | null {
    return this.like;
  }

  public set IDUSER(newIdUSer: string) {
    this.idUser = newIdUSer;
  }

  public set IDPOST(newIdPost: string) {
    this.idPost = newIdPost;
  }

  public set LIKE(newLike: number | null) {
    this.like = newLike;
  }

  public LikeDislikeToResult(): LikeOrDislikePost {
    return {
      idUser: this.idUser,
      like: this.like,
    };
  }
}