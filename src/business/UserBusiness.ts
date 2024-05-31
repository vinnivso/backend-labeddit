import { BadRequestError } from "../customErrors/BadRequestError";
import { NotFoundError } from "../customErrors/NotFoundError";
import { loginOutputDTO } from "../dtos/user/login.dto";
import { signupInputDTO, signupOutputDTO } from "../dtos/user/signup.dto";
import { User, USER_ROLES } from "../model/User/User";
import { UserRepository } from "../repository/UserRepository";
import { HashManager } from "../services/HashManager";
import { IdGerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export class UserBusiness {
  constructor(
    private repository: UserRepository,
    private idGenerator: IdGerator,
    private hashManager: HashManager,
    private tokenManager: TokenManager
  ) { }

  //#region signup
  public signup = async (input: signupInputDTO): Promise<signupOutputDTO> => {
    const { name, email, password } = input;
    const userDB = await this.repository.findUserByEmail(email);
    if (userDB) {
      throw new BadRequestError("E-mail already exists");
    }

    const id = this.idGenerator.gerate();
    const hashPassword = await this.hashManager.hash(password);

    const newUser = new User(
      id,
      name,
      email,
      hashPassword,
      USER_ROLES.NORMAL,
      new Date().toISOString()
    );
    const newUserDB = newUser.toDBModel();
    await this.repository.createUser(newUserDB);

    const tokenPayload = newUser.toUserPayloadModel();
    const token = this.tokenManager.createToken(tokenPayload);

    const response: signupOutputDTO = {
      message: "User created successfully",
      token
    };

    return response;

  };
  //#endregion signup

  //#region login
  public login = async (input: signupInputDTO): Promise<loginOutputDTO> => {
    const { email, password } = input;
    const [userDB] = await this.repository.findUserByEmail(email);
    if (!userDB) {
      throw new NotFoundError("E-mail not found");
    }

    const hashPassword = userDB.password;
    const passwordIsCorrect = await this.hashManager.compare(password, hashPassword);
    if (!passwordIsCorrect) {
      throw new BadRequestError("E-mail or password incorrect");
    }

    const user = new User(
      userDB.id,
      userDB.name,
      userDB.email,
      userDB.password,
      userDB.role,
      userDB.created_at
    );

    const tokenPayload = user.toUserPayloadModel();
    const token = this.tokenManager.createToken(tokenPayload);

    const response:loginOutputDTO = {
      message: "Login successfully",
      token
    };
    return response;
  };
  //#endregion login
}