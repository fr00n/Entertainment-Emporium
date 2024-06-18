const request = require('supertest')
const app = require('../../app')

describe('Non authenticated rights on actor materials', () => {
 
  it('Non authenticated users can not create actors', async () => {
    const res = await request(app.callback())
      .post('/api/v1/actors')
      .send({
        firstName: 'New',
        lastName: 'Actor',
        avatarURL: 'example.img'
      })
    expect(res.statusCode).toEqual(401)
    expect(res.error.text).toEqual('Unauthorized')
  })

  it('Non authenticated users can not update actor', async () => {
      const res = await request(app.callback())
        .put(`/api/v1/actors/1`)
        .send({
          firstName: 'UPDATED'
        })
    expect(res.statusCode).toEqual(401)
    expect(res.error.text).toEqual('Unauthorized')
    })

  it('Non authenticated users cannot delete an actor', async () => {
      const res = await request(app.callback())
        .del(`/api/v1/actors/1`)
    expect(res.statusCode).toEqual(401)
    expect(res.error.text).toEqual('Unauthorized')
  })
  

});