const request = require('supertest')
const app = require('../../app')

describe('Verified user rights on tv materials', () => {
  let token;


  beforeAll( async ()=>{
    const createverified = await request(app.callback())
      .post('/api/v1/users')
      .send({
        firstName: 'first name',
        lastName: 'last name',
        username: 'tv_verified',
        password: 'password',
        role: 'verified'
      })
  });
   


  it('log in an verified user', async () => {
      const res = await request(app.callback())
        .post('/api/v1/login')
        .send({
          username: 'tv_verified',
          password: 'password',
        })
      expect(res.statusCode).toEqual(200)
      expect(res.body.username).toEqual('tv_verified')
      expect(res.body.role).toEqual('verified')
      token = res.body.token;
    })
  

  it('verifieds should be not able to create an tv', async () => {
    const res = await request(app.callback())
      .post('/api/v1/tv')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'New tv'
      })
    expect(res.statusCode).toEqual(403)
    expect(res.body.error).toEqual('You are forbidden to create tv shows')
  })


  it('verifieds should be able to update an tv', async () => {
      const res = await request(app.callback())
        .put(`/api/v1/tv/1`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'UPDATED tv'
        })
      expect(res.statusCode).toEqual(403)
      expect(res.body.error).toEqual('You are forbidden to update tv shows')
    })

  it('verifieds should be able to delete an tv', async () => {
      const res = await request(app.callback())
        .del(`/api/v1/tv/1`)
        .set('Authorization', `Bearer ${token}`)
      
      expect(res.statusCode).toEqual(403)
      expect(res.body.error).toEqual('You are forbidden to delete tv shows')
  })
  

});