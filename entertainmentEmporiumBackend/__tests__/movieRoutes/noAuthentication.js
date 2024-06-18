const request = require('supertest')
const app = require('../../app')

describe('No authentication rights on movie materials', () => {


  it('Unauthenticates users should not be able to create an movie', async () => {
    const res = await request(app.callback())
      .post('/api/v1/movies')
      .send({
        title: 'New Movie'
      })
    expect(res.statusCode).toEqual(401)
    expect(res.error.text).toEqual('Unauthorized')
  })


  it('Unauthenticates users should not be able to update an movie', async () => {
      const res = await request(app.callback())
        .put(`/api/v1/movies/1`)
        .send({
          title: 'UPDATED Movie'
        })
      expect(res.statusCode).toEqual(401)
      expect(res.error.text).toEqual('Unauthorized')
    })

  it('Unauthenticates users should not be able to delete an movie', async () => {
      const res = await request(app.callback())
        .del(`/api/v1/movies/1`)
      
      expect(res.statusCode).toEqual(401)
      expect(res.error.text).toEqual('Unauthorized')
  })
  

});