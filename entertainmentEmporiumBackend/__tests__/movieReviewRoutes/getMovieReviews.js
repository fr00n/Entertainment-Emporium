const request = require('supertest')
const app = require('../../app')

describe('Should retrieve movieReviews', () => {

  it('should get movieReviews according to the movie id', async () => {
    const res = await request(app.callback())
      .get('/api/v1/movieReviews/1/1/2/ASC')
      
    expect(res.body.reviews[0].username).toEqual('smithk')
    expect(res.body.reviews[0].score).toEqual(5)
    expect(res.body.reviews[1].username).toEqual('pepe_silvia')
    expect(res.body.reviews[1].score).toEqual(5)
  })

  it('should get movieReview by a specific user for a specific movie', async () => {
    const res = await request(app.callback())
      .get('/api/v1/movieReviews/smithk/1')
      
    expect(res.statusCode).toEqual(200)
    expect(res.body[0].score).toEqual(5)
  })
});

describe('Should handle no movie reviews found appropriately', () => {

  it('should handle no movieReviews found for a movie id', async () => {
    const res = await request(app.callback())
      .get('/api/v1/movieReviews/1000/1/1/ASC')
      
    expect(res.statusCode).toEqual(404)
    expect(res.body.error).toEqual('No reviews made for this movie')
  })

  it('should handle no movie Reviews found for a specific user', async () => {
    const res = await request(app.callback())
      .get('/api/v1/movieReviews/smithk/1000')
      
    expect(res.statusCode).toEqual(404)
    expect(res.body.error).toEqual('User has not made review for this movie')
  })

});