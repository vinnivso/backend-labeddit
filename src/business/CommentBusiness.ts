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
  ) {}
}