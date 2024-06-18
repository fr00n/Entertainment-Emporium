const request = require('supertest')
const app = require('../../app')

beforeAll( async ()=>{
  const createAdmin = await request(app.callback())
      .post('/api/v1/users')
      .send({
        firstName: 'first name',
        lastName: 'last name',
        username: 'adminTODELETE',
        password: 'password',
        role: 'admin'
      })

  const createVerified = await request(app.callback())
      .post('/api/v1/users')
      .send({
        firstName: 'first name',
        lastName: 'last name',
        username: 'verifiedTODELETE',
        password: 'password',
        role: 'verified'
      })

  const createUser = await request(app.callback())
      .post('/api/v1/users')
      .send({
        firstName: 'first name',
        lastName: 'last name',
        username: 'userTODELETE',
        password: 'password',
      })
});
describe('Admin user rights on user materials', () => {
  let token;
  let testerId;
  let userId;
  let verifiedId;
  let adminId;

  it('should create an admin', async () => {
    const res = await request(app.callback())
      .post('/api/v1/users')
      .send({
        firstName: 'first name',
        lastName: 'last name',
        username: 'admin_user',
        password: 'password',
        role: 'admin'
      })
    expect(res.statusCode).toEqual(200)
    expect(res.body.message).toEqual('Account Creation Successful')
  })

  it('log in an admin user', async () => {
      const res = await request(app.callback())
        .post('/api/v1/login')
        .send({
          username: 'admin_user',
          password: 'password',
        })
      expect(res.statusCode).toEqual(200)
      expect(res.body.username).toEqual('admin_user')
      expect(res.body.role).toEqual('admin')
      token = res.body.token;
      testerId = res.body.id;
    })
  
  it('Allows admin to view own details when getting by id', async () => {
    const res = await request(app.callback())
      .get(`/api/v1/users/${testerId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toEqual(200)
    expect(res.body.role).toEqual('admin')
    expect(res.body.firstName).toEqual('first name')
    expect(res.body.lastName).toEqual('last name')
    expect(res.body.username).toEqual('admin_user')
  })

   it('Allows admin to view user details when getting by username', async () => {
    const res = await request(app.callback())
      .get('/api/v1/users/userTODELETE')
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toEqual(200)
    expect(res.body.role).toEqual('user')
    expect(res.body.firstName).toEqual('first name')
    expect(res.body.lastName).toEqual('last name')
    expect(res.body.username).toEqual('userTODELETE')
    userId = res.body.id;
  })

   it('Allows admin to view verified details when getting by username', async () => {
    const res = await request(app.callback())
      .get('/api/v1/users/verifiedTODELETE')
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toEqual(200)
    expect(res.body.role).toEqual('verified')
    expect(res.body.firstName).toEqual('first name')
    expect(res.body.lastName).toEqual('last name')
    expect(res.body.username).toEqual('verifiedTODELETE')
    verifiedId = res.body.id;
  })

   it('Allows admin to view user details when getting by username', async () => {
    const res = await request(app.callback())
      .get('/api/v1/users/adminTODELETE')
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toEqual(200)
    expect(res.body.role).toEqual('admin')
    expect(res.body.firstName).toEqual('first name')
    expect(res.body.lastName).toEqual('last name')
    expect(res.body.username).toEqual('adminTODELETE')
    adminId = res.body.id;
  })
  
  it('Should throw not found error when no user for get by id', async () => {
    const res = await request(app.callback())
      .get('/api/v1/users/100')
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toEqual(404)
    expect(res.body.error).toEqual('No user found')
  })

  it('Should throw not found error when no user for get by username', async () => {
    const res = await request(app.callback())
      .get('/api/v1/users/usernamenotexist')
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toEqual(404)
    expect(res.body.error).toEqual('No user found')
  })

  it('Admins should be able to update their own account', async () => {
      const res = await request(app.callback())
        .put(`/api/v1/users/${testerId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          firstName: 'NEW'
        })
      expect(res.statusCode).toEqual(200)
      expect(res.body.message).toEqual('Account Update Successful')
    })

  it('Admins should be able to update other admin', async () => {
      const res = await request(app.callback())
        .put(`/api/v1/users/${adminId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          firstName: 'NEW'
        })
      expect(res.statusCode).toEqual(200)
      expect(res.body.message).toEqual('Account Update Successful')
    })

  it('Admins should be able to update verified accounts', async () => {
      const res = await request(app.callback())
        .put(`/api/v1/users/${verifiedId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          firstName: 'NEW'
        })
      expect(res.statusCode).toEqual(200)
      expect(res.body.message).toEqual('Account Update Successful')
    })
  
  it('Admins should be able to update user accounts', async () => {
      const res = await request(app.callback())
        .put(`/api/v1/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          firstName: 'NEW'
        })
      expect(res.statusCode).toEqual(200)
      expect(res.body.message).toEqual('Account Update Successful')
    })

  it('Admins cannot delete their own account', async () => {
      const res = await request(app.callback())
        .del(`/api/v1/users/${testerId}`)
        .set('Authorization', `Bearer ${token}`)
      expect(res.statusCode).toEqual(403)
      expect(res.body.error).toEqual('You are forbidden to delete this user')
    })

  it('Admins can delete other admin accounts', async () => {
      const res = await request(app.callback())
        .del(`/api/v1/users/${adminId}`)
        .set('Authorization', `Bearer ${token}`)
      expect(res.statusCode).toEqual(200)
      expect(res.body.message).toEqual('User deleted')
  })

  it('Admins can delete other verified accounts', async () => {
      const res = await request(app.callback())
        .del(`/api/v1/users/${verifiedId}`)
        .set('Authorization', `Bearer ${token}`)
      expect(res.statusCode).toEqual(200)
      expect(res.body.message).toEqual('User deleted')
  })

  it('Admins can delete other user accounts', async () => {
      const res = await request(app.callback())
        .del(`/api/v1/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
      expect(res.statusCode).toEqual(200)
      expect(res.body.message).toEqual('User deleted')
  })
  

});