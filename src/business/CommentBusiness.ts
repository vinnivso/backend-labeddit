import { CreateCommentInputDTO, CreateCommentOutputDTO } from "../dtos/comment/createComment.dto";
import { GetCommentsInputDTO, GetCommentsOutputDTO } from "../dtos/comment/getComments.dto";
import { Comment } from "../model/Comment";
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
}