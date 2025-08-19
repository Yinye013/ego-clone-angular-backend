import { User } from "../entities/user.entity";
import { AppDataSource } from "../config/database.config";
import { Repository } from "typeorm";

export class UserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  // I'm defining custom methods here
  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }
  xj;
  async saveUser(user: User): Promise<User> {
    return this.repository.save(user);
  }

  async findById(id: string): Promise<User | null> {
    return this.repository.findOne({ where: { id } });
  }
}
//repository communicates from the entity manager to the service layer. Learnt this

const userRepository = new UserRepository();
export { userRepository };
