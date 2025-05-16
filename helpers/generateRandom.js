module.exports.generateRandomString = (length) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}

module.exports.generateRandomNumber = (length) => {
  const characters = "0123456789";
  let result = "";

  for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}

function generateRandomAgencyCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }
  return code;
}

// console.log(generateRandomAgencyCode()); // Ví dụ: "AB3D9"

const Agency = require('../models/agency.m.js')
module.exports.generateUniqueAgencyCode = async () => {
  let code;
  let exists = true;
  while (exists) {
    code = generateRandomAgencyCode();
    exists = await Agency.exists({ agencyCode: code });
  }
  return code;
}