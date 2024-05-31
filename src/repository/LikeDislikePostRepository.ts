import { LikeOrDislikePostDB } from "../model/LikeDislike/LikeDislikePostInterface";
import { BaseRepository } from "./BaseRepository";

export class LikeDislikePostRepository extends BaseRepository {
  private static LIKESDISLIKES_TABLE = "like_dislike";

  public newLikeDislikePost = async (likeDislike: LikeOrDislikePostDB): Promise<void> => {
    await BaseRepository
      .connection(LikeDislikePostRepository.LIKESDISLIKES_TABLE)
      .insert(likeDislike);
  };

  public findLikeDislikePostById = async (id_post: string, id_user: string): Promise<LikeOrDislikePostDB[]> => {
    const result: LikeOrDislikePostDB[] = await BaseRepository
      .connection(LikeDislikePostRepository.LIKESDISLIKES_TABLE)
      .where({ id_post })
      .andWhere({ id_user });
    return result;
  };

  public findLikeDislikeByIdPost = async (id_post: string): Promise<LikeOrDislikePostDB[]> => {
    const result: LikeOrDislikePostDB[] = await BaseRepository
      .connection(LikeDislikePostRepository.LIKESDISLIKES_TABLE)
      .where({ id_post });
    return result;
  };

  public updateLikeDislikePost = async (id_user: string,
    id_post: string,
    likeDislike: any): Promise<any> => {
    await BaseRepository
      .connection(LikeDislikePostRepository.LIKESDISLIKES_TABLE)
      .update(likeDislike)
      .where({ id_post })
      .andWhere({ id_user })
  };

  public deleteLikeDislikePost = async (id_post: string): Promise<any> => {
    await BaseRepository
      .connection(LikeDislikePostRepository.LIKESDISLIKES_TABLE)
      .del()
      .where({ id_post })
  };
}