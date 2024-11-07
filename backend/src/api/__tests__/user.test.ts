import request from 'supertest';
import express, { Express } from 'express';
import router from '../router';
import { register, login } from '../../controller/user';

jest.mock('../../controller/user');

const mockedRegister = register as jest.Mock;
const mockedLogin = login as jest.Mock;

describe('User Routes', () => {
  let app: Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/', router());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call register controller on POST /register', async () => {
    mockedRegister.mockImplementation((req, res) => {
      res.status(201).send({ message: 'User registered' });
    });

    const response = await request(app)
      .post('/register')
      .send({ username: 'testuser', password: 'testpass' });

    expect(mockedRegister).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: 'User registered' });
  });

  it('should call login controller on POST /login', async () => {
    mockedLogin.mockImplementation((req, res) => {
      res.status(200).send({ token: 'fake-jwt-token' });
    });

    const response = await request(app)
      .post('/login')
      .send({ username: 'testuser', password: 'testpass' });

    expect(mockedLogin).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ token: 'fake-jwt-token' });
  });
});
