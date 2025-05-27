import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByWalletAddress(walletAddress: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { walletAddress } });
  }

  async create(walletAddress: string): Promise<User> {
    const user = this.usersRepository.create({ walletAddress });
    return this.usersRepository.save(user);
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.usersRepository.update(userId, { lastLoginAt: new Date() });
  }
} 