const request = require('supertest')
const app = require('../../app')

describe('Should retrieve movies', () => {

  it('should get one movie id', async () => {
    const res = await request(app.callback())
      .get('/api/v1/movies/1')
      
    expect(res.statusCode).toEqual(200)
    expect(res.body.title).toEqual('The Hunger Games')
    expect(res.body.runtime).toEqual(142)
  })

  it('should get multiple movies with pagination', async () => {
    const res = await request(app.callback())
      .get('/api/v1/movies/1/1/audiencePercentage/DESC')
      
    expect(res.statusCode).toEqual(200)
    expect(res.body.movies[0].title).toEqual('The Hunger Games')
    expect(res.body.movies[0].runtime).toEqual(142)
  })

  it('should get movies by their title', async () => {
    const res = await request(app.callback())
      .get('/api/v1/movies/Games')
      
    expect(res.statusCode).toEqual(200)
    expect(res.body[0].title).toEqual('The Hunger Games')
    expect(res.body[0].runtime).toEqual(142)
  })
});

describe('Should handle no movies found appropriately', () => {

  it('should handle no movie found by id', async () => {
    const res = await request(app.callback())
      .get('/api/v1/movies/1000')
      
    expect(res.statusCode).toEqual(404)
    expect(res.body.error).toEqual('No Movie Found')
  })

  it('should handle no movies found with pagination', async () => {
    const res = await request(app.callback())
      .get('/api/v1/movies/2/100/audiencePercentage/ASC')
      
    expect(res.statusCode).toEqual(404)
    expect(res.body.error).toEqual('No Movies Found')
  })

  it('should handle no movies found by title', async () => {
    const res = await request(app.callback())
      .get('/api/v1/movies/FAKENAME')
      
    expect(res.statusCode).toEqual(404)
    expect(res.body.error).toEqual('No Movies Found')
  })
});