const request = require('supertest')
const app = require('../../app')

describe('Should retrieve tv', () => {

  it('should get one movie id', async () => {
    const res = await request(app.callback())
      .get('/api/v1/tv/1')
      
    expect(res.statusCode).toEqual(200)
    expect(res.body.title).toEqual('Game of Thrones')
    expect(res.body.seasons).toEqual(8)
  })

  it('should get multiple tv with pagination', async () => {
    const res = await request(app.callback())
      .get('/api/v1/tv/1/1/audiencePercentage/DESC')
      
    expect(res.statusCode).toEqual(200)
    expect(res.body.tv[0].title).toEqual('Game of Thrones')
    expect(res.body.tv[0].seasons).toEqual(8)
  })

  it('should get tv by their title', async () => {
    const res = await request(app.callback())
      .get('/api/v1/tv/Game')
      
    expect(res.statusCode).toEqual(200)
    expect(res.body[0].title).toEqual('Game of Thrones')
    expect(res.body[0].seasons).toEqual(8)
  })
});

describe('Should handle no tv found appropriately', () => {

  it('should handle no movie found by id', async () => {
    const res = await request(app.callback())
      .get('/api/v1/tv/1000')
      
    expect(res.statusCode).toEqual(404)
    expect(res.body.error).toEqual('No Tv Show Found')
  })

  it('should handle no tv found with pagination', async () => {
    const res = await request(app.callback())
      .get('/api/v1/tv/2/100/audiencePercentage/ASC')
      
    expect(res.statusCode).toEqual(404)
    expect(res.body.error).toEqual('No Tv Shows Found')
  })

  it('should handle no tv found by title', async () => {
    const res = await request(app.callback())
      .get('/api/v1/tv/FAKENAME')
      
    expect(res.statusCode).toEqual(404)
    expect(res.body.error).toEqual('No Tv Shows Found')
  })
});