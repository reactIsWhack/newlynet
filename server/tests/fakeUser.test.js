const { initializeMongoDB, disconnectMongoDB } = require('../db/connectTestDB');
const { interestOptions } = require('../db/data');
const ClubChat = require('../models/clubChat.model');
const ClubServer = require('../models/clubServer.model');
const User = require('../models/user.model');

beforeAll(async () => {
  await initializeMongoDB();
});

describe('Generate Fake Users', () => {
  it('Should generate anywhere between 15 and 50 fake users as students', async () => {
    const sampleFakeUser = await User.findOne({});
    const grades = [5, 6, 7, 8, 9, 10, 11, 12];

    expect(sampleFakeUser.firstName).toBeTruthy();
    expect(sampleFakeUser.lastName).toBeTruthy();
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

let initialInterest = '';

describe('Generate club chats', () => {
  it('Should generate 27  chats based off interests', async () => {
    const clubChat = await ClubChat.findOne({});
    expect(clubChat._id).toBeTruthy();
    expect(interestOptions).toContain(clubChat.chatTopic);
  });

  it('Should generate two club servers', async () => {
    const clubServer = await ClubServer.findOne({});
    console.log(clubServer);

    expect(clubServer.chats.length).toBe(27);
  });
});

afterAll(async () => {
  await disconnectMongoDB();
});
