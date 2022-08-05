const { isJSONType } = require("ajv/dist/compile/rules");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const uniquestring = require("randomstring");
const { jwtToken } = require("./config");

const saltRounds = 10;

function hashPassword(plainPassword) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(plainPassword, saltRounds, function (err, hash) {
      if (err) reject(err);
      resolve(hash);
    });
  });
}

function unHashPassword({ plain, hash }) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(plain, hash).then((result) => {
      resolve(result);
    });
  });
}
function generateToken(tokenData) {
  const token = jwt.sign(tokenData,jwtToken , { expiresIn: "24h" });
  return token;
}

function decodeJwtToken(token) {
  const payload = jwt.verify(token, jwtToken);
  return payload;
}

function generateRandomKey() {
  return uniquestring.generate(12)
}
module.exports = {
  hashPassword,
  unHashPassword,
  generateToken,
  decodeJwtToken,
  generateRandomKey
};
