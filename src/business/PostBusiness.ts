import { CreatePostInputDTO, CreatePostOutputDTO } from "../dtos/post/createPost.dto";
import { DeletePostInputDTO, DeletePostOutputDTO } from "../dtos/post/deletePost.dto";
import { GetPostsInputDTO, GetPostsOutputDTO } from "../dtos/post/getPosts.dto";
import { GetPostsByUserNicknameInputDTO, GetPostsByUserNicknameOutputDTO } from "../dtos/post/getPostsByUserNickname.dto";
import { GetPostsLikesDislikesInputDTO, GetPostsLikesDislikesOutputDTO } from "../dtos/post/getPostsLikesDislikes.dto";
import { LikeOrDislikePostInputDTO, LikeOrDislikePostOutputDTO } from "../dtos/post/likeOrDislikePost.dto";
import { UpdatePostInputDTO, UpdatePostOutputDTO } from "../dtos/post/updatePost.dto";
import { ConflictError } from "../errors/ConflictError";
import { ForbiddenError } from "../errors/ForbiddenError";
import { NotFoundError } from "../errors/NotFoundError";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { LikeDislikeDB, Post, POST_LIKE, PostLikeDislike } from "../model/Post";
import { USER_ROLES } from "../model/User";
import { PostRepository } from "../repository/PostRepository";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export class PostBusiness {
  constructor(
    private postRepository: PostRepository,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager
  ) { }

  //#region createPost
  public createPost = async (input: CreatePostInputDTO): Promise<CreatePostOutputDTO> => {
    const { token, content } = input;

    const payload = this.tokenManager.getPayload(token);
    if (!payload) {
      throw new UnauthorizedError();
    }

    const contentDB = await this.postRepository.findPostByContent(content, payload.id);
    if (contentDB) {
      throw new ConflictError("Já existe um 'post' com esse conteúdo!");
    }

    const id = this.idGenerator.gerate();

    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    const second = String(date.getSeconds()).padStart(2, "0");

    const dateString = `${year}-${month}-${day} ${hour}:${minute}:${second}`;

    const post = new Post(
      id,
      content,
      0,
      0,
      dateString,
      dateString,
      payload.id,
      payload.nickname
    );

    const postDB = post.toDBModel();
    await this.postRepository.createPost(postDB);

    const output: CreatePostOutputDTO = {
      message: "Post criado com sucesso!"
    };

    return output;
  };
  //#endregion createPost

  //#region getPosts
  public getPosts = async (input: GetPostsInputDTO): Promise<GetPostsOutputDTO> => {
    const { token } = input;

    const payload = this.tokenManager.getPayload(token);
    if (!payload) {
      throw new UnauthorizedError();
    }

    const postsDBWithCreatorName = await this.postRepository.getPostsWithCreatorName();
    const posts = postsDBWithCreatorName.map((element) => {
      const post = new Post(
        element.id,
        element.content,
        element.likes,
        element.dislikes,
        element.created_at,
        element.updated_at,
        element.creator_id,
        element.creator_nickname
      );
      return post.toBusinessModel();
    });

    const output: GetPostsOutputDTO = posts;

    return output;
  };
  //#endregion getPosts

  //#region getPostsByUserNickname
  public getPostosByUserNickname = async (input: GetPostsByUserNicknameInputDTO): Promise<GetPostsByUserNicknameOutputDTO> => {
    const { nickname, token } = input;

    const payload = this.tokenManager.getPayload(token);
    if (!payload) {
      throw new UnauthorizedError();
    }

    const postsDBWithCreatorName = await this.postRepository.getPostsWithCreatorNameByNickname(nickname);
    const posts = postsDBWithCreatorName.map((element) => {
      const post = new Post(
        element.id,
        element.content,
        element.likes,
        element.dislikes,
        element.created_at,
        element.updated_at,
        element.creator_id,
        element.creator_nickname
      );
      if (payload.role !== USER_ROLES.ADMIN) {
        if (payload.id !== element.creator_id) {
          throw new ForbiddenError(
            "Somente admin e o próprio usuário podem acessar esse endpoint!"
          );
        }
      }
      return post.toBusinessModel();
    });
    const output: GetPostsByUserNicknameOutputDTO = posts;

    return output;
  };
  //#endregion getPostsByUserNickname

  //#region updatePost
  public updatePost = async (input: UpdatePostInputDTO): Promise<UpdatePostOutputDTO> => {
    const { idToEdit, token, content } = input;

    const payload = this.tokenManager.getPayload(token);
    if (!payload) {
      throw new UnauthorizedError();
    }

    const postDB = await this.postRepository.findPostById(idToEdit);
    if (!postDB) {
      throw new NotFoundError("'post' com essa id não existe!");
    }
    if (payload.id !== postDB.creator_id) {
      throw new ForbiddenError("Somente quem criou o 'post' pode editar!");
    }

    const contentDB = await this.postRepository.findPostByContent(content, postDB.creator_id);
    if (contentDB) {
      throw new ConflictError("Já existe um 'post' com esse conteúdo!");
    }

    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    const second = String(date.getSeconds()).padStart(2, "0");
    const dateString = `${year}-${month}-${day} ${hour}:${minute}:${second}`;

    const post = new Post(
      postDB.id,
      postDB.content,
      postDB.likes,
      postDB.dislikes,
      postDB.created_at,
      postDB.updated_at,
      postDB.creator_id,
      payload.nickname
    );
    post.setContent = content;
    post.setUpdatedAt = dateString;

    const updatedPostDB = post.toDBModel();
    await this.postRepository.updatePost(updatedPostDB);

    const output: UpdatePostOutputDTO = {
      message: "'post' editado com sucesso!",
    };

    return output;
  };
  //#endregion updatePost

  //#region deletePost
  public deletePost = async (input: DeletePostInputDTO): Promise<DeletePostOutputDTO> => {
    const { idToDelete, token } = input;

    const payload = this.tokenManager.getPayload(token);
    if (!payload) {
      throw new UnauthorizedError();
    }

    const postDB = await this.postRepository.findPostById(idToDelete);
    if (!postDB) {
      throw new NotFoundError("'post' com essa id não existe!");
    }
    if (payload.role !== USER_ROLES.ADMIN) {
      if (payload.id !== postDB.creator_id) {
        throw new ForbiddenError("Somente quem criou o 'post' pode deletar!");
      }
    }

    await this.postRepository.deletePostById(idToDelete);

    const output: DeletePostOutputDTO = {
      message: "'post' deletado com sucesso!",
    };

    return output;
  };
  //#endregion deletePost

  //#region likeOrDislikePost
  public likeOrDislikePost = async (input: LikeOrDislikePostInputDTO): Promise<LikeOrDislikePostOutputDTO> => {
    const { postId, token, like } = input;

    const payload = this.tokenManager.getPayload(token);
    if (!payload) {
      throw new UnauthorizedError();
    }

    const postDBWithCreatorName = await this.postRepository.findPostWithCreatorNameById(postId);
    if (!postDBWithCreatorName) {
      throw new NotFoundError("post com essa id não existe");
    }
    if (payload && payload.id === postDBWithCreatorName.creator_id) {
      throw new ConflictError(
        "Você não pode dar like ou deslike no 'post' que você criou!"
      );
    }

    const post = new Post(
      postDBWithCreatorName.id,
      postDBWithCreatorName.content,
      postDBWithCreatorName.likes,
      postDBWithCreatorName.dislikes,
      postDBWithCreatorName.created_at,
      postDBWithCreatorName.updated_at,
      postDBWithCreatorName.creator_id,
      postDBWithCreatorName.creator_nickname
    );

    const likeSQlite = like ? 1 : 0;

    const likeDislikeDB: LikeDislikeDB = {
      user_id: payload.id,
      post_id: postId,
      like: likeSQlite,
    };

    const likeDislikeExists = await this.postRepository.findLikeDislike(likeDislikeDB);

    if (likeDislikeExists === POST_LIKE.LIKED) {
      if (like) {
        await this.postRepository.removeLikeDislike(likeDislikeDB);
        post.removeLike();
      } else {
        await this.postRepository.updateLikeDislike(likeDislikeDB);
        post.removeLike();
        post.addDislike();
      }
    } else if (likeDislikeExists === POST_LIKE.DISLIKED) {
      if (!like) {
        await this.postRepository.removeLikeDislike(likeDislikeDB);
        post.removeDislike();
      } else {
        await this.postRepository.updateLikeDislike(likeDislikeDB);
        post.removeDislike();
        post.addLike();
      }
    } else {
      await this.postRepository.insertLikeDislike(likeDislikeDB);
      like ? post.addLike() : post.addDislike();
    }

    const updatedPostDB = post.toDBModel();
    await this.postRepository.updatePost(updatedPostDB);

    const output: LikeOrDislikePostOutputDTO = undefined;

    return output;
  };
  //#endregion likeOrDislikePost

  //#region getPostsLikesDislikes
  public getPostsLikesDislikes = async (input: GetPostsLikesDislikesInputDTO): Promise<GetPostsLikesDislikesOutputDTO> => {
    const { token } = input;

    const payload = this.tokenManager.getPayload(token);
    if (!payload) {
      throw new UnauthorizedError();
    }

    const posts = await this.postRepository.getPostsLikeDeslike();

    const postsLikeDislike = posts.map((element) => {
      const postLikeDislike = new PostLikeDislike(
        element.user_id,
        element.post_id,
        element.like
      );
      return postLikeDislike.toBusinessModel();
    });

    const output: GetPostsLikesDislikesOutputDTO = postsLikeDislike;

    return output;
  }
  //#endregion getPostsLikesDislikes
}