const express = require("express");
const passport = require("passport");
const router = express.Router();
const { siginup,emailPasswordAuth,googleAuth,createApiKey,removeApiKey ,authorization, getAccount, getAccountByApiKey} = require("./controller");
require("../utils/auth");

router.post("/signup", siginup);
router.post("/login", emailPasswordAuth);
router.get("/google",passport.authenticate("google", { scope: ["email", "profile"] }));
router.get("/google/callback", passport.authenticate("google"),googleAuth);
router.post('/api-key',authorization,createApiKey);
router.delete('api-key/:id',authorization,removeApiKey);
router.get('/account',authorization,getAccount)
router.get('/api-key/:apiKey',getAccountByApiKey);


module.exports = router;

