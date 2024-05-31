import { CommentDB, CreatorObj } from "./CommentInterface";

export class Comment {
  constructor(
    private id: string,
    private idPost: string,
    private content: string,
    private likes: number,
    private dislikes: number,
    private createdAt: string,
    private updatedAt: string,
    private creator: CreatorObj
  ) { }

  public get ID(): string {
    return this.id;
  }

  public get IDPOST(): string {
    return this.idPost;
  }

  public get CREATOR(): CreatorObj {
    return this.creator;
  }

  public get CONTENT(): string {
    return this.content;
  }

  public get LIKES(): number {
    return this.likes;
  }

  public get DISLIKES(): number {
    return this.dislikes;
  }

  public get CREATEDAT(): string {
    return this.createdAt;
  }

  public get UPDATEDAT(): string {
    return this.updatedAt;
  }

  public set ID(newId: string) {
    this.id = newId;
  }

  public set IDPOST(newIdPost: string) {
    this.idPost = newIdPost;
  }

  public set CREATOR(newCreator: CreatorObj) {
    this.creator = newCreator;
  }

  public set CONTENT(newContent: string) {
    this.content = newContent;
  }

  public set LIKES(newLikes: number) {
    this.likes = newLikes;
  }

  public set DISLIKES(newDislikes: number) {
    this.dislikes = newDislikes;
  }

  public set CREATEDAT(newCreatedAt: string) {
    this.createdAt = newCreatedAt;
  }

  public set UPDATEDAT(newUpdateAt: string) {
    this.updatedAt = newUpdateAt;
  }

  public toDBModel(): CommentDB {
    return {
      id: this.id,
      id_user: this.creator.id,
      id_post: this.idPost,
      content: this.content,
      likes: this.likes,
      dislikes: this.dislikes,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }

  public CommentToGetAllPost(): any {
    return {
      id: this.id,
      content: this.content,
    };
  }
}