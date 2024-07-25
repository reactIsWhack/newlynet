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
  for (let i = 0; i < 3; i++) {
    const index = Math.floor(Math.random() * interestOptions.length);
    do {
      interests.push(interestOptions[index]);
    } while (new Set(interests).size < interests.length);
  }

  return interests;
};

const generateFakeUsers = async () => {
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
        password: faker.internet.password(),
        profilePicture: `https://avatar.iran.liara.run/public/?username=${firstName}`,
        school: schoolInfo,
        grade: generateGrade(i),
        interests: generateInterests(),
        contacts: [],
      };
      console.log('generating...');
      try {
        const user = await User.create(fakeUser);
        console.log('✅');
      } catch (error) {
        console.log(error);
      }
    }
  }
};

module.exports = { generateFakeUsers };
