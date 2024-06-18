const request = require('supertest')
const app = require('../../app')

describe('Non authenticated user rights on user materials', () => {
 
  it('Reject request for user by id', async () => {
    const res = await request(app.callback())
      .get('/api/v1/users/1')
      

    expect(res.statusCode).toEqual(401)
    expect(res.error.text).toEqual('Unauthorized')
   
  })

   it('Reject request for user by username', async () => {
    const res = await request(app.callback())
      .get('/api/v1/users/passmoref')
     

    expect(res.statusCode).toEqual(401)
    expect(res.error.text).toEqual('Unauthorized')
  })
  

  it('Reject request to update an account', async () => {
      const res = await request(app.callback())
        .put(`/api/v1/users/1`)
        .send({
          firstName: 'NEW'
        })
      expect(res.statusCode).toEqual(401)
      expect(res.error.text).toEqual('Unauthorized')
    })


  it('Reject request to delete an account', async () => {
      const res = await request(app.callback())
        .del(`/api/v1/users/1`)
      expect(res.statusCode).toEqual(401)
      expect(res.error.text).toEqual('Unauthorized')
  })
  

});