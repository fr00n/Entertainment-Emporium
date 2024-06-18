const request = require('supertest')
const app = require('../../app')

describe('No authentication rights on tvReview materials', () => {


  it('Unauthenticated users should not be able to create an tvReview', async () => {
    const res = await request(app.callback())
      .post('/api/v1/tvReviews')
      .send({
        score: 2,
        text: 'New tvReview',
        tvId: 2
      })
    expect(res.statusCode).toEqual(401)
    expect(res.error.text).toEqual('Unauthorized')
  })


  it('Unauthenticated users should not be able to update an tvReview', async () => {
      const res = await request(app.callback())
        .put(`/api/v1/tvReviews/1`)
        .send({
          text: 'New tvReview'
        })
      expect(res.statusCode).toEqual(401)
      expect(res.error.text).toEqual('Unauthorized')
    })

  it('Unauthenticated users should not be able to delete an tvReview', async () => {
      const res = await request(app.callback())
        .del(`/api/v1/tvReviews/3`)
      
      expect(res.statusCode).toEqual(401)
      expect(res.error.text).toEqual('Unauthorized')
  })
  

});