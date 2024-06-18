const request = require('supertest')
const app = require('../../app')

describe('Normal user rights on user materials', () => {
  let token;
  let id;

  it('should create a normal user', async () => {
    const res = await request(app.callback())
      .post('/api/v1/users')
      .send({
        firstName: 'first name',
        lastName: 'last name',
        username: 'normal_user',
        password: 'password',
      })
    expect(res.statusCode).toEqual(200)
    expect(res.body.message).toEqual('Account Creation Successful')
  })

  it('log in normal user', async () => {
      const res = await request(app.callback())
        .post('/api/v1/login')
        .send({
          username: 'normal_user',
          password: 'password',
        })
      expect(res.statusCode).toEqual(200)
      expect(res.body.username).toEqual('normal_user')
      expect(res.body.role).toEqual('user')
      token = res.body.token;
      id = res.body.id;
    })
  
  it('Allows normal users to view user details when getting by id', async () => {
    const res = await request(app.callback())
      .get(`/api/v1/users/${id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toEqual(200)
    expect(res.body.role).toEqual('user')
    expect(res.body.firstName).toEqual('first name')
    expect(res.body.lastName).toEqual('last name')
    expect(res.body.username).toEqual('normal_user')
  })

   it('Allows normal users to view user details when getting by username', async () => {
    const res = await request(app.callback())
      .get('/api/v1/users/normal_user')
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toEqual(200)
    expect(res.body.role).toEqual('user')
    expect(res.body.firstName).toEqual('first name')
    expect(res.body.lastName).toEqual('last name')
    expect(res.body.username).toEqual('normal_user')
  })
  
  it('Allow normal users to update their own account', async () => {
      const res = await request(app.callback())
        .put(`/api/v1/users/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          firstName: 'NEW'
        })
      expect(res.statusCode).toEqual(200)
      expect(res.body.message).toEqual('Account Update Successful')
    })

  it('Rejects request to update other accounts', async () => {
      const res = await request(app.callback())
        .put(`/api/v1/users/1`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          firstName: 'NEW'
        })
      expect(res.statusCode).toEqual(403)
      expect(res.body.error).toEqual('You are forbidden to update this resource')
    })

  it('Rejects request to delete other accounts', async () => {
      const res = await request(app.callback())
        .del(`/api/v1/users/1`)
        .set('Authorization', `Bearer ${token}`)
      expect(res.statusCode).toEqual(403)
      expect(res.body.error).toEqual('You are forbidden to delete this user')
    })

  it('Allow normal users to delete their own account', async () => {
      const res = await request(app.callback())
        .del(`/api/v1/users/${id}`)
        .set('Authorization', `Bearer ${token}`)
      expect(res.statusCode).toEqual(200)
      expect(res.body.message).toEqual('User deleted')
  })

});
