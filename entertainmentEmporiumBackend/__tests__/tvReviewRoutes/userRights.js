const request = require('supertest')
const app = require('../../app')

// can create 
// can update their own review 
// can delete their own review 

describe('Normal user rights on tvReview materials', () => {
  let token;
  let tvReviewId;

  beforeAll( async ()=>{
    const createuser = await request(app.callback())
      .post('/api/v1/users')
      .send({
        firstName: 'first name',
        lastName: 'last name',
        username: 'tvReview_user',
        password: 'password'
      })
  });
   


  it('log in an user user', async () => {
      const res = await request(app.callback())
        .post('/api/v1/login')
        .send({
          username: 'tvReview_user',
          password: 'password',
        })
      expect(res.statusCode).toEqual(200)
      expect(res.body.username).toEqual('tvReview_user')
      expect(res.body.role).toEqual('user')
      token = res.body.token;
    })
  

  it('users should be able to create an tvReview', async () => {
    const res = await request(app.callback())
      .post('/api/v1/tvReviews')
      .set('Authorization', `Bearer ${token}`)
      .send({
        score: 2,
        text: 'New tvReview',
        tvId: 2

      })
    expect(res.statusCode).toEqual(200)
    expect(res.body.message).toEqual('Tv Review Creation Successful')
  })

  it('should get tvReview by a specific user for a specific tv', async () => {
    const res = await request(app.callback())
      .get('/api/v1/tvReviews/tvReview_user/2')
      
    expect(res.statusCode).toEqual(200)
    tvReviewId = res.body[0].id;
  })

  it('users should be able to update their own tvReview', async () => {
      const res = await request(app.callback())
        .put(`/api/v1/tvReviews/${tvReviewId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          text: 'UPDATED tvReview',
          tvId: 2
        })
      expect(res.statusCode).toEqual(200)
      expect(res.body.message).toEqual('Tv Review Updated Successfully')
    })

    it('users cannot update others tv reviews', async () => {
      const res = await request(app.callback())
        .put(`/api/v1/tvReviews/3`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          text: 'UPDATED tvReview'
        })
      expect(res.statusCode).toEqual(403)
      expect(res.body.error).toEqual('You are forbidden to update this review')
    })

  it('users should be able to delete their own tvReview', async () => {
      const res = await request(app.callback())
        .del(`/api/v1/tvReviews/${tvReviewId}`)
        .set('Authorization', `Bearer ${token}`)
      expect(res.statusCode).toEqual(200)
      expect(res.body.message).toEqual('Tv Review Deleted Successfully')
  })

  it('users should not be able to delete other tvReview', async () => {
      const res = await request(app.callback())
        .del(`/api/v1/tvReviews/3`)
        .set('Authorization', `Bearer ${token}`)
      expect(res.statusCode).toEqual(403)
      expect(res.body.error).toEqual('You are forbidden to delete this tv review')
  })
  

});