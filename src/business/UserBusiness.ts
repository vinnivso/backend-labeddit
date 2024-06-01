import { UserRepository } from "../repository/UserRepository";
import { GetUsersInputDTO, GetUsersOutputDTO } from "../dtos/user/getUsers.dto";
import { LoginInputDTO, LoginOutputDTO } from "../dtos/user/login.dto";
import { SignupInputDTO, SignupOutputDTO } from "../dtos/user/signup.dto";
import { BadRequestError } from "../errors/BadRequestError";
import { ConflictError } from "../errors/ConflictError";
import { ForbiddenError } from "../errors/ForbiddenError";
import { NotFoundError } from "../errors/NotFoundError";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { TokenPayload, USER_ROLES, User } from "../model/User";
import { HashManager } from "../services/HashManager";
import { TokenManager } from "../services/TokenManager";
import { IdGenerator } from "../services/IdGenerator";
import { UpdateUserInputDTO, UpdateUserOutputDTO } from "../dtos/user/updateUser.dto";

export class UserBusiness {
  constructor(
    private userRepository: UserRepository,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager,
    private hashManager: HashManager
  ) { }

  //#region signup
  public signup = async (input: SignupInputDTO): Promise<SignupOutputDTO> => {
    const { nickname, email, password, avatar } = input;

    const nicknameExist = await this.userRepository.findUserByNickname(nickname);
    if (nicknameExist) {
      throw new ConflictError("'nickname' já existe!");
    }

    const emailExist = await this.userRepository.findUserByEmail(email);
    if (emailExist) {
      throw new ConflictError("'email' já existe!");
    }

    const id = this.idGenerator.gerate();
    const hashedPassword = await this.hashManager.hash(password);

    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    const second = String(date.getSeconds()).padStart(2, "0");

    const dateString = `${year}-${month}-${day} ${hour}:${minute}:${second}`;

    const user = new User(
      id,
      nickname,
      email,
      hashedPassword,
      USER_ROLES.NORMAL,
      avatar,
      dateString
    );

    user.setAvatar = avatar
      ? avatar
      : "https://picsum.photos/200/300.jpg";

    const userDB = user.toDBModel();
    await this.userRepository.createUser(userDB);

    const payload: TokenPayload = {
      id: user.getId,
      nickname: user.getNickname,
      role: user.getRole,
    };

    const token = this.tokenManager.createToken(payload);

    const output: SignupOutputDTO = {
      message: "Cadastro realizado com sucesso",
      token,
    };

    return output;
  };
  //#endregion signup

  //#region login
  public login = async (input: LoginInputDTO): Promise<LoginOutputDTO> => {
    const { email, password } = input;

    const userDB = await this.userRepository.findUserByEmail(email);
    if (!userDB) {
      throw new BadRequestError("'email' ou 'senha' incorretos!");
    }

    const isPasswordValid = await this.hashManager.compare(
      password,
      userDB.password
    );
    if (!isPasswordValid) {
      throw new BadRequestError("'email' ou 'senha' incorretos!");
    }

    const user = new User(
      userDB.id,
      userDB.nickname,
      userDB.email,
      userDB.password,
      userDB.role,
      userDB.avatar,
      userDB.created_at
    );

    const tokenPayload: TokenPayload = {
      id: user.getId,
      nickname: user.getNickname,
      role: user.getRole,
    };

    const token = this.tokenManager.createToken(tokenPayload);

    const output: LoginOutputDTO = {
      message: "Login realizado com sucesso",
      token,
    };

    return output;
  };
  //#endregion login

  //#region getUsers
  public getUsers = async (input: GetUsersInputDTO): Promise<GetUsersOutputDTO> => {
    const { email, token } = input;

    const payload = this.tokenManager.getPayload(token);
    if (!payload) {
      throw new UnauthorizedError();
    }

    const usersDB = await this.userRepository.findUsers(email);

    const users = usersDB.map((userDB) => {
      const user = new User(
        userDB.id,
        userDB.nickname,
        userDB.email,
        userDB.password,
        userDB.role,
        userDB.avatar,
        userDB.created_at
      );
      return user.toBusinessModel();
    });

    const output: GetUsersOutputDTO = users;

    return output;
  };
  //#endregion getUsers

  //#region updateUser
  public updateUser = async (
    input: UpdateUserInputDTO
  ): Promise<UpdateUserOutputDTO> => {
    const { idToEdit, token, nickname, email, password, avatar } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }

    const userDB = await this.userRepository.findUserById(idToEdit);

    if (!userDB) {
      throw new NotFoundError("Não existe usuário com essa  id!");
    }

    if (payload.role !== USER_ROLES.ADMIN) {
      if (payload.id !== userDB.id) {
        throw new ForbiddenError(
          "Somente o próprio usuário pode editar a conta!"
        );
      }
    }

    if (nickname) {
      const nicknameExist = await this.userRepository.findUserByNickname(
        nickname
      );

      if (nicknameExist) {
        throw new ConflictError("Esse 'nickname' já existe!");
      }
    }

    if (email) {
      const emailExist = await this.userRepository.findUserByEmail(email);

      if (emailExist) {
        throw new ConflictError("'email' já cadastrado!");
      }
    }

    const user = new User(
      userDB.id,
      userDB.nickname,
      userDB.email,
      userDB.password,
      userDB.role,
      userDB.avatar,
      userDB.created_at
    );

    let hashedPassword: string | undefined;
    if (password) {
      hashedPassword = await this.hashManager.hash(password);
    }

    user.setNickname = nickname || userDB.nickname;
    user.setEmail = email || userDB.email;
    user.setPassword = hashedPassword || userDB.password;
    user.setAvatar = avatar || userDB.avatar;

    const updatedUserDB = user.toDBModel();
    await this.userRepository.updateUser(updatedUserDB);

    const output: UpdateUserOutputDTO = {
      message: "Cadastro atualizado com sucesso!",
    };

    return output;
  };
  //#endregion updateUser
}