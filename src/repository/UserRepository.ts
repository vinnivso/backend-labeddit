import { UserDB } from "../model/User";
import { BaseRepository } from "./BaseRepository";

export class UserRepository extends BaseRepository {
  public static TABLE_USERS = "users";

  public async insertUser(newUserDB: UserDB): Promise<void> {
    await BaseRepository.connection(UserRepository.TABLE_USERS).insert(newUserDB);
  }

  public async findUserByEmail(email: string): Promise<UserDB | undefined> {
    const [userDB]: UserDB[] | undefined[] = await BaseRepository.connection(
      UserRepository.TABLE_USERS
    ).where({ email });
    return userDB;
  }

  public async findUserByNickname(
    nickname: string
  ): Promise<UserDB | undefined> {
    const [userDB]: UserDB[] | undefined[] = await BaseRepository.connection(
      UserRepository.TABLE_USERS
    ).where({ nickname });
    return userDB;
  }

  public async findUserById(id: string): Promise<UserDB | undefined> {
    const [userDB]: UserDB[] | undefined[] = await BaseRepository.connection(
      UserRepository.TABLE_USERS
    ).where({ id });
    return userDB;
  }

  public async findUsers(q: string | undefined): Promise<UserDB[]> {
    let usersDB;
    if (q) {
      const result: UserDB[] = await BaseRepository.connection(
        UserRepository.TABLE_USERS
      ).where("email", "LIKE", `${q}`);

      usersDB = result;
    } else {
      const result: UserDB[] = await BaseRepository.connection(
        UserRepository.TABLE_USERS
      );
      usersDB = result;
    }
    return usersDB;
  }

  public updateUser = async (userDB: UserDB): Promise<void> => {
    await BaseRepository.connection(UserRepository.TABLE_USERS)
      .update(userDB)
      .where({ id: userDB.id });
  };
}
