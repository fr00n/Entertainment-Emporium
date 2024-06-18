const request = require('supertest')
const app = require('../../app')

describe('Admin user rights on movie materials', () => {
  let token;
  let movieId;

  beforeAll( async ()=>{
    const createAdmin = await request(app.callback())
      .post('/api/v1/users')
      .send({
        firstName: 'first name',
        lastName: 'last name',
        username: 'movie_admin',
        password: 'password',
        role: 'admin'
      })
  });
   


  it('log in an admin user', async () => {
      const res = await request(app.callback())
        .post('/api/v1/login')
        .send({
          username: 'movie_admin',
          password: 'password',
        })
      expect(res.statusCode).toEqual(200)
      expect(res.body.username).toEqual('movie_admin')
      expect(res.body.role).toEqual('admin')
      token = res.body.token;
    })
  

  it('Admins should be able to create an movie', async () => {
    const res = await request(app.callback())
      .post('/api/v1/movies')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'New Movie'
      })
    expect(res.statusCode).toEqual(200)
    expect(res.body.message).toEqual('Movie Creation Successful')
  })

  it('should get movies by title', async () => {
    const res = await request(app.callback())
      .get('/api/v1/movies/Movie')
      
    expect(res.statusCode).toEqual(200)
    expect(res.body[0].title).toEqual('New Movie')
    movieId = res.body[0].id
  })

  it('Admins should be able to update an movie', async () => {
      const res = await request(app.callback())
        .put(`/api/v1/movies/${movieId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'UPDATED Movie'
        })
      expect(res.statusCode).toEqual(200)
      expect(res.body.message).toEqual('Movie Update Successful')
    })

  it('Admins should be able to delete an movie', async () => {
      const res = await request(app.callback())
        .del(`/api/v1/movies/${movieId}`)
        .set('Authorization', `Bearer ${token}`)
      expect(res.statusCode).toEqual(200)
      expect(res.body.message).toEqual('Movie Deleted Successfully')
  })
  

});