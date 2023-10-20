const app=require('../index');
const { post,get  }=require('../Routes/userProfile');
const supertest = require('supertest');

jest.setTimeout(20000);

test('Is GET a function',async()=>{
    expect(typeof get).toEqual('function');
});


test('Is POST a function',async()=>{
    expect(typeof post).toEqual('function');
});

test('Should post the data to database',async()=>{
    id='test@gmail.com'
    const resp = await supertest(app).post(`/api/v1/userprofile/:${id}`).send({
        image:'test',
    });
    console.log(resp);
    expect(resp.status).toEqual(200);
})

test('Should post the data to database',async()=>{
    const resp = await supertest(app).post('/api/v1/userprofile/:id').send({
        id :'test@gmail.com',
        image:'test',
    });
    console.log(resp);
    expect(resp.status).toEqual(200);
})

test('Should post the data to database without request body',async()=>{
    const resp = await supertest(app).post('/api/v1/userprofile/:id').send({
        id :'test@gmail.com'
    });
    console.log(resp);
    expect(resp.status).toEqual(404);
})

test('should get a user for user by passing noteID', async() => {
    id ='test@gmail.com'
    const resp = await supertest(app).get(`/api/v1/userprofile?id=${id}`)
    console.log(resp);
    expect(resp.status).toEqual(200);
});

test('Should get the data from database for particular id',async()=>{
    const resp = await supertest(app).get('/api/v1/userprofile').send({
        id :'itest@gmail.com'
    });
    expect(resp.status).toEqual(404);
})



//db has records
test('Should get the data from database',async()=>{
    const resp = await supertest(app).get('/api/v1/userprofiles')
    expect(resp.status).toEqual(200);
})



test('should get a user for user by passing noteID', async() => {
    id ='test@gmail.com'
    const resp = await supertest(app).delete(`/api/v1/userprofile?id=${id}`)
    console.log(resp);
    expect(resp.status).toEqual(200);
});

test('Should get the data from database for particular id',async()=>{
    const resp = await supertest(app).delete(`/api/v1/userprofile?id=${id}`)
    expect(resp.status).toEqual(404);
})

