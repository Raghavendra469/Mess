const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const { routeHandler } = require('ca-webutils/expressx');
const collaborationService = require('../services/collaborationService');
const collaborationController = require('../controllers/collaborationController');

describe('Collaboration Controller', () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('createCollaboration', () => {
        it('should create a collaboration and return success response', async () => {
            // Arrange
            const mockBody = {
                userId: 'user123',
                projectId: 'project123',
                role: 'CONTRIBUTOR'
            };
            
            const mockCollaboration = {
                id: 'collab123',
                ...mockBody,
                status: 'PENDING'
            };

            const createStub = sandbox.stub(collaborationService, 'createCollaboration')
                .resolves(mockCollaboration);

            // Act
            const result = await collaborationController.createCollaboration({ body: mockBody });

            // Assert
            expect(createStub.calledOnceWith(mockBody)).to.be.true;
            expect(result).to.deep.equal({
                success: true,
                collaboration: mockCollaboration
            });
        });

        it('should handle service errors through routeHandler', async () => {
            // Arrange
            const mockBody = { userId: 'user123' };
            const error = new Error('Service error');
            
            sandbox.stub(collaborationService, 'createCollaboration').rejects(error);

            // Act & Assert
            try {
                await collaborationController.createCollaboration({ body: mockBody });
                expect.fail('Should have thrown an error');
            } catch (err) {
                expect(err.message).to.equal('Service error');
            }
        });
    });

    describe('getCollaborationsByUserAndRole', () => {
        it('should get collaborations and return success response', async () => {
            // Arrange
            const mockParams = {
                userId: 'user123',
                role: 'CONTRIBUTOR'
            };

            const mockCollaborations = [
                { id: 'collab1', userId: 'user123', role: 'CONTRIBUTOR' },
                { id: 'collab2', userId: 'user123', role: 'CONTRIBUTOR' }
            ];

            const getStub = sandbox.stub(collaborationService, 'getCollaborationsByUserAndRole')
                .resolves(mockCollaborations);

            // Act
            const result = await collaborationController.getCollaborationsByUserAndRole({ 
                params: mockParams 
            });

            // Assert
            expect(getStub.calledOnceWith(mockParams.userId, mockParams.role)).to.be.true;
            expect(result).to.deep.equal({
                success: true,
                collaborations: mockCollaborations
            });
        });

        it('should handle empty collaborations array', async () => {
            // Arrange
            const mockParams = {
                userId: 'user123',
                role: 'CONTRIBUTOR'
            };

            sandbox.stub(collaborationService, 'getCollaborationsByUserAndRole')
                .resolves([]);

            // Act
            const result = await collaborationController.getCollaborationsByUserAndRole({ 
                params: mockParams 
            });

            // Assert
            expect(result).to.deep.equal({
                success: true,
                collaborations: []
            });
        });
    });

    describe('updateCollaborationStatus', () => {
        it('should update collaboration status and return success response', async () => {
            // Arrange
            const mockParams = { collaborationId: 'collab123' };
            const mockBody = { status: 'ACCEPTED' };
            const mockUpdatedCollaboration = {
                id: 'collab123',
                status: 'ACCEPTED',
                userId: 'user123',
                projectId: 'project123'
            };

            const updateStub = sandbox.stub(collaborationService, 'updateCollaborationStatus')
                .resolves(mockUpdatedCollaboration);

            // Act
            const result = await collaborationController.updateCollaborationStatus({
                params: mockParams,
                body: mockBody
            });

            // Assert
            expect(updateStub.calledOnceWith(mockParams.collaborationId, mockBody.status)).to.be.true;
            expect(result).to.deep.equal({
                success: true,
                collaboration: mockUpdatedCollaboration
            });
        });

        it('should throw error when collaboration is not found', async () => {
            // Arrange
            const mockParams = { collaborationId: 'nonexistent123' };
            const mockBody = { status: 'ACCEPTED' };

            sandbox.stub(collaborationService, 'updateCollaborationStatus')
                .resolves(null);

            // Act & Assert
            try {
                await collaborationController.updateCollaborationStatus({
                    params: mockParams,
                    body: mockBody
                });
                expect.fail('Should have thrown an error');
            } catch (err) {
                expect(err.message).to.equal('Collaboration not found');
            }
        });

        it('should handle service errors for status update', async () => {
            // Arrange
            const mockParams = { collaborationId: 'collab123' };
            const mockBody = { status: 'ACCEPTED' };
            const error = new Error('Service error');

            sandbox.stub(collaborationService, 'updateCollaborationStatus')
                .rejects(error);

            // Act & Assert
            try {
                await collaborationController.updateCollaborationStatus({
                    params: mockParams,
                    body: mockBody
                });
                expect.fail('Should have thrown an error');
            } catch (err) {
                expect(err.message).to.equal('Service error');
            }
        });
    });

    // Test routeHandler integration
    describe('routeHandler integration', () => {
        it('should wrap controller methods with routeHandler', () => {
            expect(collaborationController.createCollaboration).to.be.a('function');
            expect(collaborationController.getCollaborationsByUserAndRole).to.be.a('function');
            expect(collaborationController.updateCollaborationStatus).to.be.a('function');
        });

        it('should maintain routeHandler error handling', async () => {
            // Arrange
            const mockError = new Error('Test error');
            const mockReq = { body: {} };
            
            sandbox.stub(collaborationService, 'createCollaboration').rejects(mockError);

            // Act & Assert
            try {
                await collaborationController.createCollaboration(mockReq);
                expect.fail('Should have thrown an error');
            } catch (err) {
                expect(err).to.equal(mockError);
            }
        });
    });
});