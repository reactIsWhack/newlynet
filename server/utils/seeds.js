const User = require('../models/user.model');
const Chat = require('../models/chat.model');
const { faker } = require('@faker-js/faker');
const { config } = require('dotenv');
const { interestOptions } = require('../db/data');
const getSchool = require('../services/schoolService');
const Message = require('../models/message.model');
const shuffle = require('./shuffleArray');
const ClubChat = require('../models/clubChat.model');
const { resetOnlineUsers } = require('../socket/socket');
const ClubServer = require('../models/clubServer.model');
config();

const shuffledInterests = ['General', ...shuffle(interestOptions)];

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
  const initialSchools = ['PrincetonHighSchool', 'MontgomeryHighSchool'];
  for (const initialSchool of initialSchools) {
    const clubChats = [];
    const schoolInfo = await getSchool(initialSchool);
    const clubServer = await ClubServer.create({
      members: [],
      chats: [],
      schoolAffiliation: schoolInfo.schoolId,
    });

    for (const interest of shuffledInterests) {
      const clubChat = await ClubChat.create({
        messages: [],
        chatTopic: interest,
      });
      clubChats.push(clubChat);
    }
    clubServer.chats = clubChats;
    await clubServer.save();
  }
};

const generateFakeUsers = async () => {
  console.log('Generating fake users...');

  const fakeUsers = [];
  const schoolQueries = ['PrincetonHighSchool', 'MontgomeryHighSchool'];

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
        email: `${firstName}${i}@gmail.com`,
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
  resetOnlineUsers();
  // await User.deleteMany();
  // await ClubServer.deleteMany();
  // await ClubChat.deleteMany();
  // await Message.deleteMany();
  return;
  if (process.env.NODE_ENV === 'test') {
    await generateClubChats();
    await generateFakeUsers();
  }
};

module.exports = {
  generateFakeUsers,
  generateClubChats,
  shuffledInterests,
  populateDB,
};
