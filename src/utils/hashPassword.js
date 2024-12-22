// utils/password.js
const bcrypt = require("bcrypt");
const defaultSaltRounds = 12;

const hashPassword = async (password, saltRounds=defaultSaltRounds) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    throw new Error("Error hashing password");
  }
};

const comparePassword = async (password, hash) => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    throw new Error("Error comparing passwords");
  }
};

module.exports = {
  hashPassword,
  comparePassword,
};
