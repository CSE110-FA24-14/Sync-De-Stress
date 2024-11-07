import { Request, Response } from 'express';
import { register, login } from '../user';
import UserModel from '../../models/user';
import { encryptPassword, comparePassword, generateJWT } from '../../services/user';

jest.mock('../../models/user');
jest.mock('../../services/user');

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.sendStatus = jest.fn().mockReturnValue(res);
  return res;
};

describe('User Controller', () => {
  describe('register', () => {
    it('should register a user successfully', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123',
        },
      } as Request;

      const res = mockResponse();

      // Mock dependencies
      (encryptPassword as jest.Mock).mockResolvedValue('encryptedPassword');
      (UserModel.prototype.save as jest.Mock).mockResolvedValue({
        email: 'test@example.com',
      });

      await register(req, res);

      expect(encryptPassword).toHaveBeenCalledWith('password123');
      expect(UserModel.prototype.save).toHaveBeenCalled();
      expect(res.send).toHaveBeenCalledWith({
        status: 'success',
        message: 'User with email test@example.com has been successfully saved to our database',
      });
    });

    it('should fail when required params are missing', async () => {
      const req = {
        body: {},
      } as Request;

      const res = mockResponse();

      await register(req, res);

      expect(res.send).toHaveBeenCalledWith({
        status: 'failure',
        message: 'request missing key params email,password',
      });
    });

    it('should fail when password length is invalid', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'short',
        },
      } as Request;

      const res = mockResponse();

      await register(req, res);

      expect(res.send).toHaveBeenCalledWith({
        status: 'failure',
        message: 'password must contain at least 8 characters and less than 50 characters',
      });
    });

    it('should handle errors during registration', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123',
        },
      } as Request;

      const res = mockResponse();

      (encryptPassword as jest.Mock).mockRejectedValue(new Error('Encryption failed'));

      await register(req, res);

      expect(res.send).toHaveBeenCalledWith({
        status: 'failure',
        message: 'there was a failure while trying to register, please try again',
      });
    });
  });

  describe('login', () => {
    it('should log in a user successfully', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123',
        },
      } as Request;

      const res = mockResponse();

      // Mock dependencies
      (UserModel.findOne as jest.Mock).mockResolvedValue({
        _id: 'user-id',
        email: 'test@example.com',
        password: 'encryptedPassword',
      });

      (comparePassword as jest.Mock).mockResolvedValue(true);
      (generateJWT as jest.Mock).mockResolvedValue('jwt-token');

      await login(req, res);

      expect(UserModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(comparePassword).toHaveBeenCalledWith('password123', 'encryptedPassword');
      expect(generateJWT).toHaveBeenCalledWith('user-id', 'test@example.com');

      expect(res.send).toHaveBeenCalledWith({
        status: 'success',
        message: 'login successful',
        email: 'test@example.com',
        token: 'jwt-token',
      });
    });

    it('should fail when required params are missing', async () => {
      const req = {
        body: {},
      } as Request;

      const res = mockResponse();

      await login(req, res);

      expect(res.send).toHaveBeenCalledWith({
        status: 'failure',
        message: 'request missing key params email,password',
      });
    });

    it('should fail when user is not found', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123',
        },
      } as Request;

      const res = mockResponse();

      (UserModel.findOne as jest.Mock).mockResolvedValue(null);

      await login(req, res);

      expect(res.send).toHaveBeenCalledWith({
        status: 'failure',
        message: 'login unsuccessful due to incorrect email or password',
      });
    });

    it('should fail when password does not match', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'wrongpassword',
        },
      } as Request;

      const res = mockResponse();

      (UserModel.findOne as jest.Mock).mockResolvedValue({
        _id: 'user-id',
        email: 'test@example.com',
        password: 'encryptedPassword',
      });

      (comparePassword as jest.Mock).mockResolvedValue(false);

      await login(req, res);

      expect(res.send).toHaveBeenCalledWith({
        status: 'failure',
        message: 'login unsuccessful due to incorrect email or password',
      });
    });

    it('should handle errors during login', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123',
        },
      } as Request;

      const res = mockResponse();

      (UserModel.findOne as jest.Mock).mockRejectedValue(new Error('Database error'));

      await login(req, res);

      expect(res.sendStatus).toHaveBeenCalledWith(500);
    });
  });
});
