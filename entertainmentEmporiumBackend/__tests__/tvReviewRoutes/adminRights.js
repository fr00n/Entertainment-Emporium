const request = require('supertest')
const app = require('../../app')


describe('Admin user rights on tvReview materials', () => {
  let token;
  let tvReviewId;

  beforeAll( async ()=>{
    const createAdmin = await request(app.callback())
      .post('/api/v1/users')
      .send({
        firstName: 'first name',
        lastName: 'last name',
        username: 'tvReview_admin',
        password: 'password',
        role: 'admin'
      })
  });
   


  it('log in an admin user', async () => {
      const res = await request(app.callback())
        .post('/api/v1/login')
        .send({
          username: 'tvReview_admin',
          password: 'password',
        })
      expect(res.statusCode).toEqual(200)
      expect(res.body.username).toEqual('tvReview_admin')
      expect(res.body.role).toEqual('admin')
      token = res.body.token;
    })
  

  it('Admins should be able to create an tvReview', async () => {
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
      .get('/api/v1/tvReviews/tvReview_admin/2')
      
    expect(res.statusCode).toEqual(200)
    tvReviewId = res.body[0].id;
  })

  it('Admins should be able to update their own tvReview', async () => {
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

    it('Admins cannot update others tv reviews', async () => {
      const res = await request(app.callback())
        .put(`/api/v1/tvReviews/3`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          text: 'UPDATED tvReview',
          tvId: 2
        })
      expect(res.statusCode).toEqual(403)
      expect(res.body.error).toEqual('You are forbidden to update this review')
    })

  it('Admins should be able to delete an tvReview', async () => {
      const res = await request(app.callback())
        .del(`/api/v1/tvReviews/${tvReviewId}`)
        .set('Authorization', `Bearer ${token}`)
      expect(res.statusCode).toEqual(200)
      expect(res.body.message).toEqual('Tv Review Deleted Successfully')
  })
  

});