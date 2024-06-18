const request = require('supertest')
const app = require('../../app')

describe('Normal user rights on movie materials', () => {
  let token;


  beforeAll( async ()=>{
    const createuser = await request(app.callback())
      .post('/api/v1/users')
      .send({
        firstName: 'first name',
        lastName: 'last name',
        username: 'movie_user',
        password: 'password'
      })
  });
   


  it('log in an user user', async () => {
      const res = await request(app.callback())
        .post('/api/v1/login')
        .send({
          username: 'movie_user',
          password: 'password',
        })
      expect(res.statusCode).toEqual(200)
      expect(res.body.username).toEqual('movie_user')
      expect(res.body.role).toEqual('user')
      token = res.body.token;
    })
  

  it('users should be able to create an movie', async () => {
    const res = await request(app.callback())
      .post('/api/v1/movies')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'New Movie'
      })
    expect(res.statusCode).toEqual(403)
    expect(res.body.error).toEqual('You are forbidden to create movies')
  })


  it('users should be able to update an movie', async () => {
      const res = await request(app.callback())
        .put(`/api/v1/movies/1`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'UPDATED Movie'
        })
      expect(res.statusCode).toEqual(403)
      expect(res.body.error).toEqual('You are forbidden to update movies')
    })

  it('users should be able to delete an movie', async () => {
      const res = await request(app.callback())
        .del(`/api/v1/movies/1`)
        .set('Authorization', `Bearer ${token}`)
      
      expect(res.statusCode).toEqual(403)
      expect(res.body.error).toEqual('You are forbidden to delete movies')
  })
  

});