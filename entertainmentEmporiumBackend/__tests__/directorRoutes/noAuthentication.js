const request = require('supertest')
const app = require('../../app')

describe('Non authenticated rights on director materials', () => {
 
  it('Non authenticated users can not create directors', async () => {
    const res = await request(app.callback())
      .post('/api/v1/directors')
      .send({
        firstName: 'New',
        lastName: 'director',
        avatarURL: 'example.img'
      })
    expect(res.statusCode).toEqual(401)
    expect(res.error.text).toEqual('Unauthorized')
  })

  it('Non authenticated users can not update director', async () => {
      const res = await request(app.callback())
        .put(`/api/v1/directors/1`)
        .send({
          firstName: 'UPDATED'
        })
    expect(res.statusCode).toEqual(401)
    expect(res.error.text).toEqual('Unauthorized')
    })

  it('Non authenticated users cannot delete an director', async () => {
      const res = await request(app.callback())
        .del(`/api/v1/directors/1`)
    expect(res.statusCode).toEqual(401)
    expect(res.error.text).toEqual('Unauthorized')
  })
  

});