const request = require('supertest')
const app = require('../../app')

describe('Admin user rights on director materials', () => {
  let token;
  let directorId;

  beforeAll( async ()=>{
    const createAdmin = await request(app.callback())
      .post('/api/v1/users')
      .send({
        firstName: 'first name',
        lastName: 'last name',
        username: 'director_admin',
        password: 'password',
        role: 'admin'
      })
  });
   


  it('log in an admin user', async () => {
      const res = await request(app.callback())
        .post('/api/v1/login')
        .send({
          username: 'director_admin',
          password: 'password',
        })
      expect(res.statusCode).toEqual(200)
      expect(res.body.username).toEqual('director_admin')
      expect(res.body.role).toEqual('admin')
      token = res.body.token;
    })
  

  it('Admins should be able to create an director', async () => {
    const res = await request(app.callback())
      .post('/api/v1/directors')
      .set('Authorization', `Bearer ${token}`)
      .send({
        firstName: 'New',
        lastName: 'director',
        avatarURL: 'example.img'
      })
    expect(res.statusCode).toEqual(200)
    expect(res.body.message).toEqual('Director Creation Successful')
  })

  it('should get directors by last name', async () => {
    const res = await request(app.callback())
      .get('/api/v1/directors/search/director')
      
    expect(res.statusCode).toEqual(200)
    expect(res.body[0].firstName).toEqual('New')
    expect(res.body[0].lastName).toEqual('director')
    directorId = res.body[0].id
  })

  it('Admins should be able to update an director', async () => {
      const res = await request(app.callback())
        .put(`/api/v1/directors/${directorId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          firstName: 'UPDATED'
        })
      expect(res.statusCode).toEqual(200)
      expect(res.body.message).toEqual('Director Update Successful')
    })

  it('Admins should be able to delete an director', async () => {
      const res = await request(app.callback())
        .del(`/api/v1/directors/${directorId}`)
        .set('Authorization', `Bearer ${token}`)
      expect(res.statusCode).toEqual(200)
      expect(res.body.message).toEqual('Deleted Director Successfully')
  })
  

});