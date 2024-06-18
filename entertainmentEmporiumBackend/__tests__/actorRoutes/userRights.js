const request = require('supertest')
const app = require('../../app')

describe('Normal user rights on actor materials', () => {
  let token;
  let actorId;

  beforeAll( async ()=>{
    const createUser = await request(app.callback())
      .post('/api/v1/users')
      .send({
        firstName: 'first name',
        lastName: 'last name',
        username: 'actor_user',
        password: 'password'
      })
  });
   


  it('log in a normal user', async () => {
      const res = await request(app.callback())
        .post('/api/v1/login')
        .send({
          username: 'actor_user',
          password: 'password',
        })
      expect(res.statusCode).toEqual(200)
      expect(res.body.username).toEqual('actor_user')
      expect(res.body.role).toEqual('user')
      token = res.body.token;
    })
  

  it('user can not create actors', async () => {
    const res = await request(app.callback())
      .post('/api/v1/actors')
      .set('Authorization', `Bearer ${token}`)
      .send({
        firstName: 'New',
        lastName: 'Actor',
        avatarURL: 'example.img'
      })
    expect(res.statusCode).toEqual(403)
    expect(res.body.error).toEqual('You are forbidden to create actors')
  })

  it('user can not update actor', async () => {
      const res = await request(app.callback())
        .put(`/api/v1/actors/1`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          firstName: 'UPDATED'
        })
      expect(res.statusCode).toEqual(403)
      expect(res.body.error).toEqual('You are forbidden to update actors')
    })

  it('user cannot delete an actor', async () => {
      const res = await request(app.callback())
        .del(`/api/v1/actors/1`)
        .set('Authorization', `Bearer ${token}`)
      expect(res.statusCode).toEqual(403)
      expect(res.body.error).toEqual('You are forbidden to delete actors')
  })
  

});