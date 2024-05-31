import {
  COMMENT_LIKE,
  CommentDB,
  CommentDBWithCreatorName,
  LikeDislikeDB,
} from "../model/Comment";
import { PostDB } from "../model/Post";
import { BaseRepository } from "./BaseRepository";
import { PostRepository } from "./PostRepository";
import { UserRepository } from "./UserRepository";


export class CommentRepository extends BaseRepository {
  public static TABLE_COMMENTS = "comments";
  public static TABLE_LIKES_DISLIKES_COMMENTS = "likes_dislikes_comments";
  public static TABLE_POSTS = "posts";

  public findPostById = async (id: string): Promise<PostDB | undefined> => {
    const [result] = await BaseRepository.connection(PostRepository.TABLE_POSTS)
      .select()
      .where({ id });

    return result as PostDB | undefined;
  };

  public insertComment = async (commentDB: CommentDB): Promise<void> => {
    await BaseRepository.connection(CommentRepository.TABLE_COMMENTS).insert(
      commentDB
    );
  };

  public getCommentsWithCreatorName = async (): Promise<
    CommentDBWithCreatorName[]
  > => {
    const result = await BaseRepository.connection(CommentRepository.TABLE_COMMENTS)
      .select(
        `${CommentRepository.TABLE_COMMENTS}.id`,
        `${CommentRepository.TABLE_COMMENTS}.creator_id`,
        `${CommentRepository.TABLE_COMMENTS}.post_id`,
        `${CommentRepository.TABLE_COMMENTS}.content`,
        `${CommentRepository.TABLE_COMMENTS}.likes`,
        `${CommentRepository.TABLE_COMMENTS}.dislikes`,
        `${CommentRepository.TABLE_COMMENTS}.created_at`,
        `${CommentRepository.TABLE_COMMENTS}.updated_at`,
        `${UserRepository.TABLE_USERS}.nickname as creator_nickname`,
        `${UserRepository.TABLE_USERS}.avatar as creator_avatar`
      )
      .join(
        `${UserRepository.TABLE_USERS}`,
        `${CommentRepository.TABLE_COMMENTS}.creator_id`,
        "=",
        `${UserRepository.TABLE_USERS}.id`
      );

    return result as CommentDBWithCreatorName[];
  };

  public getCommentsWithCreatorNameByNickname = async (
    nickname: string
  ): Promise<CommentDBWithCreatorName[]> => {
    const result = await BaseRepository.connection(CommentRepository.TABLE_COMMENTS)
      .select(
        `${CommentRepository.TABLE_COMMENTS}.id`,
        `${CommentRepository.TABLE_COMMENTS}.creator_id`,
        `${CommentRepository.TABLE_COMMENTS}.post_id`,
        `${CommentRepository.TABLE_COMMENTS}.content`,
        `${CommentRepository.TABLE_COMMENTS}.likes`,
        `${CommentRepository.TABLE_COMMENTS}.dislikes`,
        `${CommentRepository.TABLE_COMMENTS}.created_at`,
        `${CommentRepository.TABLE_COMMENTS}.updated_at`,
        `${UserRepository.TABLE_USERS}.nickname as creator_nickname`,
        `${UserRepository.TABLE_USERS}.avatar as creator_avatar`
      )
      .where(`${UserRepository.TABLE_USERS}.nickname`, nickname)
      .join(
        `${UserRepository.TABLE_USERS}`,
        `${CommentRepository.TABLE_COMMENTS}.creator_id`,
        "=",
        `${UserRepository.TABLE_USERS}.id`
      );

    return result as CommentDBWithCreatorName[];
  };

  public getCommentsWithCreatorNameById = async (
    postId: string
  ): Promise<CommentDBWithCreatorName[]> => {
    const result = await BaseRepository.connection(CommentRepository.TABLE_COMMENTS)
      .select(
        `${CommentRepository.TABLE_COMMENTS}.id`,
        `${CommentRepository.TABLE_COMMENTS}.creator_id`,
        `${CommentRepository.TABLE_COMMENTS}.post_id`,
        `${CommentRepository.TABLE_COMMENTS}.content`,
        `${CommentRepository.TABLE_COMMENTS}.likes`,
        `${CommentRepository.TABLE_COMMENTS}.dislikes`,
        `${CommentRepository.TABLE_COMMENTS}.created_at`,
        `${CommentRepository.TABLE_COMMENTS}.updated_at`,
        `${UserRepository.TABLE_USERS}.nickname as creator_nickname`,
        `${UserRepository.TABLE_USERS}.avatar as creator_avatar`
      )
      .where({ post_id: postId })
      .join(
        `${UserRepository.TABLE_USERS}`,
        `${CommentRepository.TABLE_COMMENTS}.creator_id`,
        "=",
        `${UserRepository.TABLE_USERS}.id`
      );

    return result as CommentDBWithCreatorName[];
  };

