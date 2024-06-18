const request = require('supertest')
const app = require('../../app')

// can create 
// can delete any review 
// can only update their own review 

describe('Admin user rights on movieReview materials', () => {
  let token;
  let movieReviewId;

  beforeAll( async ()=>{
    const createAdmin = await request(app.callback())
      .post('/api/v1/users')
      .send({
        firstName: 'first name',
        lastName: 'last name',
        username: 'movieReview_admin',
        password: 'password',
        role: 'admin'
      })
  });
   


  it('log in an admin user', async () => {
      const res = await request(app.callback())
        .post('/api/v1/login')
        .send({
          username: 'movieReview_admin',
          password: 'password',
        })
      expect(res.statusCode).toEqual(200)
      expect(res.body.username).toEqual('movieReview_admin')
      expect(res.body.role).toEqual('admin')
      token = res.body.token;
    })
  

  it('Admins should be able to create an movieReview', async () => {
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
      .get('/api/v1/movieReviews/movieReview_admin/2')
      
    expect(res.statusCode).toEqual(200)
    movieReviewId = res.body[0].id;
  })

  it('Admins should be able to update their own movieReview', async () => {
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

    it('Admins cannot update others movie reviews', async () => {
      const res = await request(app.callback())
        .put(`/api/v1/movieReviews/1`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          text: 'UPDATED movieReview',
          movieId: 2
        })
      expect(res.statusCode).toEqual(403)
      expect(res.body.error).toEqual('You are forbidden to update this review')
    })

  it('Admins should be able to delete an movieReview', async () => {
      const res = await request(app.callback())
        .del(`/api/v1/movieReviews/${movieReviewId}`)
        .set('Authorization', `Bearer ${token}`)
      expect(res.statusCode).toEqual(200)
      expect(res.body.message).toEqual('Movie Review Deleted Successfully')
  })
  

});