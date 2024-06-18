const request = require('supertest')
const app = require('../../app')

describe('No authentication rights on movieReview materials', () => {


  it('Unauthenticates users should not be able to create an movieReview', async () => {
    const res = await request(app.callback())
      .post('/api/v1/movieReviews')
      .send({
        title: 'New movieReview'
      })
    expect(res.statusCode).toEqual(401)
    expect(res.error.text).toEqual('Unauthorized')
  })


  it('Unauthenticates users should not be able to update an movieReview', async () => {
      const res = await request(app.callback())
        .put(`/api/v1/movieReviews/1`)
        .send({
          title: 'UPDATED movieReview'
        })
      expect(res.statusCode).toEqual(401)
      expect(res.error.text).toEqual('Unauthorized')
    })

  it('Unauthenticates users should not be able to delete an movieReview', async () => {
      const res = await request(app.callback())
        .del(`/api/v1/movieReviews/1`)
      
      expect(res.statusCode).toEqual(401)
      expect(res.error.text).toEqual('Unauthorized')
  })
  

});