  public findCommentById = async (
    id: string
  ): Promise<CommentDB | undefined> => {
    const [result] = await BaseRepository.connection(
      CommentRepository.TABLE_COMMENTS
    )
      .select()
      .where({ id });

    return result as CommentDB | undefined;
  };

  public findCommentByContent = async (
    content: string,
    creatorId: string
  ): Promise<CommentDB | undefined> => {
    const [result] = await BaseRepository.connection(
      CommentRepository.TABLE_COMMENTS
    )
      .select()
      .where({ content, creator_id: creatorId });

    return result as CommentDB | undefined;
  };

  public updateComment = async (commentDB: CommentDB): Promise<void> => {
    await BaseRepository.connection(CommentRepository.TABLE_COMMENTS)
      .update(commentDB)
      .where({ id: commentDB.id });
  };

  public deleteCommentById = async (id: string): Promise<void> => {
    await BaseRepository.connection(CommentRepository.TABLE_COMMENTS)
      .delete()
      .where({ id });
  };

  public findCommentWithCreatorNameById = async (
    id: string
  ): Promise<CommentDBWithCreatorName | undefined> => {
    const [result] = await BaseRepository.connection(
      CommentRepository.TABLE_COMMENTS
    )
      .select(
        `${CommentRepository.TABLE_COMMENTS}.id`,
        `${CommentRepository.TABLE_COMMENTS}.creator_id`,
        `${CommentRepository.TABLE_COMMENTS}.post_id`,
        `${CommentRepository.TABLE_COMMENTS}.content`,
        `${CommentRepository.TABLE_COMMENTS}.likes`,
        `${CommentRepository.TABLE_COMMENTS}.dislikes`,
        `${CommentRepository.TABLE_COMMENTS}.created_at`,
        `${CommentRepository.TABLE_COMMENTS}.updated_at`,
        `${UserRepository.TABLE_USERS}.nickname as creator_nickname`,
        `${UserRepository.TABLE_USERS}.avatar as creator_avatar`
      )
      .join(
        `${UserRepository.TABLE_USERS}`,
        `${CommentRepository.TABLE_COMMENTS}.creator_id`,
        "=",
        `${UserRepository.TABLE_USERS}.id`
      )
      .where({ [`${CommentRepository.TABLE_COMMENTS}.id`]: id });

    return result as CommentDBWithCreatorName | undefined;
  };

  public findLikeDislike = async (
    likeDislikeDB: LikeDislikeDB
  ): Promise<COMMENT_LIKE | undefined> => {
    const [result]: Array<LikeDislikeDB | undefined> =
      await BaseRepository.connection(
        CommentRepository.TABLE_LIKES_DISLIKES_COMMENTS
      )
        .select()
        .where({
          user_id: likeDislikeDB.user_id,
          comment_id: likeDislikeDB.comment_id,
        });

    if (result === undefined) {
      return undefined;
    } else if (result.like === 1) {
      return COMMENT_LIKE.LIKED;
    } else {
      return COMMENT_LIKE.DISLIKED;
    }
  };

  public removeLikeDislike = async (
    likeDislikeDB: LikeDislikeDB
  ): Promise<void> => {
    await BaseRepository.connection(CommentRepository.TABLE_LIKES_DISLIKES_COMMENTS)
      .delete()
      .where({
        user_id: likeDislikeDB.user_id,
        comment_id: likeDislikeDB.comment_id,
      });
  };

  public updateLikeDislike = async (
    likeDislikeDB: LikeDislikeDB
  ): Promise<void> => {
    await BaseRepository.connection(CommentRepository.TABLE_LIKES_DISLIKES_COMMENTS)
      .update(likeDislikeDB)
      .where({
        user_id: likeDislikeDB.user_id,
        comment_id: likeDislikeDB.comment_id,
      });
  };

  public insertLikeDislike = async (
    likeDislikeDB: LikeDislikeDB
  ): Promise<void> => {
    await BaseRepository.connection(
      CommentRepository.TABLE_LIKES_DISLIKES_COMMENTS
    ).insert(likeDislikeDB);
  };

  public getCommentsLikeDeslike = async (): Promise<LikeDislikeDB[]> => {
    const result = await BaseRepository.connection(
      CommentRepository.TABLE_LIKES_DISLIKES_COMMENTS
    );
    return result as LikeDislikeDB[];
  };
}
