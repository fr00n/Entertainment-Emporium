const request = require('supertest')
const app = require('../../app')

describe('Admin user rights on tv materials', () => {
  let token;
  let tvId;

  beforeAll( async ()=>{
    const createAdmin = await request(app.callback())
      .post('/api/v1/users')
      .send({
        firstName: 'first name',
        lastName: 'last name',
        username: 'tv_admin',
        password: 'password',
        role: 'admin'
      })
  });
   


  it('log in an admin user', async () => {
      const res = await request(app.callback())
        .post('/api/v1/login')
        .send({
          username: 'tv_admin',
          password: 'password',
        })
      expect(res.statusCode).toEqual(200)
      expect(res.body.username).toEqual('tv_admin')
      expect(res.body.role).toEqual('admin')
      token = res.body.token;
    })
  

  it('Admins should be able to create an tv', async () => {
    const res = await request(app.callback())
      .post('/api/v1/tv')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'New tv'
      })
    expect(res.statusCode).toEqual(200)
    expect(res.body.message).toEqual('Tv Creation Successful')
  })

  it('should get tv by title', async () => {
    const res = await request(app.callback())
      .get('/api/v1/tv/New')
      
    expect(res.statusCode).toEqual(200)
    expect(res.body[0].title).toEqual('New tv')
    tvId = res.body[0].id
  })

  it('Admins should be able to update an tv', async () => {
      const res = await request(app.callback())
        .put(`/api/v1/tv/${tvId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'UPDATED tv'
        })
      expect(res.statusCode).toEqual(200)
      expect(res.body.message).toEqual('Tv Show Update Successful')
    })

  it('Admins should be able to delete an tv', async () => {
      const res = await request(app.callback())
        .del(`/api/v1/tv/${tvId}`)
        .set('Authorization', `Bearer ${token}`)
      expect(res.statusCode).toEqual(200)
      expect(res.body.message).toEqual('Tv Show Deleted Successfully')
  })
  

});