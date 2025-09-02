import { User } from "../entities/user.entity";
import { AppDataSource } from "../config/database.config";
import { Repository } from "typeorm";
import { v4 as uuidv4 } from "uuid";

export class UserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  // I'm defining custom methods here
  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const now = new Date();
    const completeUserData = {
      ...userData,
      id: userData.id || uuidv4(),
      createdAt: userData.createdAt || now,
      updatedAt: userData.updatedAt || now,
    };

    const user = this.repository.create(completeUserData);
    return this.repository.save(user);
  }

  async updateUser(user: User): Promise<User> {
    user.updatedAt = new Date();
    return this.repository.save(user);
  }

  async findById(id: string): Promise<User | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findAll(): Promise<User[]> {
    return this.repository.find({
      select: [
        "id",
        "username",
        "email",
        "profileImage",
        "fullName",
        "mobilePhone",
        "status",
        "branch",
        "superUser",
        "address",
        "systemRole",
        "requireOTP",
        "createdAt",
        "updatedAt",
      ],
    });
  }
}
//repository communicates from the entity manager to the service layer. Learnt this

const userRepository = new UserRepository();
export { userRepository };
