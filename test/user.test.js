import mongoose from 'mongoose';
import server from '../app.js';
import User from '../src/models/user.js';
import jwt from 'jsonwebtoken';
import request from 'supertest';

beforeAll((done) => {
    mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    mongoose.connection.once('open', () => {
        console.log('Connected to MongoDB');
        done();
    }).on('error', (error) => {
        console.warn('Error : ', error);
    });
});

beforeEach(async () => {
    // Assuming User is your Mongoose model
    await User.deleteMany({});
});

describe('Users', () => {
    describe('POST /users', () => {
        it('should POST a user', async () => {
            const user = {
                userName: "John Doe",
                accountNumber: 12345678,
                emailAddress: "john.doe@example.com",
                identityNumber: 1234567890
            };
            const res = await request(server)
                .post('/users')
                .set('Authorization', 'Bearer ' + jwt.sign({ _id: 'someid' }, process.env.JWT_SECRET))
                .send(user);

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('userName');
            expect(res.body).toHaveProperty('accountNumber');
            expect(res.body).toHaveProperty('emailAddress');
            expect(res.body).toHaveProperty('identityNumber');
        });
    });

    describe('GET /users/:accountNumber', () => {
        it('should GET a user by the given account number', async () => {
            const user = new User({
                userName: "Jane Doe",
                accountNumber: 87654321,
                emailAddress: "jane.doe@example.com",
                identityNumber: 9876543210
            });
            await user.save();
            const res = await request(server)
                .get('/users/account/' + user.accountNumber)
                .set('Authorization', 'Bearer ' + jwt.sign({ _id: 'someid' }, process.env.JWT_SECRET));

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('userName');
            expect(res.body).toHaveProperty('accountNumber');
            expect(res.body).toHaveProperty('emailAddress');
            expect(res.body).toHaveProperty('identityNumber');
        });
    });

    describe('PATCH /users/:accountNumber', () => {
        it('should UPDATE a user given the account number', async () => {
            const user = new User({
                userName: "Jane Doe",
                accountNumber: 87654321,
                emailAddress: "jane.doe@example.com",
                identityNumber: 9876543210
            });
            await user.save();
            const res = await request(server)
                .patch('/users/account/' + user.accountNumber)
                .set('Authorization', 'Bearer ' + jwt.sign({ _id: 'someid' }, process.env.JWT_SECRET))
                .send({ userName: "Jane Smith", emailAddress: "jane.smith@example.com" });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('userName', "Jane Smith");
            expect(res.body).toHaveProperty('emailAddress', "jane.smith@example.com");
        });
    });

    describe('DELETE /users/:accountNumber', () => {
        it('should DELETE a user given the account number', async () => {
            const user = new User({
                userName: "Jane Doe",
                accountNumber: 87654321,
                emailAddress: "jane.doe@example.com",
                identityNumber: 9876543210
            });
            await user.save();
            const res = await request(server)
                .delete('/users/account/' + user.accountNumber)
                .set('Authorization', 'Bearer ' + jwt.sign({ _id: 'someid' }, process.env.JWT_SECRET));

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('userName');
            expect(res.body).toHaveProperty('accountNumber');
            expect(res.body).toHaveProperty('emailAddress');
            expect(res.body).toHaveProperty('identityNumber');
        });
    });
});