const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const User = require('../src/models/User');
const Competition = require('../src/models/Competition');
const Participation = require('../src/models/Participation');
const { COMPETITION_STATUS } = require('../src/constants/status');

// Increase Jest timeout for creating 20 concurrent users & logging them in
jest.setTimeout(30000);

let mongoServer;
let targetCompId;
let usersAndTokens = [];

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // 1. Create a competition with capacity = 10 and 0 current participants
  const now = new Date();
  const oneDay = 24 * 60 * 60 * 1000;

  const comp = await Competition.create({
    title: 'High Concurrency Stress Competition',
    description: 'Testing atomic registration capacity limits under heavy concurrent load',
    category: 'Coding',
    entryFee: 100,
    prizePool: 5000,
    maximumParticipants: 10,
    currentParticipants: 0,
    registrationStartDate: new Date(now.getTime() - oneDay),
    registrationEndDate: new Date(now.getTime() + 5 * oneDay),
    startDate: new Date(now.getTime() - oneDay),
    endDate: new Date(now.getTime() + 10 * oneDay),
    status: COMPETITION_STATUS.REGISTRATION_OPEN
  });
  targetCompId = comp._id.toString();

  // 2. Create 20 unique users and obtain their JWT tokens
  for (let i = 1; i <= 20; i++) {
    const user = await User.create({
      name: `Concurrent User ${i}`,
      email: `concurrent_user_${i}@test.com`,
      password: 'password123'
    });

    const res = await request(app).post('/api/auth/login').send({
      email: `concurrent_user_${i}@test.com`,
      password: 'password123'
    });

    usersAndTokens.push({
      userId: user._id.toString(),
      token: res.body.data.token
    });
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('CONCURRENCY TEST — Atomic Registration & Capacity Safeguard', () => {
  it('should guarantee capacity is NEVER exceeded when 20 users register SIMULTANEOUSLY for 10 spots', async () => {
    // Fire all 20 registration requests simultaneously in parallel using Promise.all
    const registrationPromises = usersAndTokens.map((item) =>
      request(app)
        .post(`/api/competitions/${targetCompId}/register`)
        .set('Authorization', `Bearer ${item.token}`)
    );

    const responses = await Promise.all(registrationPromises);

    // Analyze results
    const successful = responses.filter((res) => res.statusCode === 200 && res.body.success === true);
    const rejectedDueToFull = responses.filter(
      (res) => res.statusCode === 400 && res.body.code === 'COMPETITION_FULL'
    );

    console.log('\n======================================================');
    console.log(`📊 CONCURRENCY TEST RESULTS:`);
    console.log(`   Total Parallel Requests:    ${responses.length}`);
    console.log(`   Successful Registrations:   ${successful.length}`);
    console.log(`   Rejected (Capacity Full):   ${rejectedDueToFull.length}`);
    console.log('======================================================\n');

    // Assertions
    expect(successful.length).toEqual(10);
    expect(rejectedDueToFull.length).toEqual(10);

    // Inspect database state directly
    const finalComp = await Competition.findById(targetCompId);
    expect(finalComp.currentParticipants).toEqual(10);
    expect(finalComp.currentParticipants).toBeLessThanOrEqual(finalComp.maximumParticipants);

    const remainingSpots = finalComp.maximumParticipants - finalComp.currentParticipants;
    expect(remainingSpots).toEqual(0);
    expect(remainingSpots).toBeGreaterThanOrEqual(0);

    // Count actual participation records in DB
    const actualParticipationsCount = await Participation.countDocuments({
      competitionId: targetCompId,
      status: 'REGISTERED'
    });
    expect(actualParticipationsCount).toEqual(10);
  });
});
