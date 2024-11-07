import { encryptPassword, comparePassword, generateJWT, validateJWT } from '../user';
import { JwtPayloadInterface } from '../../shared/interface/authInterface';
import jwt from 'jsonwebtoken';

describe('User Service Tests', () => {
  describe('encryptPassword', () => {
    it('should return a hashed password different from the original password', async () => {
      const password = 'MySecretPassword123!';
      const hashedPassword = await encryptPassword(password);

      expect(hashedPassword).not.toEqual(password);
      expect(typeof hashedPassword).toBe('string');
      expect(hashedPassword.length).toBeGreaterThan(0);
    });
  });

  describe('comparePassword', () => {
    it('should return true when the password matches the hash', async () => {
      const password = 'MySecretPassword123!';
      const hashedPassword = await encryptPassword(password);

      const isMatch = await comparePassword(password, hashedPassword);
      expect(isMatch).toBe(true);
    });

    it('should return false when the password does not match the hash', async () => {
      const password = 'MySecretPassword123!';
      const wrongPassword = 'WrongPassword!';
      const hashedPassword = await encryptPassword(password);

      const isMatch = await comparePassword(wrongPassword, hashedPassword);
      expect(isMatch).toBe(false);
    });
  });

  describe('generateJWT', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      jest.resetModules();
      process.env = { ...originalEnv };
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it('should return a JWT token when JWT_SECRET is set', async () => {
      process.env.JWT_SECRET = 'testsecret';

      const id = '12345';
      const email = 'test@test.com';

      const token = await generateJWT(id, email);

      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayloadInterface;
      expect(decoded.id).toBe(id);
      expect(decoded.email).toBe(email);
    });

    it('should throw an error when JWT_SECRET is not set', async () => {
      delete process.env.JWT_SECRET;

      const id = '12345';
      const username = 'testuser';

      await expect(generateJWT(id, username)).rejects.toEqual('JWT Secret not found');
    });
  });

  describe('validateJWT', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      jest.resetModules();
      process.env = { ...originalEnv };
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it('should return the decrypted payload when given a valid token', async () => {
      process.env.JWT_SECRET = 'testsecret';

      const id = '12345';
      const email = 'test@test.com';

      const token = await generateJWT(id, email);
      const payload = await validateJWT(token);

      expect(payload).toBeDefined();
      expect(payload!.id).toBe(id);
      expect(payload!.email).toBe(email);
    });

    it('should return undefined when given an invalid token', async () => {
      process.env.JWT_SECRET = 'testsecret';

      const invalidToken = 'this.is.not.a.valid.token';

      const payload = await validateJWT(invalidToken);

      expect(payload).toBeUndefined();
    });

    it('should throw an error when JWT_SECRET is not set', async () => {
      delete process.env.JWT_SECRET;

      const token = 'someToken';

      await expect(validateJWT(token)).rejects.toEqual('JWT Secret not found');
    });
  });
});
