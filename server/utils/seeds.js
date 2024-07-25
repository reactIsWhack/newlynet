const User = require('../models/user.model');
const { faker } = require('@faker-js/faker');
const { config } = require('dotenv');
const { interestOptions } = require('../db/data');
const getSchool = require('../services/schoolService');
config();

const generateGrade = (i) => {
  const maxGrade = i > 2 ? 8 : 12;
  const minGrade = i > 2 ? 5 : 9;
  const randomGrade = Math.floor(
    Math.random() * (maxGrade - minGrade + 1) + minGrade
  );
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
    'PrincetonDaySchool',
    'PrincetonCharterSchool',
    'MontgomeryUpperMiddleSchool',
  ];

  for (const schoolQuery of schoolQueries) {
    const numOfFakeUsers =
      process.env.NODE_ENV === 'test'
        ? 1
        : Math.floor(Math.random() * (5 - 2 + 1) + 2);
    const schoolInfo = await getSchool(schoolQuery);
    for (let i = 0; i < numOfFakeUsers; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const fakeUser = {
        fullName: firstName + ' ' + lastName,
        username: faker.internet.displayName(),
        password: faker.internet.password(),
        profilePicture: `https://avatar.iran.liara.run/public/girld?username=${firstName}`,
        school: schoolInfo,
        grade: generateGrade(i),
        interests: generateInterests(),
        contacts: [],
      };
      try {
        const user = await User.create(fakeUser);
      } catch (error) {
        console.log(error);
      }
    }
  }
};

module.exports = { generateFakeUsers };
