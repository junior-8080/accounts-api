const { Users } = require("./model");
const { v4: uuidv4 } = require("uuid");
const {
  hashPassword,
  unHashPassword,
  generateToken,
  decodeJwtToken,
  generateRandomKey,
} = require("../utils/helpers");
const { webBaseUrl } = require("../utils/config");

function siginup(req, res) {
  const { email, phonenumber, password } = req.body;
  const user = new Users();
  const apiKeys = [
    { id: uuidv4(), key: generateRandomKey(), posted_ts: new Date() },
  ];
  user.id = uuidv4();
  user.email = email;
  user.msisdn = phonenumber;
  user.apikeys = apiKeys;
  hashPassword(password).then((hashPass) => {
    user.password = hashPass;
    user
      .save()
      .then((result) => {
        return res.status(200).json({
          statusCode: 200,
          message: "User Created",
          data: {
            id: result.id,
            email: result.email,
          },
        });
      })
      .catch((err) => {
        console.log(err)
        res.status(500).json({ status: 500, message: "Internal Server Error" });
      });
  });
}

function emailPasswordAuth(req, res) {
  const { email, password } = req.body;
  Users.findOne({ email: email }).then((data) => {
    if (!data) {
      return res.status(404).json({
        statusCode: 404,
        message: "Invalid email or password",
      });
    }
    const hashPass = data.password;
    const tokenData = { id: data.id, email: data.email };
    unHashPassword({ plain: password, hash: hashPass }).then((result) => {
      if (!result) {
        data = {
          statusCode: 404,
          message: "Invalid email or password",
        };
        return res.status(404).json(data);
      }
      const token = generateToken(tokenData);
      res.cookie("token", token)
      return res.json({
        statusCode: 200,
        data: {
          token,
        },
      });
    });
  });
}

function getAccount(req, res) {
  return new Promise((resolve, reject) => {
    const { email, id } = req.accountDetails;
    Users.findOne({ email: email, id: id })
      .then((result) => {
        return res.status(200).json({
          statusCode: 200,
          data: {
            id: result.id,
            email: result.email,
            phonenumber: result.msisdn,
            apiKeys: result.apikeys,
          },
        });
      })
      .catch((err) =>
        res
          .status(500)
          .json({ statusCode: 500, message: "Internal Server Error" })
      );
  });
}

function getAccountByApiKey(req, res) {
  const { apiKey } = req.params;
  return new Promise((resolve, reject) => {
    Users.findOne({ "apikeys.key": apiKey })
      .then((accountDetails) => {
        if(accountDetails === null){
         return  res.json({statusCode:404,data:{}})
        }
        let accountData = {
          id: accountDetails.id,
          apiKeys: accountDetails.apikeys,
          email: accountDetails.email,
          msisdn: accountDetails.msisdn

        }
        const payload = {
          statusCode: 200,
          data: accountData,
        };
        return res.status(200).json(payload);
      })
      .catch((err) => {
        console.log(err)
        res
          .status(500)
          .json({ statusCode: 500, message: "Internal Server Error", err });
      });
  });
}

function googleAuth(req, res) {
  const userData = req.user;
  const payload = { email: userData.email };
  getAccount(payload)
    .then((accountDetails) => {
      if (accountDetails) {
        res.cookie("access_token", token, {
          httpOnly: true,
          secure: true,
        });
        return res.status(200).json({
          statusCode: 200,
          data: {
            token,
          },
        });
      } else {
        const tokenData = {
          id: uuid,
          email: userData.email,
        };
        const token = generateToken(tokenData);
        const User = new Users();
        User.email = userData.email;
        User.password = "";
        User.msisdn = "";
        User.save().then((result) => {
          res.cookie("access_token", token, {
            httpOnly: true,
            secure: true,
          });
          return res.redirect(webBaseUrl);
        });
      }
    })
    .catch((err) =>
      res
        .status(500)
        .json({ statusCode: 500, message: "Internal Server Error", err })
    );
}

function createApiKey(req, res) {
  const apiKey = generateRandomKey();
  const User = new Users();
  getAccount().then((accountDetails) => {
    const accountApiKeys = accountDetails.apikeys;
    accountApiKeys.push(apiKey);
    const filter = { id: req.accountDetails.id };
    const update = { apikeys: accountApiKeys };
    User.findOneAndUpdate(filter, update)
      .then((result) => {
        return res.status(200).json({ statusCode: 200, data: result });
      })
      .catch((err) =>
        res
          .status(500)
          .json({ statusCode: 500, message: "Internal Server Error", err })
      );
  });
}

function removeApiKey(req, res) {
  const apiKey = generateRandomKey();
  const User = new Users();
  getAccount()
    .then((accountDetails) => {
      const accountApiKeys = accountDetails.apikeys;
      const apiKeyId = req.params.id;
      const newApiKeys = accountApiKeys.filter((key) => key.id !== apiKeyId);
      accountApiKeys.push(apiKey);
      const filter = { id: req.accountDetails.id };
      const update = { apikeys: newApiKeys };
      return User.findOneAndUpdate(filter, update);
    })
    .then((_) => {
      return res.status(200).json({ statusCode: 200, data: result });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ statusCode: 500, message: "Internal Server Error", err });
    });
}

function authorization(req, res, next) {

  const jwtToken = req.headers.token;
  if (!jwtToken) {
    return res.status(401).json({ statusCode: 401, message: "Unauthorized" });
  }
  const decodedToken = decodeJwtToken(jwtToken);
  if (decodedToken === undefined || decodedToken === null) {
    return res.status(401).json({ statusCode: 401, message: "Invalid Token" });
  }
  req.accountDetails = decodedToken;
  next();
}

module.exports = {
  siginup,
  emailPasswordAuth,
  getAccount,
  googleAuth,
  createApiKey,
  removeApiKey,
  authorization,
  getAccountByApiKey,
};
