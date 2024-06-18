const request = require('supertest')
const app = require('../../app')

describe('Should retrieve directors', () => {

  it('should get one director by id', async () => {
    const res = await request(app.callback())
      .get('/api/v1/directors/1')
      
    expect(res.statusCode).toEqual(200)
    expect(res.body.firstName).toEqual('Francis')
    expect(res.body.lastName).toEqual('Lawrence')
  })

  it('should get multiple directors by id', async () => {
    const res = await request(app.callback())
      .get('/api/v1/directors/1,2')
      
    expect(res.statusCode).toEqual(200)
    expect(res.body[0].firstName).toEqual('Francis')
    expect(res.body[0].lastName).toEqual('Lawrence')
    expect(res.body[1].firstName).toEqual('Gary')
    expect(res.body[1].lastName).toEqual('Ross')
  })

  it('should get directors by last name', async () => {
    const res = await request(app.callback())
      .get('/api/v1/directors/search/Lawrence')
      
    expect(res.statusCode).toEqual(200)
    expect(res.body[0].firstName).toEqual('Francis')
    expect(res.body[0].lastName).toEqual('Lawrence')
  })
});

describe('Should handle no directors found appropriately', () => {

  it('should get one director by id', async () => {
    const res = await request(app.callback())
      .get('/api/v1/directors/1000')
      
    expect(res.statusCode).toEqual(404)
    expect(res.body.error).toEqual('No director found')
  })

  it('should get multiple directors by id', async () => {
    const res = await request(app.callback())
      .get('/api/v1/directors/100,3000')
      
    expect(res.statusCode).toEqual(404)
    expect(res.body.error).toEqual('No directors found')
  })

  it('should get one director by last name', async () => {
    const res = await request(app.callback())
      .get('/api/v1/directors/search/FAKENAME')
      
    expect(res.statusCode).toEqual(404)
    expect(res.body.error).toEqual('No directors found')
  })
});