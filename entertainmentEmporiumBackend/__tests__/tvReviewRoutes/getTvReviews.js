const request = require('supertest')
const app = require('../../app')

describe('Should retrieve tvReviews', () => {

  it('should get tvReviews according to the tv id', async () => {
    const res = await request(app.callback())
      .get('/api/v1/tvReviews/1/1/2/ASC')
      
    expect(res.body.reviews[1].username).toEqual('smithk')
    expect(res.body.reviews[1].score).toEqual(4)
    expect(res.body.reviews[0].username).toEqual('pepe_silvia')
    expect(res.body.reviews[0].score).toEqual(2)
  })

  it('should get tvReview by a specific user for a specific tv', async () => {
    const res = await request(app.callback())
      .get('/api/v1/tvReviews/smithk/1')
      
    expect(res.statusCode).toEqual(200)
    expect(res.body[0].score).toEqual(4)
  })
});

describe('Should handle no tv reviews found appropriately', () => {

  it('should handle no tvReviews found for a tv id', async () => {
    const res = await request(app.callback())
      .get('/api/v1/tvReviews/1000/1/1/ASC')
      
    expect(res.statusCode).toEqual(404)
    expect(res.body.error).toEqual('No reviews made for this tv show')
  })

  it('should handle no tv Reviews found for a specific user', async () => {
    const res = await request(app.callback())
      .get('/api/v1/tvReviews/smithk/1000')
      
    expect(res.statusCode).toEqual(404)
    expect(res.body.error).toEqual('User has not made review for this tv show')
  })

});