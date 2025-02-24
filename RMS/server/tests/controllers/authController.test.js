const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
// const chaiAsPromised = require('chai-as-promised');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { expect } = chai;

const User = require('../../models/userModel');
const { login, verify, forgotPassword, resetPassword } = require('../../controllers/authController');

chai.use(sinonChai);
// chai.use(chaiAsPromised);
before(async () => {
    const chaiAsPromised = await import('chai-as-promised');
    chai.use(chaiAsPromised.default);
  });

describe('Authentication Controller', () => {
  let req, res, userStub, jwtStub, bcryptStub, mockTransporter;

  beforeEach(() => {
    // Reset stubs and spies
    req = {
      body: {},
      params: {},
      user: {}
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };

    // Stub User model methods
    userStub = sinon.stub(User, 'findOne');
    userStub.findByIdAndUpdate = sinon.stub(User, 'findByIdAndUpdate');

    // Stub JWT
    jwtStub = sinon.stub(jwt, 'sign').returns('mock-token');
    sinon.stub(jwt, 'verify').returns({ id: 'mock-id' });

    // Stub bcrypt
    bcryptStub = sinon.stub(bcrypt, 'compare');
    sinon.stub(bcrypt, 'hash').resolves('hashed-password');

    // Mock nodemailer
    mockTransporter = {
      sendMail: sinon.stub().callsFake((mailOptions, callback) => callback(null, 'sent'))
    };
    sinon.stub(nodemailer, 'createTransport').returns(mockTransporter);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('login', () => {
    it('should successfully login a user', async () => {
      // Arrange
      const mockUser = {
        _id: 'user-id',
        email: 'test@example.com',
        password: 'hashed-password',
        username: 'testuser',
        role: 'user',
        isActive: true,
        isFirstLogin: false
      };

      req.body = {
        email: 'test@example.com',
        password: 'password123'
      };

      userStub.resolves(mockUser);
      bcryptStub.resolves(true);

      // Act
      await login(req, res);

      // Assert
      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith({
        success: true,
        token: 'mock-token',
        user: {
          _id: mockUser._id,
          username: mockUser.username,
          email: mockUser.email,
          role: mockUser.role,
          isActive: mockUser.isActive,
          isFirstLogin: mockUser.isFirstLogin
        }
      });
    });

    it('should handle non-existent user', async () => {
      // Arrange
      req.body = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      userStub.resolves(null);

      // Act
      await login(req, res);

      // Assert
      expect(res.status).to.have.been.calledWith(404);
      expect(res.json).to.have.been.calledWith({
        success: false,
        error: 'User not found'
      });
    });

    it('should handle inactive user', async () => {
      // Arrange
      const mockUser = {
        email: 'inactive@example.com',
        isActive: false
      };

      req.body = {
        email: 'inactive@example.com',
        password: 'password123'
      };

      userStub.resolves(mockUser);

      // Act
      await login(req, res);

      // Assert
      expect(res.status).to.have.been.calledWith(403);
      expect(res.json).to.have.been.calledWith({
        success: false,
        error: 'User is not active'
      });
    });

    it('should handle first time login', async () => {
      // Arrange
      const mockUser = {
        email: 'firsttime@example.com',
        isActive: true,
        isFirstLogin: true
      };

      req.body = {
        email: 'firsttime@example.com',
        password: 'password123'
      };

      userStub.resolves(mockUser);

      // Act
      await login(req, res);

      // Assert
      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith({
        success: false,
        loginStatus: { status: 'first time login' }
      });
    });
  });

  describe('verify', () => {
    it('should verify user successfully', () => {
      // Arrange
      req.user = {
        _id: 'user-id',
        username: 'testuser'
      };

      // Act
      verify(req, res);

      // Assert
      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith({
        success: true,
        user: req.user
      });
    });
  });

  describe('forgotPassword', () => {
    it('should send reset password email successfully', async () => {
      // Arrange
      const mockUser = {
        _id: 'user-id',
        email: 'test@example.com'
      };

      req.body = {
        email: 'test@example.com'
      };

      userStub.resolves(mockUser);

      // Act
      await forgotPassword(req, res);

      // Assert
      expect(mockTransporter.sendMail).to.have.been.called;
      expect(res.json).to.have.been.calledWith({
        success: true,
        message: 'Password reset email sent successfully'
      });
    });

    it('should handle non-existent user for password reset', async () => {
      // Arrange
      req.body = {
        email: 'nonexistent@example.com'
      };

      userStub.resolves(null);

      // Act
      await forgotPassword(req, res);

      // Assert
      expect(res.status).to.have.been.calledWith(404);
      expect(res.json).to.have.been.calledWith({
        success: false,
        message: 'User not found'
      });
    });
  });

  describe('resetPassword', () => {
    it('should reset password successfully', async () => {
      // Arrange
      req.params = {
        id: 'user-id',
        token: 'valid-token'
      };
      req.body = {
        password: 'newpassword123'
      };

      userStub.findByIdAndUpdate.resolves({});

      // Act
      await resetPassword(req, res);

      // Assert
      expect(res.json).to.have.been.calledWith({
        success: true,
        message: 'Password reset successful'
      });
    });

    it('should handle invalid token', async () => {
      // Arrange
      req.params = {
        id: 'user-id',
        token: 'invalid-token'
      };
      req.body = {
        password: 'newpassword123'
      };

      jwt.verify.throws(new Error('Invalid token'));

      // Act
      await resetPassword(req, res);

      // Assert
      expect(res.status).to.have.been.calledWith(500);
      expect(res.json).to.have.been.calledWith({
        success: false,
        message: 'Internal server error'
      });
    });
  });
});