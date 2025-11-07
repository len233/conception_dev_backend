import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';
import { User, UserInput, UserResponse, LoginResponse } from '../models/User';
import config from '../config/config';
import postgres from '../config/postgres';

export class AuthController {
  private pool: Pool;

  constructor() {
    this.pool = postgres.getPool();
  }

  private async findUserByUsername(username: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE username = $1';
    const result = await this.pool.query(query, [username]);
    return result.rows[0] || null;
  }

  public register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, password, role } = req.body;

      if (!username || !password) {
        res.status(400).json({
          success: false,
          error: 'Le nom d\'utilisateur et le mot de passe sont requis'
        });
        return;
      }

      if (password.length < 6) {
        res.status(400).json({
          success: false,
          error: 'Le mot de passe doit contenir au moins 6 caractères'
        });
        return;
      }

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
      
      const result = await this.pool.query(query, [username, hashedPassword, role || 'user']);
      const user = result.rows[0];
      
      res.status(201).json({
        success: true,
        message: 'Utilisateur créé avec succès',
        user
      });
    } catch (error: any) {
      if (error.message.includes('existe déjà')) {
        res.status(409).json({
          success: false,
          error: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Erreur lors de la création de l\'utilisateur'
        });
      }
    }
  };

  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        res.status(400).json({
          success: false,
          error: 'Le nom d\'utilisateur et le mot de passe sont requis'
        });
        return;
      }

      const user = await this.findUserByUsername(username);
      if (!user) {
        throw new Error('Identifiants invalides');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Identifiants invalides');
      }

      const payload = {
        id: user.id,
        username: user.username,
        role: user.role
      };

      const token = jwt.sign(payload, config.jwt.secret, {
        expiresIn: '24h'
      });

      const loginResponse = {
        success: true,
        message: 'Connexion réussie',
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      };
      
      res.json(loginResponse);
    } catch (error: any) {
      if (error.message.includes('Identifiants invalides')) {
        res.status(401).json({
          success: false,
          error: 'Identifiants invalides'
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Erreur lors de la connexion'
        });
      }
    }
  };
}
