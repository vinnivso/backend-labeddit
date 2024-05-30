import { LikeOrDislikeComment } from "./LikeDislikeCommentInterface";

export class LikeDislikeComment {
  constructor(
    private idUser: string,
    private idComment: string,
    private like: number | null
  ) { }

  public get IDUSER(): string {
    return this.idUser;
  }

  public get IDCOMMENT(): string {
    return this.idComment;
  }

  public get LIKE(): number | null {
    return this.like;
  }

  public set IDUSER(newIdUSer: string) {
    this.idUser = newIdUSer;
  }

  public set IDCOMMENT(newIdComment: string) {
    this.idComment = newIdComment;
  }

  public set LIKE(newLike: number | null) {
    this.like = newLike;
  }

  public LikeDislikeToResult(): LikeOrDislikeComment {
    return {
      idUser: this.idUser,
      like: this.like,
    };
  }
}
