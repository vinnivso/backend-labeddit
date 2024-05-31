import { UserDB } from "../model/User/UserInterface";
import { BaseRepository } from "./BaseRepository";

export class UserRepository extends BaseRepository {
  private static USERS_TABLE = "users";

  public createUser = async (user: UserDB): Promise <void> => {
    await BaseRepository
      .connection(UserRepository.USERS_TABLE)
      .insert(user);
  }

  public findUserById = async (id: string): Promise <UserDB[]> => {
    const result: UserDB[] = await BaseRepository
      .connection(UserRepository.USERS_TABLE)
      .where({ id });
    return result;
  }

  public findUserByEmail = async (email: string): Promise <UserDB[]> => {
    const result: UserDB[] = await BaseRepository
      .connection(UserRepository.USERS_TABLE)
      .where({ email });
    return result;
  }

  public updateUser = async (user: UserDB, id: string): Promise <void> => {
    await BaseRepository
      .connection(UserRepository.USERS_TABLE)
      .update(user)
      .where({ id });
  }

  public deleteUser = async (id: string): Promise <void> => {
    await BaseRepository
      .connection(UserRepository.USERS_TABLE)
      .del()
      .where({ id });
  }
}