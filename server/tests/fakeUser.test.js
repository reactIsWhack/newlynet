const { initializeMongoDB, disconnectMongoDB } = require('../db/connectTestDB');
const { interestOptions } = require('../db/data');
const User = require('../models/user.model');
const { generateFakeUsers } = require('../utils/seeds');

beforeAll(async () => {
  await initializeMongoDB();
});

describe('Generate Fake Users', () => {
  it('Should generate anywhere between 15 and 50 fake users as students', async () => {
    await generateFakeUsers();
    const sampleFakeUser = await User.findOne({});
    const grades = [5, 6, 7, 8, 9, 10, 11, 12];

    console.log(sampleFakeUser);
    expect(sampleFakeUser.fullName).toBeTruthy();
    expect(sampleFakeUser.school.formattedName).toMatch(
      /(Princeton High School)/i
    );
    expect(sampleFakeUser.interests.length).toBe(3);
    expect(sampleFakeUser.profilePicture).toBeTruthy();
    expect(interestOptions).toContain(sampleFakeUser.interests[0]);
    expect(interestOptions).toContain(sampleFakeUser.interests[1]);
    expect(interestOptions).toContain(sampleFakeUser.interests[2]);
    expect(grades).toContain(sampleFakeUser.grade);
  });
});

afterAll(async () => {
  await disconnectMongoDB();
});
