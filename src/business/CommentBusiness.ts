import { BadRequestError } from "../customErrors/BadRequestError";
import { NotFoundError } from "../customErrors/NotFoundError";
import { CreateCommentInputDTO, CreateCommentOutputDTO } from "../dtos/comment/createComment.dto";
import { Comment } from "../model/Comment/Comment";
import { CommentRepository } from "../repository/CommentRepository";
import { LikeDislikeCommentRepository } from "../repository/LikeDislikeCommentRepository";
import { PostRepository } from "../repository/PostRepository";
import { IdGerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export class CommentBusiness {
  constructor(
    private postRepository: PostRepository,
    private commentRepository: CommentRepository,
    private likeDislikeCommentRepository: LikeDislikeCommentRepository,
    private tokenManager: TokenManager,
    private idGenerator: IdGerator
  ) { }

  public createComment = async (input: CreateCommentInputDTO): Promise<CreateCommentOutputDTO> => {
    const { token, content, idPost } = input;
    const tokenPayload = this.tokenManager.getPayload(token)
    if (!tokenPayload) {
      throw new NotFoundError("User dont exist")
    }

    const [postDB] = await this.postRepository.findPostById(idPost)
    if (!postDB) {
      throw new NotFoundError("Post dont exist")
    }

    if (postDB.creator_id === tokenPayload.id) {
      throw new BadRequestError("You can't comment on your post")
    }

    const id = this.idGenerator.gerate()
    const newComment = new Comment(
      id,
      postDB.id,
      content,
      0,
      0,
      new Date().toISOString(),
      "",
      {
        id: tokenPayload.id,
        name: tokenPayload.name,
      }
    )
    const newCommentDB = newComment.toDBModel()
    await this.commentRepository.createComment(newCommentDB)
    const response: CreateCommentOutputDTO = {
      message: "Comment created successfully"
    }
    return response
  };






}