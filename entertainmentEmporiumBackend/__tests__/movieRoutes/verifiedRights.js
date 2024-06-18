const request = require('supertest')
const app = require('../../app')

describe('Verified user rights on movie materials', () => {
  let token;


  beforeAll( async ()=>{
    const createverified = await request(app.callback())
      .post('/api/v1/users')
      .send({
        firstName: 'first name',
        lastName: 'last name',
        username: 'movie_verified',
        password: 'password',
        role: 'verified'
      })
  });
   


  it('log in an verified user', async () => {
      const res = await request(app.callback())
        .post('/api/v1/login')
        .send({
          username: 'movie_verified',
          password: 'password',
        })
      expect(res.statusCode).toEqual(200)
      expect(res.body.username).toEqual('movie_verified')
      expect(res.body.role).toEqual('verified')
      token = res.body.token;
    })
  

  it('verifieds should be able to create an movie', async () => {
    const res = await request(app.callback())
      .post('/api/v1/movies')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'New Movie'
      })
    expect(res.statusCode).toEqual(403)
    expect(res.body.error).toEqual('You are forbidden to create movies')
  })


  it('verifieds should be able to update an movie', async () => {
      const res = await request(app.callback())
        .put(`/api/v1/movies/1`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'UPDATED Movie'
        })
      expect(res.statusCode).toEqual(403)
      expect(res.body.error).toEqual('You are forbidden to update movies')
    })

  it('verifieds should be able to delete an movie', async () => {
      const res = await request(app.callback())
        .del(`/api/v1/movies/1`)
        .set('Authorization', `Bearer ${token}`)
      
      expect(res.statusCode).toEqual(403)
      expect(res.body.error).toEqual('You are forbidden to delete movies')
  })
  

});