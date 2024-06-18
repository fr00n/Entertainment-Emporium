const request = require('supertest')
const app = require('../../app')

// can create 
// can update their own review 
// can delete their own review 

describe('Verified user rights on movieReview materials', () => {
  let token;
  let movieReviewId;

  beforeAll( async ()=>{
    const createverified = await request(app.callback())
      .post('/api/v1/users')
      .send({
        firstName: 'first name',
        lastName: 'last name',
        username: 'movieReview_verified',
        password: 'password',
        role: 'verified'
      })
  });
   


  it('log in an verified user', async () => {
      const res = await request(app.callback())
        .post('/api/v1/login')
        .send({
          username: 'movieReview_verified',
          password: 'password',
        })
      expect(res.statusCode).toEqual(200)
      expect(res.body.username).toEqual('movieReview_verified')
      expect(res.body.role).toEqual('verified')
      token = res.body.token;
    })
  

  it('verifieds should be able to create an movieReview', async () => {
    const res = await request(app.callback())
      .post('/api/v1/movieReviews')
      .set('Authorization', `Bearer ${token}`)
      .send({
        score: 2,
        text: 'New movieReview',
        movieId: 2

      })
    expect(res.statusCode).toEqual(200)
    expect(res.body.message).toEqual('Movie Review Creation Successful')
  })

  it('should get movieReview by a specific user for a specific movie', async () => {
    const res = await request(app.callback())
      .get('/api/v1/movieReviews/movieReview_verified/2')
      
    expect(res.statusCode).toEqual(200)
    movieReviewId = res.body[0].id;
  })

  it('verifieds should be able to update their own movieReview', async () => {
      const res = await request(app.callback())
        .put(`/api/v1/movieReviews/${movieReviewId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          text: 'UPDATED movieReview',
          movieId: 2
        })
      expect(res.statusCode).toEqual(200)
      expect(res.body.message).toEqual('Movie Review Updated Successfully')
    })

    it('verifieds cannot update others movie reviews', async () => {
      const res = await request(app.callback())
        .put(`/api/v1/movieReviews/1`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          text: 'UPDATED movieReview'
        })
      expect(res.statusCode).toEqual(403)
      expect(res.body.error).toEqual('You are forbidden to update this review')
    })

  it('verifieds should be able to delete their own movieReview', async () => {
      const res = await request(app.callback())
        .del(`/api/v1/movieReviews/${movieReviewId}`)
        .set('Authorization', `Bearer ${token}`)
      expect(res.statusCode).toEqual(200)
      expect(res.body.message).toEqual('Movie Review Deleted Successfully')
  })

  it('verifieds should not be able to delete other movieReview', async () => {
      const res = await request(app.callback())
        .del(`/api/v1/movieReviews/1`)
        .set('Authorization', `Bearer ${token}`)
      expect(res.statusCode).toEqual(403)
      expect(res.body.error).toEqual('You are forbidden to delete this review')
  })
  

});