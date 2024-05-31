import { LikeOrDislikeCommentDB } from "../model/LikeDislike/LikeDislikeCommentInterface";
import { BaseRepository } from "./BaseRepository";

export class LikeDislikeCommentRepository extends BaseRepository {
  private static LIKESDISLIKESCOMMENT_TABLE = "like_dislike_comment_post";

  public newLikeDislikeComment = async (likeDislike: LikeOrDislikeCommentDB): Promise<void> => {
    await BaseRepository
      .connection(LikeDislikeCommentRepository.LIKESDISLIKESCOMMENT_TABLE)
      .insert(likeDislike);
  }

  public findLikeDislikeCommentById = async (id_user: string, id_comment: string): Promise<LikeOrDislikeCommentDB[]> => {
    const result: LikeOrDislikeCommentDB[] = await BaseRepository
      .connection(LikeDislikeCommentRepository.LIKESDISLIKESCOMMENT_TABLE)
      .where({ id_user })
      .andWhere({ id_comment });
    return result;
  }

  public findLikeDislikeByIdComment = async (id_comment: string): Promise<LikeOrDislikeCommentDB[]> => {
    const result: LikeOrDislikeCommentDB[] = await BaseRepository
      .connection(LikeDislikeCommentRepository.LIKESDISLIKESCOMMENT_TABLE)
      .where({ id_comment });
    return result;
  }

  public updateLikeDislikeComment = async (id_user: string,
    id_comment: string,
    likeDislike: any): Promise<void> => {
    await BaseRepository
      .connection(LikeDislikeCommentRepository.LIKESDISLIKESCOMMENT_TABLE)
      .update(likeDislike)
      .where({ id_comment })
      .andWhere({ id_user })
  }

  public deleteLikeDislikeComment = async (id_comment: string): Promise<void> => {
    await BaseRepository
      .connection(LikeDislikeCommentRepository.LIKESDISLIKESCOMMENT_TABLE)
      .del()
      .where({ id_comment })
  }
}