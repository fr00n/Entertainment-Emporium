const request = require('supertest')
const app = require('../../app')

describe('Post new user', () => {
  it('should create a new user', async () => {
    const res = await request(app.callback())
      .post('/api/v1/users')
      .send({
        firstName: 'first name',
        lastName: 'last name',
        username: 'unique_112233',
        password: 'password',
      })
    expect(res.statusCode).toEqual(200)
    expect(res.body.message).toEqual('Account Creation Successful')
  })
});

describe('Post new user with bad data', () => {
  it('should reject request', async () => {
    const res = await request(app.callback())
      .post('/api/v1/users')
      .send({
        firstName: 1234,
        lastName: 'last name',
        username: 'unique_112233',
        password: 'password',
      })
    expect(res.statusCode).toEqual(400)
    expect(res.body.message).toEqual('is not of a type(s) string');
    expect(res.body.property).toEqual('instance.firstName');
  })
});

describe('Post new user with duplicate username', () => {
  it('should reject request', async () => {
    const res = await request(app.callback())
      .post('/api/v1/users')
      .send({
        firstName: 'first name',
        lastName: 'last name',
        username: 'unique_112233',
        password: 'password',
      })
    expect(res.statusCode).toEqual(400)
    expect(res.body.error).toEqual('Username is already taken')
  })
});