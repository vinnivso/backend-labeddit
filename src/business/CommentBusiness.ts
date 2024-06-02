import { CreateCommentInputDTO, CreateCommentOutputDTO } from "../dtos/comment/createComment.dto";
import { DeleteCommentInputDTO, DeleteCommentOutputDTO } from "../dtos/comment/deleteComment.dto";
import { GetCommentsInputDTO, GetCommentsOutputDTO } from "../dtos/comment/getComments.dto";
import { GetCommentsByPostInputDTO, GetCommentsByPostOutputDTO } from "../dtos/comment/getCommentsByPost.dto";
import { GetCommentsByUserNicknameInputDTO, GetCommentsByUserNicknameOutputDTO } from "../dtos/comment/getCommentsByUserNickname.dto";
import { GetCommentsLikesDislikesInputDTO, GetCommentsLikesDislikesOutputDTO } from "../dtos/comment/getCommentsLikesDislikes.dto";
import { LikeOrDislikeCommentInputDTO, LikeOrDislikeCommentOutputDTO } from "../dtos/comment/likeOrDislikeComment.dto";
import { UpdateCommentInputDTO, UpdateCommentOutputDTO } from "../dtos/comment/updateComment.dto";
import { ConflictError } from "../errors/ConflictError";
import { ForbiddenError } from "../errors/ForbiddenError";
import { NotFoundError } from "../errors/NotFoundError";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { Comment, COMMENT_LIKE, CommentLikeDislike, LikeDislikeDB } from "../model/Comment";
import { USER_ROLES } from "../model/User";
import { CommentRepository } from "../repository/CommentRepository";
import { UserRepository } from "../repository/UserRepository";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export class CommentBusiness {
  constructor(
    private userRepository: UserRepository,
    private commentRepository: CommentRepository,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager
  ) { }

  //#region createComment
  public createComment = async (input: CreateCommentInputDTO): Promise<CreateCommentOutputDTO> => {
    const { postId, token, content } = input

    const payload = this.tokenManager.getPayload(token);
    if (!payload) {
      throw new Error("Unauthorized");
    }

    const postDB = await this.commentRepository.findPostById(postId);
    if (!postDB) {
      throw new Error("Post not found");
    }

    const id = this.idGenerator.generate();

    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    const second = String(date.getSeconds()).padStart(2, "0");

    const dateString = `${year}-${month}-${day} ${hour}:${minute}:${second}`;

    const user = await this.userRepository.findUserByNickname(payload.nickname);
    if (user) {
      const comment = new Comment(
        id,
        postId,
        content,
        0,
        0,
        dateString,
        dateString,
        payload.id,
        payload.nickname,
        user.avatar
      );
      const commentDB = comment.toDBModel();
      await this.commentRepository.createComment(commentDB);
    }

    const output: CreateCommentOutputDTO = {
      message: "Comentário criado com sucesso!",
    };

    return output;
  }
  //#endregion createComment

  //#region getComments
  public getComments = async (input: GetCommentsInputDTO): Promise<GetCommentsOutputDTO> => {
    const { token } = input

    const payload = this.tokenManager.getPayload(token);
    if (!payload) {
      throw new Error("Unauthorized");
    }

    const commentsDBwithCreatorName = await this.commentRepository.getCommentsWithCreatorName();

    const comments = commentsDBwithCreatorName.map((element) => {
      const comment = new Comment(
        element.id,
        element.post_id,
        element.content,
        element.likes,
        element.dislikes,
        element.created_at,
        element.updated_at,
        element.creator_id,
        element.creator_nickname,
        element.creator_avatar
      );
      return comment.toBusinessModel();
    });

    const output: GetCommentsOutputDTO = comments;

    return output;
  }
  //#endregion getComments

  //#region getCommentsByUserNickname
  public getCommentsByUserNickname = async (input: GetCommentsByUserNicknameInputDTO): Promise<GetCommentsByUserNicknameOutputDTO> => {
    const { nickname, token } = input

    const payload = this.tokenManager.getPayload(token);
    if (!payload) {
      throw new UnauthorizedError();
    }

    const commentsDBwithCreatorName = await this.commentRepository.getCommentsWithCreatorNameByNickname(nickname);

    const comments = commentsDBwithCreatorName.map((element) => {
      const comment = new Comment(
        element.id,
        element.post_id,
        element.content,
        element.likes,
        element.dislikes,
        element.created_at,
        element.updated_at,
        element.creator_id,
        element.creator_nickname,
        element.creator_avatar
      );
      if (payload.role !== USER_ROLES.ADMIN) {
        if (payload.id !== element.creator_id) {
          throw new ForbiddenError(
            "Somente admin e o próprio usuário podem acessar esse endpoint!"
          );
        }
      }
      return comment.toBusinessModel();
    });
    const output: GetCommentsByUserNicknameOutputDTO = comments;

    return output;
  }
  //#endregion getCommentsByUserNickname

  //#region getCommentsByPost
  public getCommentsByPost = async (input: GetCommentsByPostInputDTO): Promise<GetCommentsByPostOutputDTO> => {
    const { postId, token } = input

    const payload = this.tokenManager.getPayload(token);
    if (!payload) {
      throw new UnauthorizedError();
    }

    const postDB = await this.commentRepository.findPostById(postId);
    if (!postDB) {
      throw new NotFoundError("'post' com essa id não existe!");
    }

    const commentsDBwithCreatorName =
      await this.commentRepository.getCommentsWithCreatorNameById(postDB.id);

    const comments = commentsDBwithCreatorName.map((element) => {
      const comment = new Comment(
        element.id,
        element.post_id,
        element.content,
        element.likes,
        element.dislikes,
        element.created_at,
        element.updated_at,
        element.creator_id,
        element.creator_nickname,
        element.creator_avatar
      );
      return comment.toBusinessModel();
    });

    const output: GetCommentsByPostOutputDTO = comments;

    return output;
  }
  //#endregion getCommentsByPost

  //#region updateComment
  public updateComment = async (input: UpdateCommentInputDTO): Promise<UpdateCommentOutputDTO> => {
    const { idToEdit, token, content } = input;

    const payload = this.tokenManager.getPayload(token);
    if (!payload) {
      throw new UnauthorizedError();
    }

    const commentDB = await this.commentRepository.findCommentById(idToEdit);
    if (!commentDB) {
      throw new NotFoundError("'comment' com essa id não existe!");
    }
    if (payload.id !== commentDB.creator_id) {
      throw new ForbiddenError("Somente quem criou o 'comment' pode editá-la!");
    }

    const contentDB = await this.commentRepository.findCommentByContent(content,commentDB.creator_id);
    if (contentDB) {
      throw new ConflictError("Já existe um 'comment' com esse conteúdo!");
    }

    const [creatorAvatar] = await this.commentRepository.getCommentsWithCreatorNameById(commentDB.creator_id);

    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    const second = String(date.getSeconds()).padStart(2, "0");
    const dateString = `${year}-${month}-${day} ${hour}:${minute}:${second}`;

    const comment = new Comment(
      commentDB.id,
      commentDB.post_id,
      commentDB.content,
      commentDB.likes,
      commentDB.dislikes,
      commentDB.created_at,
      commentDB.updated_at,
      commentDB.creator_id,
      payload.nickname,
      creatorAvatar?.creator_avatar || ""
    );

    comment.setContent = content;
    comment.setUpdatedAt = dateString;

    const updatedCommentDB = comment.toDBModel();
    await this.commentRepository.updateComment(updatedCommentDB);

    const output: UpdateCommentOutputDTO = {
      message: "'comment' editado com sucesso!",
    };

    return output;
  }
  //#endregion updateComment

  //#region deleteComment
  public deleteComment = async (input: DeleteCommentInputDTO): Promise<DeleteCommentOutputDTO> => {
    const { idToDelete, token } = input;

    const payload = this.tokenManager.getPayload(token);
    if (!payload) {
      throw new UnauthorizedError();
    }

    const commentDB = await this.commentRepository.findCommentById(idToDelete);
    if (!commentDB) {
      throw new NotFoundError("'comment' com essa id não existe!");
    }
    if (payload.role !== USER_ROLES.ADMIN) {
      if (payload.id !== commentDB.creator_id) {
        throw new ForbiddenError(
          "Somente quem criou o 'comment' pode deletar!"
        );
      }
    }

    await this.commentRepository.deleteCommentById(idToDelete);

    const output: DeleteCommentOutputDTO = {
      message: "'comment' deletado com sucesso!",
    };

    return output;
  }
  //#endregion deleteComment

  //#region likeOrDislikeComment
  public likeOrDislikeComment = async (input: LikeOrDislikeCommentInputDTO): Promise<LikeOrDislikeCommentOutputDTO> => {
    const { commentId, token, like } = input;

    const payload = this.tokenManager.getPayload(token);
    if (!payload) {
      throw new UnauthorizedError();
    }

    const commentDBWithCreatorName =
      await this.commentRepository.findCommentWithCreatorNameById(commentId);
    if (!commentDBWithCreatorName) {
      throw new NotFoundError("comment com essa id não existe");
    }
    if (payload && payload.id === commentDBWithCreatorName.creator_id) {
      throw new ConflictError(
        "Você não pode dar like ou deslike no 'comment' que você criou!"
      );
    }

    const comment = new Comment(
      commentDBWithCreatorName.id,
      commentDBWithCreatorName.post_id,
      commentDBWithCreatorName.content,
      commentDBWithCreatorName.likes,
      commentDBWithCreatorName.dislikes,
      commentDBWithCreatorName.created_at,
      commentDBWithCreatorName.updated_at,
      commentDBWithCreatorName.creator_id,
      commentDBWithCreatorName.creator_nickname,
      commentDBWithCreatorName.creator_avatar
    );

    const likeSQlite = like ? 1 : 0;

    const likeDislikeDB: LikeDislikeDB = {
      user_id: payload.id,
      comment_id: commentId,
      like: likeSQlite,
    };

    const likeDislikeExists = await this.commentRepository.findLikeDislike(
      likeDislikeDB
    );

    if (likeDislikeExists === COMMENT_LIKE.LIKED) {
      if (like) {
        await this.commentRepository.removeLikeDislike(likeDislikeDB);
        comment.removeLike();
      } else {
        await this.commentRepository.updateLikeDislike(likeDislikeDB);
        comment.removeLike();
        comment.addDislike();
      }
    } else if (likeDislikeExists === COMMENT_LIKE.DISLIKED) {
      if (!like) {
        await this.commentRepository.removeLikeDislike(likeDislikeDB);
        comment.removeDislike();
      } else {
        await this.commentRepository.updateLikeDislike(likeDislikeDB);
        comment.removeDislike();
        comment.addLike();
      }
    } else {
      await this.commentRepository.insertLikeDislike(likeDislikeDB);
      like ? comment.addLike() : comment.addDislike();
    }

    const updatedCommentDB = comment.toDBModel();
    await this.commentRepository.updateComment(updatedCommentDB);

    const output: LikeOrDislikeCommentOutputDTO = undefined;

    return output;

  }
  //#endregion likeOrDislikeComment

  //#region getCommentsLikesDislikes
  public getCommentsLikesDislikes = async (input: GetCommentsLikesDislikesInputDTO): Promise<GetCommentsLikesDislikesOutputDTO> => {
    const { token } = input;

    const payload = this.tokenManager.getPayload(token);
    if (!payload) {
      throw new UnauthorizedError();
    }

    const comments = await this.commentRepository.getCommentsLikeDeslike();

    const commentsLikeDislike = comments.map((element) => {
      const commentLikeDislike = new CommentLikeDislike(
        element.user_id,
        element.comment_id,
        element.like
      );

      return commentLikeDislike.toBusinessModel();
    });

    const output: GetCommentsLikesDislikesOutputDTO = commentsLikeDislike;

    return output;
  }
  //#endregion getCommentsLikesDislikes
}