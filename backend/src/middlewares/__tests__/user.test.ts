// requireAuthorization.test.ts

import { Request, Response, NextFunction } from 'express';
import { requireAuthorization } from '../user';
import { validateJWT } from '../../services/user'; // Adjust the import path accordingly
import { JwtPayloadInterface } from '../../shared/interface/authInterface'; // Adjust the import path accordingly

// Mock the validateJWT function
jest.mock('../../services/user', () => ({
  validateJWT: jest.fn(),
}));

describe('requireAuthorization Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      headers: {},
      body: {},
    };
    res = {
      sendStatus: jest.fn(),
    };
    next = jest.fn();
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should call next and attach authPayload when authorization header is valid', async () => {
    const mockToken = 'valid.token.here';
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const mockPayload: JwtPayloadInterface = {
        id: 'test',
        email: 'test@test.com',
        iat: Date.now(),
        exp: tomorrow.getTime()
    };

    const req = {headers: {authorization: ''} as any, body: {} as any};
    req.headers.authorization = `Bearer ${mockToken}`;
    (validateJWT as jest.Mock).mockResolvedValue(mockPayload);

    await requireAuthorization(req as Request, res as Response, next);

    expect(validateJWT).toHaveBeenCalledWith(mockToken);
    expect(req.body.authPayload).toEqual(mockPayload);
    expect(next).toHaveBeenCalled();
    expect(res.sendStatus).not.toHaveBeenCalled();
  });

  it('should send 403 when authorization header is invalid', async () => {
    const mockToken = 'invalid.token.here';

    const req = {headers: {authorization: ''} as any, body: {} as any};
    req.headers.authorization = `Bearer ${mockToken}`;
    (validateJWT as jest.Mock).mockResolvedValue(undefined);

    await requireAuthorization(req as Request, res as Response, next);

    expect(validateJWT).toHaveBeenCalledWith(mockToken);
    expect(req.body.authPayload).toBeUndefined();
    expect(next).not.toHaveBeenCalled();
    expect(res.sendStatus).toHaveBeenCalledWith(403);
  });

  it('should send 403 when authorization header is missing', async () => {
    await requireAuthorization(req as Request, res as Response, next);

    expect(validateJWT).not.toHaveBeenCalled();
    expect(req.body.authPayload).toBeUndefined();
    expect(next).not.toHaveBeenCalled();
    expect(res.sendStatus).toHaveBeenCalledWith(403);
  });

  it('should send 403 when authorization header format is incorrect', async () => {
    const req = {headers: {authorization: `InvalidFormatToken`} as any, body: {} as any};

    await requireAuthorization(req as Request, res as Response, next);

    expect(req.body.authPayload).toBeUndefined();
    expect(next).not.toHaveBeenCalled();
    expect(res.sendStatus).toHaveBeenCalledWith(403);
  });
});