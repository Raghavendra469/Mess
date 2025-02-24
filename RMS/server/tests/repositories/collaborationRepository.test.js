const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const { Types } = require('mongoose');
// const chaiAsPromised = require('chai-as-promised');
const mongoose = require('mongoose');
const { expect } = chai;

const CollaborationRepository = require('../../repositories/collaborationRepository');
const Collaboration = require('../../models/collaborationModel');
const Manager = require('../../models/managerModel');
const Artist = require('../../models/artistModel');
const Song = require('../../models/songModel');

chai.use(sinonChai);
// chai.use(chaiAsPromised);
before(async () => {
    const chaiAsPromised = await import('chai-as-promised');
    chai.use(chaiAsPromised.default);
  });


describe('CollaborationRepository', () => {
  let collaborationRepository;
  let sandbox;
  const mockObjectId = new mongoose.Types.ObjectId();

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    collaborationRepository = new CollaborationRepository();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('createCollaboration', () => {
    it('should create a new collaboration with valid data', async () => {
      const collaborationData = {
        collaborationId: 'COLLAB_001',
        managerId: new mongoose.Types.ObjectId(),
        artistId: new mongoose.Types.ObjectId(),
        status: 'Pending',
        collaborationDate: new Date(),
        songsManaged: []
      };

      const savedCollaboration = { ...collaborationData, _id: mockObjectId };
      const saveStub = sandbox.stub(Collaboration.prototype, 'save').resolves(savedCollaboration);

      const result = await collaborationRepository.createCollaboration(collaborationData);

      expect(saveStub).to.have.been.calledOnce;
      expect(result).to.deep.equal(savedCollaboration);
      expect(result.collaborationId).to.equal('COLLAB_001');
    });

    it('should throw error when required fields are missing', async () => {
      const invalidData = {
        managerId: new mongoose.Types.ObjectId()
        // Missing required fields
      };

      const saveStub = sandbox.stub(Collaboration.prototype, 'save')
        .rejects(new mongoose.Error.ValidationError());

      await expect(collaborationRepository.createCollaboration(invalidData))
        .to.be.rejectedWith(mongoose.Error.ValidationError);
    });
  });

  describe('getCollaborationsByUserAndRole', () => {
    it('should get pending collaborations for manager role', async () => {
      const userId = new mongoose.Types.ObjectId();
      const role = 'Manager';
      const mockCollaborations = [
        {
          _id: mockObjectId,
          collaborationId: 'COLLAB_001',
          managerId: userId,
          artistId: new mongoose.Types.ObjectId(),
          status: 'Pending',
          collaborationDate: new Date(),
          songsManaged: []
        }
      ];

      const findStub = sandbox.stub(Collaboration, 'find').returns({
        populate: sandbox.stub().returnsThis(),
        lean: sandbox.stub().resolves(mockCollaborations)
      });

      const result = await collaborationRepository.getCollaborationsByUserAndRole(userId, role);

      expect(findStub).to.have.been.calledWith({ managerId: userId });
      expect(result).to.deep.equal(mockCollaborations);
      expect(result[0].status).to.equal('Pending');
    });

    it('should get pending collaborations for artist role', async () => {
      const userId = new mongoose.Types.ObjectId();
      const role = 'Artist';
      const mockCollaborations = [
        {
          _id: mockObjectId,
          collaborationId: 'COLLAB_002',
          managerId: new mongoose.Types.ObjectId(),
          artistId: userId,
          status: 'Pending',
          collaborationDate: new Date(),
          songsManaged: []
        }
      ];

      const findStub = sandbox.stub(Collaboration, 'find').returns({
        populate: sandbox.stub().returnsThis(),
        lean: sandbox.stub().resolves(mockCollaborations)
      });

      const result = await collaborationRepository.getCollaborationsByUserAndRole(userId, role);

      expect(findStub).to.have.been.calledWith({ artistId: userId });
      expect(result).to.deep.equal(mockCollaborations);
    });
  });

  describe('updateCollaborationStatus', () => {
    it('should update collaboration status to Approved and update related documents', async () => {
      const collaborationId = mockObjectId;
      const artistId = new mongoose.Types.ObjectId();
      const managerId = new mongoose.Types.ObjectId();
      const mockSongs = [
        { _id: new mongoose.Types.ObjectId() },
        { _id: new mongoose.Types.ObjectId() }
      ];

      const mockCollaboration = {
        _id: collaborationId,
        collaborationId: 'COLLAB_003',
        artistId,
        managerId,
        status: 'Pending',
        songsManaged: [],
        collaborationDate: new Date(),
        save: sandbox.stub().resolves()
      };

      sandbox.stub(Collaboration, 'findOne').resolves(mockCollaboration);
      sandbox.stub(Song, 'find').returns({
        select: sandbox.stub().resolves(mockSongs)
      });
      sandbox.stub(Manager, 'findByIdAndUpdate').resolves();
      sandbox.stub(Artist, 'findByIdAndUpdate').resolves();
      sandbox.stub(Collaboration, 'findByIdAndUpdate').resolves({
        ...mockCollaboration,
        status: 'Approved',
        songsManaged: mockSongs.map(song => song._id)
      });

      const result = await collaborationRepository.updateCollaborationStatus(collaborationId, 'Approved');

      expect(result.status).to.equal('Approved');
      expect(result.songsManaged).to.have.lengthOf(2);
      expect(result.songsManaged).to.deep.equal(mockSongs.map(song => song._id));
    });

    it('should validate status enum values', async () => {
      const collaborationId = mockObjectId;
      const invalidStatus = 'InvalidStatus';

      const mockCollaboration = {
        _id: collaborationId,
        collaborationId: 'COLLAB_004',
        status: 'Pending'
      };

      sandbox.stub(Collaboration, 'findOne').resolves(mockCollaboration);
      const updateStub = sandbox.stub(Collaboration, 'findByIdAndUpdate')
        .rejects(new mongoose.Error.ValidationError());

      await expect(collaborationRepository.updateCollaborationStatus(collaborationId, invalidStatus))
        .to.be.rejectedWith(mongoose.Error.ValidationError);
    });
  });

  describe('findCollaborationById', () => {
    it('should return collaboration when valid ID is provided', async () => {
        const mockCollaboration = { _id: new Types.ObjectId(), status: 'Pending' };
        sandbox.stub(Collaboration, 'findOne').resolves(mockCollaboration);

        const result = await collaborationRepository.findCollaborationById(mockCollaboration._id);
        
        expect(result).to.deep.equal(mockCollaboration);
        expect(Collaboration.findOne.calledWith({ _id: mockCollaboration._id })).to.be.true;
    });

    it('should return null when collaboration is not found', async () => {
        sandbox.stub(Collaboration, 'findOne').resolves(null);
        
        const result = await collaborationRepository.findCollaborationById(new Types.ObjectId());
        
        expect(result).to.be.null;
    });
});

describe('updateManagerManagedArtists', () => {
    it('should add artist to manager\'s managedArtists array', async () => {
        const managerId = new Types.ObjectId();
        const artistId = new Types.ObjectId();
        const updatedManager = {
            _id: managerId,
            managedArtists: [artistId]
        };

        sandbox.stub(Manager, 'findByIdAndUpdate').resolves(updatedManager);

        const result = await collaborationRepository.updateManagerManagedArtists(managerId, artistId);

        expect(result).to.deep.equal(updatedManager);
        expect(Manager.findByIdAndUpdate.calledWith(
            managerId,
            { $addToSet: { managedArtists: artistId } },
            { new: true }
        )).to.be.true;
    });

    it('should not add duplicate artist to managedArtists array', async () => {
        const managerId = new Types.ObjectId();
        const artistId = new Types.ObjectId();
        const updatedManager = {
            _id: managerId,
            managedArtists: [artistId]
        };

        sandbox.stub(Manager, 'findByIdAndUpdate').resolves(updatedManager);

        const result = await collaborationRepository.updateManagerManagedArtists(managerId, artistId);

        expect(result.managedArtists).to.have.lengthOf(1);
        expect(result.managedArtists[0]).to.deep.equal(artistId);
    });
});

describe('updateArtistManager', () => {
    it('should update artist\'s manager field', async () => {
        const artistId = new Types.ObjectId();
        const managerId = new Types.ObjectId();
        const updatedArtist = {
            _id: artistId,
            manager: managerId
        };

        sandbox.stub(Artist, 'findByIdAndUpdate').resolves(updatedArtist);

        const result = await collaborationRepository.updateArtistManager(artistId, managerId);

        expect(result).to.deep.equal(updatedArtist);
        expect(Artist.findByIdAndUpdate.calledWith(
            artistId,
            { $set: { manager: managerId } },
            { new: true }
        )).to.be.true;
    });
});

describe('requestCancellation', () => {
    it('should update collaboration status to cancel_requested', async () => {
        const collaborationId = new Types.ObjectId();
        const cancellationReason = 'Scheduling conflicts';
        const updatedCollaboration = {
            _id: collaborationId,
            status: 'cancel_requested',
            cancellationReason
        };

        sandbox.stub(Collaboration, 'findByIdAndUpdate').resolves(updatedCollaboration);

        const result = await collaborationRepository.requestCancellation(collaborationId, cancellationReason);

        expect(result).to.deep.equal(updatedCollaboration);
        expect(Collaboration.findByIdAndUpdate.calledWith(
            collaborationId,
            { status: 'cancel_requested', cancellationReason },
            { new: true }
        )).to.be.true;
    });
});

describe('handleCancellationResponse', () => {
    let mockCollaboration;

    beforeEach(() => {
        mockCollaboration = {
            _id: new Types.ObjectId(),
            artistId: new Types.ObjectId(),
            managerId: new Types.ObjectId(),
            status: 'cancel_requested',
            save: sandbox.stub().resolves()
        };
    });

    it('should approve cancellation and update all related records', async () => {
        sandbox.stub(Collaboration, 'findById').resolves(mockCollaboration);
        sandbox.stub(Artist, 'findByIdAndUpdate').resolves();
        sandbox.stub(Manager, 'findByIdAndUpdate').resolves();

        await collaborationRepository.handleCancellationResponse(mockCollaboration._id, 'approved');

        expect(Artist.findByIdAndUpdate.calledWith(
            mockCollaboration.artistId,
            { $unset: { manager: '' } }
        )).to.be.true;

        expect(Manager.findByIdAndUpdate.calledWith(
            mockCollaboration.managerId,
            { $pull: { managedArtists: mockCollaboration.artistId } }
        )).to.be.true;

        expect(mockCollaboration.status).to.equal('cancelled');
        expect(mockCollaboration.save.called).to.be.true;
    });

    it('should decline cancellation and reset status', async () => {
        sandbox.stub(Collaboration, 'findById').resolves(mockCollaboration);

        await collaborationRepository.handleCancellationResponse(mockCollaboration._id, 'declined');

        expect(mockCollaboration.status).to.equal('Approved');
        expect(mockCollaboration.save.called).to.be.true;
    });

    it('should throw error when collaboration is not found', async () => {
        sandbox.stub(Collaboration, 'findById').resolves(null);

        try {
            await collaborationRepository.handleCancellationResponse(new Types.ObjectId(), 'approved');
            expect.fail('Should have thrown an error');
        } catch (error) {
            expect(error.message).to.equal('Collaboration not found');
        }
    });
});
});