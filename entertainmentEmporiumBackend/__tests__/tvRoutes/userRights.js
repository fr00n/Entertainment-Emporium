const request = require('supertest')
const app = require('../../app')

describe('Normal user rights on tv materials', () => {
  let token;


  beforeAll( async ()=>{
    const createuser = await request(app.callback())
      .post('/api/v1/users')
      .send({
        firstName: 'first name',
        lastName: 'last name',
        username: 'tv_user',
        password: 'password'
      })
  });
   


  it('log in an user user', async () => {
      const res = await request(app.callback())
        .post('/api/v1/login')
        .send({
          username: 'tv_user',
          password: 'password',
        })
      expect(res.statusCode).toEqual(200)
      expect(res.body.username).toEqual('tv_user')
      expect(res.body.role).toEqual('user')
      token = res.body.token;
    })
  

  it('users should be able to create an tv', async () => {
    const res = await request(app.callback())
      .post('/api/v1/tv')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'New tv'
      })
    expect(res.statusCode).toEqual(403)
    expect(res.body.error).toEqual('You are forbidden to create tv shows')
  })


  it('users should be able to update an tv', async () => {
      const res = await request(app.callback())
        .put(`/api/v1/tv/1`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'UPDATED tv'
        })
      expect(res.statusCode).toEqual(403)
      expect(res.body.error).toEqual('You are forbidden to update tv shows')
    })

  it('users should be able to delete an tv', async () => {
      const res = await request(app.callback())
        .del(`/api/v1/tv/1`)
        .set('Authorization', `Bearer ${token}`)
      
      expect(res.statusCode).toEqual(403)
      expect(res.body.error).toEqual('You are forbidden to delete tv shows')
  })
  

});