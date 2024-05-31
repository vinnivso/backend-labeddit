import { CommentDB } from "../model/Comment/CommentInterface";
import { BaseRepository } from "./BaseRepository";

export class CommentRepository extends BaseRepository {
  private static COMMENTPOST_TABLE = "comment_post";

  public createComment = async (comment: CommentDB): Promise <void> => {
    await BaseRepository
      .connection(CommentRepository.COMMENTPOST_TABLE)
      .insert(comment);
  }

  public findCommentById = async (id: string): Promise <CommentDB[]> => {
    const result: CommentDB[] = await BaseRepository
      .connection(CommentRepository.COMMENTPOST_TABLE)
      .where({ id });
    return result;
  }

  public findCommentByPostId = async (id: string): Promise <CommentDB[]> => {
    const result: CommentDB[] = await BaseRepository
      .connection(CommentRepository.COMMENTPOST_TABLE)
      .where({ id_post: id });
    return result;
  }

  public updateComment = async (comment: CommentDB, id: string): Promise <any> => {
    await BaseRepository
      .connection(CommentRepository.COMMENTPOST_TABLE)
      .update(comment)
      .where({ id });
  }

  public deleteComment = async (id: string): Promise <any> => {
    await BaseRepository
      .connection(CommentRepository.COMMENTPOST_TABLE)
      .del()
      .where({ id });
  }

}