// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const sinon = require('sinon');
// const { expect } = chai;
// const app = require('../../index.js'); // Adjust path as needed
// const CollaborationService = require('../../services/collaborationService');
// const { verifyUser } = require('../../middleware/authMiddleware');

// chai.use(chaiHttp);

// // Stubbing Services
// let collaborationServiceStub;
// let verifyUserStub;

// describe('Collaboration Routes', () => {
//     beforeEach(() => {
//         collaborationServiceStub = sinon.createStubInstance(CollaborationService);
//         verifyUserStub = sinon.stub().callsFake((req, res, next) => next());
//     });

//     afterEach(() => {
//         sinon.restore();
//     });

//     it('should return 404 if user is not found', async () => {
//         verifyUserStub.callsFake((req, res, next) => {
//             return res.status(404).json({ success: false, error: 'User not found' });
//         });

//         const res = await chai.request(app)
//             .post('/api/collaborations')
//             .set('Authorization', 'Bearer fake-token')
//             .send({});

//         expect(res).to.have.status(404);
//         expect(res.body).to.have.property('error', 'User not found');
//     });

//     it('should create a collaboration and return 201', async () => {
//         collaborationServiceStub.createCollaboration.resolves({ id: '123', name: 'Test Collaboration' });

//         const res = await chai.request(app)
//             .post('/api/collaborations')
//             .set('Authorization', 'Bearer fake-token')
//             .send({ name: 'Test Collaboration' });

//         expect(res).to.have.status(201);
//         expect(res.body).to.have.property('success', true);
//         expect(res.body.collaboration).to.have.property('id', '123');
//     });

//     it('should return 200 and collaborations for a user', async () => {
//         collaborationServiceStub.getCollaborationsByUserAndRole.resolves([{ id: '123' }]);

//         const res = await chai.request(app)
//             .get('/api/collaborations/1/artist')
//             .set('Authorization', 'Bearer fake-token');

//         expect(res).to.have.status(200);
//         expect(res.body).to.have.property('success', true);
//         expect(res.body.collaborations).to.be.an('array');
//     });

//     it('should update collaboration status and return 202', async () => {
//         collaborationServiceStub.updateCollaborationStatus.resolves({ id: '123', status: 'approved' });

//         const res = await chai.request(app)
//             .put('/api/collaborations/123')
//             .set('Authorization', 'Bearer fake-token')
//             .send({ status: 'approved' });

//         expect(res).to.have.status(202);
//         expect(res.body).to.have.property('success', true);
//         expect(res.body.collaboration).to.have.property('status', 'approved');
//     });

//     it('should return 500 if an internal server error occurs', async () => {
//         collaborationServiceStub.createCollaboration.rejects(new Error('Internal Server Error'));

//         const res = await chai.request(app)
//             .post('/api/collaborations')
//             .set('Authorization', 'Bearer fake-token')
//             .send({ name: 'Test Collaboration' });

//         expect(res).to.have.status(500);
//         expect(res.body).to.have.property('error', 'Internal Server Error');
//     });
// });
