const request = require('supertest')
const app = require('../../app')

describe('Normal user rights on director materials', () => {
  let token;
  let directorId;

  beforeAll( async ()=>{
    const createUser = await request(app.callback())
      .post('/api/v1/users')
      .send({
        firstName: 'first name',
        lastName: 'last name',
        username: 'director_user',
        password: 'password'
      })
  });
   


  it('log in a normal user', async () => {
      const res = await request(app.callback())
        .post('/api/v1/login')
        .send({
          username: 'director_user',
          password: 'password',
        })
      expect(res.statusCode).toEqual(200)
      expect(res.body.username).toEqual('director_user')
      expect(res.body.role).toEqual('user')
      token = res.body.token;
    })
  

  it('user can not create directors', async () => {
    const res = await request(app.callback())
      .post('/api/v1/directors')
      .set('Authorization', `Bearer ${token}`)
      .send({
        firstName: 'New',
        lastName: 'director',
        avatarURL: 'example.img'
      })
    expect(res.statusCode).toEqual(403)
    expect(res.body.error).toEqual('You are forbidden to create directors')
  })

  it('user can not update director', async () => {
      const res = await request(app.callback())
        .put(`/api/v1/directors/1`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          firstName: 'UPDATED'
        })
      expect(res.statusCode).toEqual(403)
      expect(res.body.error).toEqual('You are forbidden to update directors')
    })

  it('user cannot delete an director', async () => {
      const res = await request(app.callback())
        .del(`/api/v1/directors/1`)
        .set('Authorization', `Bearer ${token}`)
      expect(res.statusCode).toEqual(403)
      expect(res.body.error).toEqual('You are forbidden to delete directors')
  })
  

});