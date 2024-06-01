import {
  LikeDislikeDB,
  POST_LIKE,
  PostDB,
  PostDBWithCreatorName,
} from "../model/Post";
import { BaseRepository } from "./BaseRepository";
import { UserRepository } from "./UserRepository";

export class PostRepository extends BaseRepository {
  public static TABLE_POSTS = "posts";
  public static TABLE_LIKES_DISLIKES_POSTS = "likes_dislikes_posts";

  public createPost = async (postDB: PostDB): Promise<void> => {
    await BaseRepository.connection(PostRepository.TABLE_POSTS).insert(postDB);
  };

  public getPostsWithCreatorName = async (): Promise<
    PostDBWithCreatorName[]
  > => {
    const result = await BaseRepository.connection(PostRepository.TABLE_POSTS)
      .select(
        `${PostRepository.TABLE_POSTS}.id`,
        `${PostRepository.TABLE_POSTS}.creator_id`,
        `${PostRepository.TABLE_POSTS}.content`,
        `${PostRepository.TABLE_POSTS}.likes`,
        `${PostRepository.TABLE_POSTS}.dislikes`,
        `${PostRepository.TABLE_POSTS}.created_at`,
        `${PostRepository.TABLE_POSTS}.updated_at`,
        `${UserRepository.TABLE_USERS}.nickname as creator_nickname`
      )
      .join(
        `${UserRepository.TABLE_USERS}`,
        `${PostRepository.TABLE_POSTS}.creator_id`,
        "=",
        `${UserRepository.TABLE_USERS}.id`
      );

    return result as PostDBWithCreatorName[];
  };

  public getPostsWithCreatorNameByNickname = async (
    nickname: string
  ): Promise<PostDBWithCreatorName[]> => {
    const result = await BaseRepository.connection(PostRepository.TABLE_POSTS)
      .select(
        `${PostRepository.TABLE_POSTS}.id`,
        `${PostRepository.TABLE_POSTS}.creator_id`,
        `${PostRepository.TABLE_POSTS}.content`,
        `${PostRepository.TABLE_POSTS}.likes`,
        `${PostRepository.TABLE_POSTS}.dislikes`,
        `${PostRepository.TABLE_POSTS}.created_at`,
        `${PostRepository.TABLE_POSTS}.updated_at`,
        `${UserRepository.TABLE_USERS}.nickname as creator_nickname`
      )
      .where({ creator_nickname: nickname })
      .join(
        `${UserRepository.TABLE_USERS}`,
        `${PostRepository.TABLE_POSTS}.creator_id`,
        "=",
        `${UserRepository.TABLE_USERS}.id`
      );

    return result as PostDBWithCreatorName[];
  };

  public findPostById = async (id: string): Promise<PostDB | undefined> => {
    const [result] = await BaseRepository.connection(PostRepository.TABLE_POSTS)
      .select()
      .where({ id });

    return result as PostDB | undefined;
  };

  public findPostByContent = async (
    content: string,
    creatorId: string
  ): Promise<PostDB | undefined> => {
    const [result] = await BaseRepository.connection(PostRepository.TABLE_POSTS)
      .select()
      .where({ content, creator_id: creatorId });

    return result as PostDB | undefined;
  };

  public updatePost = async (postDB: PostDB): Promise<void> => {
    await BaseRepository.connection(PostRepository.TABLE_POSTS)
      .update(postDB)
      .where({ id: postDB.id });
  };

  public deletePostById = async (id: string): Promise<void> => {
    await BaseRepository.connection(PostRepository.TABLE_POSTS)
      .delete()
      .where({ id });
  };

  public findPostWithCreatorNameById = async (
    id: string
  ): Promise<PostDBWithCreatorName | undefined> => {
    const [result] = await BaseRepository.connection(PostRepository.TABLE_POSTS)
      .select(
        `${PostRepository.TABLE_POSTS}.id`,
        `${PostRepository.TABLE_POSTS}.creator_id`,
        `${PostRepository.TABLE_POSTS}.content`,
        `${PostRepository.TABLE_POSTS}.likes`,
        `${PostRepository.TABLE_POSTS}.dislikes`,
        `${PostRepository.TABLE_POSTS}.created_at`,
        `${PostRepository.TABLE_POSTS}.updated_at`,
        `${UserRepository.TABLE_USERS}.nickname as creator_nickname`
      )
      .join(
        `${UserRepository.TABLE_USERS}`,
        `${PostRepository.TABLE_POSTS}.creator_id`,
        "=",
        `${UserRepository.TABLE_USERS}.id`
      )
      .where({ [`${PostRepository.TABLE_POSTS}.id`]: id });

    return result as PostDBWithCreatorName | undefined;
  };

  public findLikeDislike = async (
    likeDislikeDB: LikeDislikeDB
  ): Promise<POST_LIKE | undefined> => {
    const [result]: Array<LikeDislikeDB | undefined> =
      await BaseRepository.connection(PostRepository.TABLE_LIKES_DISLIKES_POSTS)
        .select()
        .where({
          user_id: likeDislikeDB.user_id,
          post_id: likeDislikeDB.post_id,
        });

    if (result === undefined) {
      return undefined;
    } else if (result.like === 1) {
      return POST_LIKE.LIKED;
    } else {
      return POST_LIKE.DISLIKED;
    }
  };

  public removeLikeDislike = async (
    likeDislikeDB: LikeDislikeDB
  ): Promise<void> => {
    await BaseRepository.connection(PostRepository.TABLE_LIKES_DISLIKES_POSTS)
      .delete()
      .where({
        user_id: likeDislikeDB.user_id,
        post_id: likeDislikeDB.post_id,
      });
  };

  public updateLikeDislike = async (
    likeDislikeDB: LikeDislikeDB
  ): Promise<void> => {
    await BaseRepository.connection(PostRepository.TABLE_LIKES_DISLIKES_POSTS)
      .update(likeDislikeDB)
      .where({
        user_id: likeDislikeDB.user_id,
        post_id: likeDislikeDB.post_id,
      });
  };

  public insertLikeDislike = async (
    likeDislikeDB: LikeDislikeDB
  ): Promise<void> => {
    await BaseRepository.connection(
      PostRepository.TABLE_LIKES_DISLIKES_POSTS
    ).insert(likeDislikeDB);
  };

  public getPostsLikeDeslike = async (): Promise<LikeDislikeDB[]> => {
    const result = await BaseRepository.connection(
      PostRepository.TABLE_LIKES_DISLIKES_POSTS
    );
    return result as LikeDislikeDB[];
  };
}
