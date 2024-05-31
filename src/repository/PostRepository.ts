import { PostDB } from "../model/Post/PostInterface";
import { BaseRepository } from "./BaseRepository";

export class PostRepository extends BaseRepository {
  private static POST_TABLE = "post";

  public createPost = async (post: PostDB): Promise <void> => {
    await BaseRepository
      .connection(PostRepository.POST_TABLE)
      .insert(post);
  }

  public findAllPosts = async (): Promise <PostDB[]> => {
    const result: PostDB[] = await BaseRepository
      .connection(PostRepository.POST_TABLE);
    return result;
  }

  public findPostById = async (id: string): Promise <PostDB[]> => {
    const result: PostDB[] = await BaseRepository
      .connection(PostRepository.POST_TABLE)
      .where({ id });
    return result;
  }

  public updatePost = async (post: PostDB, id: string): Promise <any> => {
    await BaseRepository
      .connection(PostRepository.POST_TABLE)
      .update(post)
      .where({ id });
  }

  public deletePost = async (id: string): Promise <any> => {
    await BaseRepository
      .connection(PostRepository.POST_TABLE)
      .del()
      .where({ id });
  }
}