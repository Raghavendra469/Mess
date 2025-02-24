/*const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const supertest = require('supertest');
const express = require('express');
const userRouter = require('../../routes/userRoutes');
const userController = require('../../controllers/userController');

chai.use(sinonChai);

describe('User Router Tests', function() {
  let app;
  let request;
  let sandbox;

  before(function() {
    // Create Express app
    app = express();
    app.use(express.json());
    app.use('/users', userRouter);
    request = supertest(app);
    
    // Create a sinon sandbox for stubs
    sandbox = sinon.createSandbox();
  });

  afterEach(function() {
    // Restore all stubs after each test
    sandbox.restore();
  });

  describe('POST /', function() {
    it('should create a new user', function(done) {
      // Stub implementation
      const createUserStub = sandbox.stub(userController, 'createUser')
        .callsFake((req, res) => {
          res.status(201).json({ id: 1, username: 'testuser', email: 'test@example.com' });
        });

      // Test data
      const newUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      // Make request
      request
        .post('/users')
        .send(newUser)
        .expect('Content-Type', /json/)
        .expect(201)
        .end(function(err, res) {
          if (err) return done(err);
          
          expect(createUserStub.calledOnce).to.be.true;
          expect(res.body).to.have.property('id');
          expect(res.body.username).to.equal('testuser');
          done();
        });
    });
  });

  describe('GET /:username', function() {
    it('should get a user by username', function(done) {
      // Stub implementation
      const getUserStub = sandbox.stub(userController, 'getUserByUsername')
        .callsFake((req, res) => {
          res.status(200).json({ id: 1, username: 'testuser', email: 'test@example.com' });
        });

      // Make request
      request
        .get('/users/testuser')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          
          expect(getUserStub.calledOnce).to.be.true;
          expect(res.body.username).to.equal('testuser');
          done();
        });
    });

    it('should return 404 when user not found', function(done) {
      // Stub implementation
      const getUserStub = sandbox.stub(userController, 'getUserByUsername')
        .callsFake((req, res) => {
          res.status(404).json({ message: 'User not found' });
        });

      // Make request
      request
        .get('/users/nonexistentuser')
        .expect('Content-Type', /json/)
        .expect(404)
        .end(function(err, res) {
          if (err) return done(err);
          
          expect(getUserStub.calledOnce).to.be.true;
          expect(res.body.message).to.equal('User not found');
          done();
        });
    });
  });

  describe('PUT /:username', function() {
    it('should update a user', function(done) {
      // Stub implementation
      const updateUserStub = sandbox.stub(userController, 'updateUser')
        .callsFake((req, res) => {
          res.status(200).json({ id: 1, username: 'testuser', email: 'updated@example.com' });
        });

      // Test data
      const updatedUser = {
        email: 'updated@example.com'
      };

      // Make request
      request
        .put('/users/testuser')
        .send(updatedUser)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          
          expect(updateUserStub.calledOnce).to.be.true;
          expect(res.body.email).to.equal('updated@example.com');
          done();
        });
    });
  });

  describe('DELETE /:username', function() {
    it('should delete a user', function(done) {
      // Stub implementation
      const deleteUserStub = sandbox.stub(userController, 'deleteUser')
        .callsFake((req, res) => {
          res.status(200).json({ message: 'User deleted successfully' });
        });

      // Make request
      request
        .delete('/users/testuser')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          
          expect(deleteUserStub.calledOnce).to.be.true;
          expect(res.body.message).to.equal('User deleted successfully');
          done();
        });
    });
  });

  describe('GET /role/:role', function() {
    it('should get all users with specific role', function(done) {
      // Stub implementation
      const getAllUsersStub = sandbox.stub(userController, 'getAllUsers')
        .callsFake((req, res) => {
          res.status(200).json([
            { id: 1, username: 'user1', role: 'admin' },
            { id: 2, username: 'user2', role: 'admin' }
          ]);
        });

      // Make request
      request
        .get('/users/role/admin')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          
          expect(getAllUsersStub.calledOnce).to.be.true;
          expect(Array.isArray(res.body)).to.be.true;
          expect(res.body.length).to.equal(2);
          expect(res.body[0].role).to.equal('admin');
          done();
        });
    });

    it('should return empty array when no users with role found', function(done) {
      // Stub implementation
      const getAllUsersStub = sandbox.stub(userController, 'getAllUsers')
        .callsFake((req, res) => {
          res.status(200).json([]);
        });

      // Make request
      request
        .get('/users/role/nonexistentrole')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          
          expect(getAllUsersStub.calledOnce).to.be.true;
          expect(Array.isArray(res.body)).to.be.true;
          expect(res.body.length).to.equal(0);
          done();
        });
    });
  });

  describe('PUT /toggle/:id', function() {
    it('should toggle user active status', function(done) {
      // Stub implementation
      const toggleStatusStub = sandbox.stub(userController, 'toggleUserStatus')
        .callsFake((req, res) => {
          res.status(200).json({ id: 1, username: 'testuser', active: false });
        });

      // Make request
      request
        .put('/users/toggle/1')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          
          expect(toggleStatusStub.calledOnce).to.be.true;
          expect(res.body).to.have.property('active');
          expect(res.body.active).to.equal(false);
          done();
        });
    });
  });
});*/