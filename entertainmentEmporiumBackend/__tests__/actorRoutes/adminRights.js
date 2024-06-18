const request = require('supertest')
const app = require('../../app')

describe('Admin user rights on actor materials', () => {
  let token;
  let actorId;

  beforeAll( async ()=>{
    const createAdmin = await request(app.callback())
      .post('/api/v1/users')
      .send({
        firstName: 'first name',
        lastName: 'last name',
        username: 'actor_admin',
        password: 'password',
        role: 'admin'
      })
  });
   


  it('log in an admin user', async () => {
      const res = await request(app.callback())
        .post('/api/v1/login')
        .send({
          username: 'actor_admin',
          password: 'password',
        })
      expect(res.statusCode).toEqual(200)
      expect(res.body.username).toEqual('actor_admin')
      expect(res.body.role).toEqual('admin')
      token = res.body.token;
    })
  

  it('Admins should be able to create an actor', async () => {
    const res = await request(app.callback())
      .post('/api/v1/actors')
      .set('Authorization', `Bearer ${token}`)
      .send({
        firstName: 'New',
        lastName: 'Actor',
        avatarURL: 'example.img'
      })
    expect(res.statusCode).toEqual(200)
    expect(res.body.message).toEqual('Actor Creation Successful')
  })

  it('should get actors by last name', async () => {
    const res = await request(app.callback())
      .get('/api/v1/actors/search/Actor')
      
    expect(res.statusCode).toEqual(200)
    expect(res.body[0].firstName).toEqual('New')
    expect(res.body[0].lastName).toEqual('Actor')
    actorId = res.body[0].id
  })

  it('Admins should be able to update an actor', async () => {
      const res = await request(app.callback())
        .put(`/api/v1/actors/${actorId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          firstName: 'UPDATED'
        })
      expect(res.statusCode).toEqual(200)
      expect(res.body.message).toEqual('Actor Update Successful')
    })

  it('Admins should be able to delete an actor', async () => {
      const res = await request(app.callback())
        .del(`/api/v1/actors/${actorId}`)
        .set('Authorization', `Bearer ${token}`)
      expect(res.statusCode).toEqual(200)
      expect(res.body.message).toEqual('Deleted actor successfully')
  })
  

});