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
  ) {}
}