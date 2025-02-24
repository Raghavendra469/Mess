// test/setup.js
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
// const chaiAsPromised = require('chai-as-promised');

chai.use(sinonChai);
// chai.use(chaiAsPromised);

before(async () => {
    const chaiAsPromised = await import('chai-as-promised');
    chai.use(chaiAsPromised.default);
  });

// Mock mongoose models to avoid actual DB connections
const mongoose = require('mongoose');

// Global mock for ObjectId
global.ObjectId = mongoose.Types.ObjectId;

// Reset all stubs after each test
afterEach(() => {
  sinon.restore();
});

// Helper functions for testing
const testUtils = {
  createMockResponse: () => {
    return {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
      send: sinon.stub()
    };
  },
  
  mockMongooseModel: (modelName) => {
    const mockModel = {
      create: sinon.stub(),
      find: sinon.stub(),
      findOne: sinon.stub(),
      findById: sinon.stub(),
      findByIdAndUpdate: sinon.stub(),
      findByIdAndDelete: sinon.stub(),
      findOneAndUpdate: sinon.stub(),
      findOneAndDelete: sinon.stub(),
      updateOne: sinon.stub(),
      deleteOne: sinon.stub(),
      aggregate: sinon.stub()
    };
    
    sinon.stub(mongoose, 'model').withArgs(modelName).returns(mockModel);
    
    return mockModel;
  }
};

module.exports = testUtils;