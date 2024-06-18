const request = require('supertest')
const app = require('../../app')

describe('Should retrieve actors', () => {

  it('should get one actor by id', async () => {
    const res = await request(app.callback())
      .get('/api/v1/actors/1')
      
    expect(res.statusCode).toEqual(200)
    expect(res.body.firstName).toEqual('Jennifer')
    expect(res.body.lastName).toEqual('Lawrence')
  })

  it('should get multiple actors by id', async () => {
    const res = await request(app.callback())
      .get('/api/v1/actors/1,2')
      
    expect(res.statusCode).toEqual(200)
    expect(res.body[0].firstName).toEqual('Jennifer')
    expect(res.body[0].lastName).toEqual('Lawrence')
    expect(res.body[1].firstName).toEqual('Joshua')
    expect(res.body[1].lastName).toEqual('Hutcherson')
  })

  it('should get actors by last name', async () => {
    const res = await request(app.callback())
      .get('/api/v1/actors/search/Lawrence')
      
    expect(res.statusCode).toEqual(200)
    expect(res.body[0].firstName).toEqual('Jennifer')
    expect(res.body[0].lastName).toEqual('Lawrence')
  })
});

describe('Should handle no actors found appropriately', () => {

  it('should get one actor by id', async () => {
    const res = await request(app.callback())
      .get('/api/v1/actors/1000')
      
    expect(res.statusCode).toEqual(404)
    expect(res.body.error).toEqual('No actor found')
  })

  it('should get multiple actors by id', async () => {
    const res = await request(app.callback())
      .get('/api/v1/actors/100,3000')
      
    expect(res.statusCode).toEqual(404)
    expect(res.body.error).toEqual('No actors found')
  })

  it('should get one actor by last name', async () => {
    const res = await request(app.callback())
      .get('/api/v1/actors/search/FAKENAME')
      
    expect(res.statusCode).toEqual(404)
    expect(res.body.error).toEqual('No actors found')
  })
});