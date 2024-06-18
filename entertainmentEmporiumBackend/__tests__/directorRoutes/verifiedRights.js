const request = require('supertest')
const app = require('../../app')

describe('Verified user rights on director materials', () => {
  let token;
  let directorId;

  beforeAll( async ()=>{
    const createVerified = await request(app.callback())
      .post('/api/v1/users')
      .send({
        firstName: 'first name',
        lastName: 'last name',
        username: 'director_verified',
        password: 'password',
        role: 'verified'
      })
  });
   


  it('log in an verified user', async () => {
      const res = await request(app.callback())
        .post('/api/v1/login')
        .send({
          username: 'director_verified',
          password: 'password',
        })
      expect(res.statusCode).toEqual(200)
      expect(res.body.username).toEqual('director_verified')
      expect(res.body.role).toEqual('verified')
      token = res.body.token;
    })
  

  it('Verified can not create directors', async () => {
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

  it('Verified can not update director', async () => {
      const res = await request(app.callback())
        .put(`/api/v1/directors/1`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          firstName: 'UPDATED'
        })
      expect(res.statusCode).toEqual(403)
      expect(res.body.error).toEqual('You are forbidden to update directors')
    })

  it('Verified cannot delete an director', async () => {
      const res = await request(app.callback())
        .del(`/api/v1/directors/1`)
        .set('Authorization', `Bearer ${token}`)
      expect(res.statusCode).toEqual(403)
      expect(res.body.error).toEqual('You are forbidden to delete directors')
  })
  

});