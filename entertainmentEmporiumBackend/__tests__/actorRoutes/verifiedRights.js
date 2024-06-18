const request = require('supertest')
const app = require('../../app')

describe('Verified user rights on actor materials', () => {
  let token;
  let actorId;

  beforeAll( async ()=>{
    const createVerified = await request(app.callback())
      .post('/api/v1/users')
      .send({
        firstName: 'first name',
        lastName: 'last name',
        username: 'actor_verified',
        password: 'password',
        role: 'verified'
      })
  });
   


  it('log in an verified user', async () => {
      const res = await request(app.callback())
        .post('/api/v1/login')
        .send({
          username: 'actor_verified',
          password: 'password',
        })
      expect(res.statusCode).toEqual(200)
      expect(res.body.username).toEqual('actor_verified')
      expect(res.body.role).toEqual('verified')
      token = res.body.token;
    })
  

  it('Verified can not create actors', async () => {
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

  it('Verified can not update actor', async () => {
      const res = await request(app.callback())
        .put(`/api/v1/actors/1`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          firstName: 'UPDATED'
        })
      expect(res.statusCode).toEqual(403)
      expect(res.body.error).toEqual('You are forbidden to update actors')
    })

  it('Verified cannot delete an actor', async () => {
      const res = await request(app.callback())
        .del(`/api/v1/actors/1`)
        .set('Authorization', `Bearer ${token}`)
      expect(res.statusCode).toEqual(403)
      expect(res.body.error).toEqual('You are forbidden to delete actors')
  })
  

});