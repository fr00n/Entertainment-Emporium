const request = require('supertest')
const app = require('../../app')

describe('No authentication rights on tv materials', () => {


  it('Unauthenticated users should not be able to create a tv', async () => {
    const res = await request(app.callback())
      .post('/api/v1/tv')
      .send({
        title: 'New tv'
      })
    expect(res.statusCode).toEqual(401)
    expect(res.error.text).toEqual('Unauthorized')
  })


  it('Unauthenticated users should not be able to update a tv', async () => {
      const res = await request(app.callback())
        .put(`/api/v1/tv/1`)
        .send({
          title: 'UPDATED tv'
        })
      expect(res.statusCode).toEqual(401)
      expect(res.error.text).toEqual('Unauthorized')
    })

  it('Unauthenticated users should not be able to delete a tv', async () => {
      const res = await request(app.callback())
        .del(`/api/v1/tv/1`)
      
      expect(res.statusCode).toEqual(401)
      expect(res.error.text).toEqual('Unauthorized')
  })
  

});