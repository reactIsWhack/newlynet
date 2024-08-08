const { initializeMongoDB, disconnectMongoDB } = require('../db/connectTestDB');
const { interestOptions } = require('../db/data');
const ClubChat = require('../models/clubChat.model');
const User = require('../models/user.model');
const { rotateClubChat, shuffledInterests } = require('../utils/seeds');

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
  it('Should generate 27 club chats based off interests', async () => {
    const clubChat = await ClubChat.findOne({});
    expect(clubChat._id).toBeTruthy();
    expect(interestOptions).toContain(clubChat.chatTopic);
    expect(clubChat.generalMessages).toEqual([]);
    expect(clubChat.topicMessages).toEqual([]);
  });

  it('Should ensure the first club chat is activated upon mongodb connection', async () => {
    const activatedClubChat = await ClubChat.findOne({ isActive: true });
    initialInterest = activatedClubChat.chatTopic;
    console.log(activatedClubChat);
    expect(activatedClubChat.chatTopic).toBe(shuffledInterests[0]);
  });

  it('Should rotate the club chats every hour', async () => {
    await rotateClubChat();

    // Check the state after the first rotation
    const activeClubChat = await ClubChat.findOne({ isActive: true });
    const previousActiveClubChat = await ClubChat.findOne({
      chatTopic: initialInterest,
    });
    expect(previousActiveClubChat.isActive).toBe(false);
    expect(activeClubChat.chatTopic).toBe(shuffledInterests[1]);

    await rotateClubChat();
    const old = await ClubChat.findById(activeClubChat._id);
    const newChat = await ClubChat.findOne({ isActive: true });
    expect(old.isActive).toBe(false);
    expect(newChat.chatTopic).toBe(shuffledInterests[2]);
  });
});

afterAll(async () => {
  await disconnectMongoDB();
});
