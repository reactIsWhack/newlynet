const User = require('../models/user.model');
const { faker } = require('@faker-js/faker');
const { config } = require('dotenv');
const { interestOptions } = require('../db/data');
const getSchool = require('../services/schoolService');
config();

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

const generateFakeUsers = async () => {
  // return User.deleteMany();
  console.log('Generating fake users...');

  const fakeUsers = [];
  const schoolQueries = [
    'PrincetonHighSchool',
    'MontgomeryHighSchool',
    'SouthBrunswickHighSchool',
  ];

  for (const schoolQuery of schoolQueries) {
    const numOfFakeUsers =
      process.env.NODE_ENV === 'test'
        ? 3
        : Math.floor(Math.random() * (15 - 5 + 1) + 5);
    const schoolInfo = await getSchool(schoolQuery);

    for (let i = 0; i < numOfFakeUsers; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const fakeUser = {
        fullName: firstName + ' ' + lastName,
        username: faker.internet.displayName(),
        password: process.env.FAKE_USER_PASSWORD,
        profilePicture: `https://avatar.iran.liara.run/public/?username=${firstName}`,
        school: schoolInfo,
        grade: generateGrade(i),
        interests: generateInterests(),
        contacts: [],
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

module.exports = { generateFakeUsers };
