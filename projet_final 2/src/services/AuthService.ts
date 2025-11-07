import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';
import { User, UserInput, UserResponse, LoginResponse } from '../models/User';
import config from '../config/config';
import postgres from '../config/postgres';

export class AuthService {
  private pool: Pool;

  constructor() {
    this.pool = postgres.getPool();
  }

  async register(userData: UserInput): Promise<UserResponse> {
    const { username, password, role = 'user' } = userData;

    const existingUser = await this.findUserByUsername(username);
    if (existingUser) {
      throw new Error('Un utilisateur avec ce nom existe déjà');
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const query = `
      INSERT INTO users (username, password, role)
      VALUES ($1, $2, $3)
      RETURNING id, username, role, created_at
    `;
    
    const result = await this.pool.query(query, [username, hashedPassword, role]);
    return result.rows[0];
  }

  async login(username: string, password: string): Promise<LoginResponse> {
    const user = await this.findUserByUsername(username);
    if (!user) {
      throw new Error('Identifiants invalides');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Identifiants invalides');
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role
      },
      config.jwt.secret,
      { expiresIn: '24h' }
    );

    const userResponse: UserResponse = {
      id: user.id!,
      username: user.username,
      role: user.role,
      created_at: user.created_at!
    };

    return {
      success: true,
      token,
      user: userResponse
    };
  }

  async findUserByUsername(username: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE username = $1';
    const result = await this.pool.query(query, [username]);
    return result.rows[0] || null;
  }

  async findUserById(id: number): Promise<UserResponse | null> {
    const query = 'SELECT id, username, role, created_at FROM users WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    return result.rows[0] || null;
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, config.jwt.secret);
    } catch (error) {
      throw new Error('Token invalide');
    }
  }
}
