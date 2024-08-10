const User = require('../models/user.model');
const Chat = require('../models/chat.model');
const { faker } = require('@faker-js/faker');
const { config } = require('dotenv');
const { interestOptions } = require('../db/data');
const getSchool = require('../services/schoolService');
const Message = require('../models/message.model');
const shuffle = require('./shuffleArray');
const ClubChat = require('../models/clubChat.model');
const { usersInClubChat, resetOnlineUsers } = require('../socket/socket');
config();

const shuffledInterests = shuffle(interestOptions);

const rotateClubChat = async () => {
  const activeClubChat = await ClubChat.findOne({ isActive: true });
  activeClubChat.isActive = false;

  let nextIndex = shuffledInterests.indexOf(activeClubChat.chatTopic) + 1;
  if (nextIndex >= shuffledInterests.length) nextIndex = 0;

  const nextInterest = shuffledInterests[nextIndex];
  const newClubChat = await ClubChat.findOne({ chatTopic: nextInterest });
  newClubChat.isActive = true;

  await Promise.all([activeClubChat.save(), newClubChat.save()]);
  console.log(newClubChat);
};

const initializeChatClub = async () => {
  const activeClubChat = await ClubChat.findOne({ isActive: true });
  if (activeClubChat) {
    activeClubChat.isActive = false;
    await activeClubChat.save();
  }

  const firstInterest = shuffledInterests[0];
  const startingClubChat = await ClubChat.findOne({
    chatTopic: firstInterest,
  });
  startingClubChat.isActive = true;
  await startingClubChat.save();
  console.log(startingClubChat);
};

const generateGrade = (i) => {
  const randomGrade =
    process.env.NODE_ENV === 'test'
      ? 9
      : Math.floor(Math.random() * (12 - 9 + 1) + 9);
  return randomGrade;
};

const generateInterests = () => {
  const interests = [];
  let possibleInterests = [...interestOptions];
  for (let i = 0; i < 3; i++) {
    const index = Math.floor(Math.random() * possibleInterests.length);
    interests.push(possibleInterests[index]);
    possibleInterests.splice(index, 1);
  }

  return interests;
};

const generateClubChats = async () => {
  const clubChats = [];
  for (const interest of shuffledInterests) {
    const clubChat = await ClubChat.create({
      topicMessages: [],
      generalMessages: [],
      chatTopic: interest,
      isActive: false,
      members: [],
    });
    clubChats.push(clubChat);
  }

  return clubChats;
};

const generateFakeUsers = async () => {
  console.log('Generating fake users...');

  const fakeUsers = [];
  const schoolQueries = [
    'PrincetonHighSchool',
    'MontgomeryHighSchool',
    // 'SouthBrunswickHighSchool',
  ];

  for (const schoolQuery of schoolQueries) {
    const numOfFakeUsers =
      process.env.NODE_ENV === 'test'
        ? 3
        : Math.floor(Math.random() * (50 - 15 + 1) + 15);
    const schoolInfo = await getSchool(schoolQuery);

    for (let i = 0; i < numOfFakeUsers; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const fakeUser = {
        firstName,
        lastName,
        username: firstName,
        password: process.env.FAKE_USER_PASSWORD,
        profilePicture: `https://eu.ui-avatars.com/api/?name=${firstName}+${lastName}&size=100`,
        school: schoolInfo,
        grade: generateGrade(i),
        interests: generateInterests(),
        contacts: [],
        chattingWith: [],
        socialMediaUsernames: {
          snapchat: i % 2 === 0 || i % 4 === 0 ? faker.internet.userName() : '',
          instagram:
            i % 3 === 0 || i % 5 === 0 ? faker.internet.userName() : '',
        },
      };
      try {
        const user = await User.create(fakeUser);
        fakeUsers.push(user);
      } catch (error) {
        console.log(error);
      }
    }
  }
  console.log('Fake users generated ✅');
  return fakeUsers;
};

const populateDB = async () => {
  let intervalID;
  resetOnlineUsers();

  await ClubChat.deleteMany();
  clearInterval(intervalID);
  await generateClubChats();
  // await generateFakeUsers();

  await initializeChatClub();
  clearInterval(intervalID);
  intervalID = setInterval(async () => {
    await rotateClubChat();
  }, 60 * 60 * 1000);
};

module.exports = {
  generateFakeUsers,
  generateClubChats,
  shuffledInterests,
  populateDB,
  rotateClubChat,
  initializeChatClub,
};
