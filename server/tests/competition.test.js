const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const User = require('../src/models/User');
const Competition = require('../src/models/Competition');
const Participation = require('../src/models/Participation');
const { COMPETITION_STATUS, PARTICIPATION_STATUS } = require('../src/constants/status');

let mongoServer;
let user1Token;
let user1Id;
let user2Token;
let user2Id;
let openCompId;
let fullCompId;
let closedCompId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Create test users
  const user1 = await User.create({
    name: 'Test User 1',
    email: 'user1@test.com',
    password: 'password123'
  });
  user1Id = user1._id.toString();

  const user2 = await User.create({
    name: 'Test User 2',
    email: 'user2@test.com',
    password: 'password123'
  });
  user2Id = user2._id.toString();

  // Login to get tokens
  const res1 = await request(app).post('/api/auth/login').send({
    email: 'user1@test.com',
    password: 'password123'
  });
  user1Token = res1.body.data.token;

  const res2 = await request(app).post('/api/auth/login').send({
    email: 'user2@test.com',
    password: 'password123'
  });
  user2Token = res2.body.data.token;

  const now = new Date();
  const oneDay = 24 * 60 * 60 * 1000;

  // Open Competition (Capacity 10, current 1)
  const openComp = await Competition.create({
    title: 'Open Competition',
    description: 'Open for registration',
    category: 'Dance',
    entryFee: 99,
    prizePool: 1000,
    maximumParticipants: 10,
    currentParticipants: 1,
    registrationStartDate: new Date(now.getTime() - oneDay),
    registrationEndDate: new Date(now.getTime() + 5 * oneDay),
    startDate: new Date(now.getTime() - oneDay),
    endDate: new Date(now.getTime() + 10 * oneDay),
    status: COMPETITION_STATUS.REGISTRATION_OPEN
  });
  openCompId = openComp._id.toString();

  // Pre-register user1 for openComp
  await Participation.create({
    userId: user1Id,
    competitionId: openCompId,
    status: PARTICIPATION_STATUS.REGISTERED
  });

  // Full Competition (Capacity 2, current 2)
  const fullComp = await Competition.create({
    title: 'Full Competition',
    description: 'Fully booked',
    category: 'Coding',
    entryFee: 50,
    prizePool: 500,
    maximumParticipants: 2,
    currentParticipants: 2,
    registrationStartDate: new Date(now.getTime() - oneDay),
    registrationEndDate: new Date(now.getTime() + 5 * oneDay),
    startDate: new Date(now.getTime() - oneDay),
    endDate: new Date(now.getTime() + 10 * oneDay),
    status: COMPETITION_STATUS.FULL
  });
  fullCompId = fullComp._id.toString();

  // Closed Competition (Ended registration)
  const closedComp = await Competition.create({
    title: 'Closed Competition',
    description: 'Registration ended',
    category: 'Art',
    entryFee: 10,
    prizePool: 200,
    maximumParticipants: 50,
    currentParticipants: 10,
    registrationStartDate: new Date(now.getTime() - 10 * oneDay),
    registrationEndDate: new Date(now.getTime() - 2 * oneDay),
    startDate: new Date(now.getTime() - 10 * oneDay),
    endDate: new Date(now.getTime() + 2 * oneDay),
    status: COMPETITION_STATUS.LIVE
  });
  closedCompId = closedComp._id.toString();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('1. GET /api/competitions', () => {
  it('should fetch all competitions', async () => {
    const res = await request(app).get('/api/competitions');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(3);
  });
});

describe('2. GET /api/competitions/:id', () => {
  it('should load competition details with user participation status when authenticated', async () => {
    const res = await request(app)
      .get(`/api/competitions/${openCompId}`)
      .set('Authorization', `Bearer ${user1Token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toEqual('Open Competition');
    expect(res.body.data.userParticipation.isRegistered).toBe(true);
  });

  it('should return 400 for invalid ObjectId format', async () => {
    const res = await request(app).get('/api/competitions/invalid-id-123');
    expect(res.statusCode).toEqual(400);
    expect(res.body.code).toEqual('INVALID_ID_FORMAT');
  });

  it('should return 404 for non-existent competition ID', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).get(`/api/competitions/${fakeId}`);
    expect(res.statusCode).toEqual(404);
    expect(res.body.code).toEqual('COMPETITION_NOT_FOUND');
  });
});

describe('3. POST /api/competitions/:id/register', () => {
  it('should register an unregistered user successfully', async () => {
    const res = await request(app)
      .post(`/api/competitions/${openCompId}/register`)
      .set('Authorization', `Bearer ${user2Token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.userParticipation.isRegistered).toBe(true);
    expect(res.body.data.currentParticipants).toEqual(2);
  });

  it('should reject duplicate registration from the same user', async () => {
    const res = await request(app)
      .post(`/api/competitions/${openCompId}/register`)
      .set('Authorization', `Bearer ${user1Token}`);

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
    expect(res.body.code).toEqual('ALREADY_REGISTERED');
  });

  it('should reject registration when competition capacity is full', async () => {
    const res = await request(app)
      .post(`/api/competitions/${fullCompId}/register`)
      .set('Authorization', `Bearer ${user2Token}`);

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
    expect(res.body.code).toEqual('COMPETITION_FULL');
  });

  it('should reject registration when registration deadline has passed', async () => {
    const res = await request(app)
      .post(`/api/competitions/${closedCompId}/register`)
      .set('Authorization', `Bearer ${user2Token}`);

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
    expect(res.body.code).toEqual('REGISTRATION_CLOSED');
  });

  it('should reject unauthenticated registration requests', async () => {
    const res = await request(app).post(`/api/competitions/${openCompId}/register`);
    expect(res.statusCode).toEqual(401);
    expect(res.body.code).toEqual('UNAUTHORIZED');
  });
});

describe('4. POST /api/competitions/:id/unregister', () => {
  it('should allow user to cancel participation before deadline', async () => {
    const res = await request(app)
      .post(`/api/competitions/${openCompId}/unregister`)
      .set('Authorization', `Bearer ${user2Token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.currentParticipants).toEqual(1);
  });
});
