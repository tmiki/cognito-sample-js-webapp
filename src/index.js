
// See also about the way to load the AmazonCognitoIdentity module.
// https://github.com/aws-amplify/amplify-js/tree/master/packages/amazon-cognito-identity-js#usage

const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
import { CognitoUserPool, CognitoUserAttribute, CognitoUser } from 'amazon-cognito-identity-js';

const AWS = require('aws-sdk');
require('amazon-cognito-js');

// ------------------------------------------------------------
// Global variables
// ------------------------------------------------------------
import {REGION, POOL_DATA, IDENTITY_POOL_ID, LOGIN_KEYS } from './global-variables.js';

var gCognitoUserPool;
var gCognitoUser;
var gAccessToken;
var gIdToken;
var gRefreshToken;

// ------------------------------------------------------------
// Utility functions.
// ------------------------------------------------------------
function gLoadInputData() {
  const username = document.getElementById("input-username").value;
  const password = document.getElementById("input-password").value;
  const verificationCode = document.getElementById("input-verification-code").value;
  const email = document.getElementById("input-email").value;
 
  return {username: username, password: password, verificationCode: verificationCode, email: email};
};

function gPutMessage(message) {
  document.getElementById("message-area").innerText = message;
  return;
};

function gAppendMessage(message) {
  document.getElementById("message-area").innerText = document.getElementById("message-area").innerText + message;
  return;
};

function gInitCognitoUser() {
  gCognitoUserPool = new AmazonCognitoIdentity.CognitoUserPool(POOL_DATA);
  console.log(gCognitoUserPool);

  gCognitoUser = gCognitoUserPool.getCurrentUser();
  console.log(gCognitoUser);

  if (gCognitoUser === null) {
    console.log("nobody logged in.");
    return;
  };

  gCognitoUser.getSession((err, session) => {
    // check whether your session is valid and output the result.
    if (err) {
      console.log("getSession: err: " + JSON.stringify(err));
      gPutMessage("getSession: err: " + JSON.stringify(err));
      return;
    }
    console.log('session validity: ' + session.isValid());
    gPutMessage('session validity: ' + session.isValid() + "\n");
    // gAppendMessage('session: ' + JSON.stringify(session));
    console.log(session);

    // get each tokens and store them into global variables.
    gAccessToken = session.getAccessToken();
    gIdToken = session.getIdToken();
    gRefreshToken = session.getRefreshToken();

    // get and show user attributes.
    gCognitoUser.getUserAttributes((err, attributes) => {
      if (err) {
        console.log("getUserAttributes: err: " + JSON.stringify(err));
        gAppendMessage("getUserAttributes: err: " + JSON.stringify(err));
      } else {
        console.log("attributes: " + JSON.stringify(attributes));
        gAppendMessage("attributes: " + JSON.stringify(attributes));
      };

    });

  });

};

function gUpdateShowingState() {
  var loginStateText = document.getElementById("state-login-status").innerText;
  var loginUsernameText = document.getElementById("state-login-username").innerText;

  if(gCognitoUser === null) {
    document.getElementById("state-login-status").innerText = "not logged in";
    return;
  }

  document.getElementById("state-login-status").innerText = "logged in";
  document.getElementById("state-login-username").innerText = gCognitoUser.username;

  document.getElementById("state-access-token").innerText = JSON.stringify(gAccessToken) + "\n";
  document.getElementById("state-id-token").innerText = JSON.stringify(gIdToken) + "\n";
  document.getElementById("state-refresh-token").innerText = JSON.stringify(gRefreshToken) + "\n";

};

// ------------------------------------------------------------
// Functions to be associated with each button.
// ------------------------------------------------------------
function userSignUp() {
  console.log("A function " + userSignUp.name + " has started.");
  gPutMessage("");

  const inputData = gLoadInputData();
  console.log("inputData: " + JSON.stringify(inputData));

  // validate input values
  if (inputData.username.length < 6){
    gPutMessage('User registration error: too short username. it shoud be greater than 6 characters.');
    return;
  }
  if (inputData.password.length < 8){
    gPutMessage('User registration error: too short password. it shoud be greater than 8 characters.');
    return;
  }

  const userAttributeList = [];
  const dataEmail = {
    Name: 'email',
    Value: inputData.email
  };

  const attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);

  userAttributeList.push(attributeEmail);

  gCognitoUserPool.signUp(inputData.username, inputData.password, userAttributeList, null, function(err, result) {
    console.log("err: ", err);
    console.log("result: ", result);

    // Registration failed.
    if(err){
      gPutMessage('User registration error: Cognito has returned the message as follows: \n' + JSON.stringify(err));
      alert("sorry, your try to sign up has failed.");
      return;
    }

    // Registration succeeded.
    gCognitoUser = result.user;

    console.log('registered user name is ' + gCognitoUser.getUsername());
    gPutMessage('User registration has finished successfully.\n' + 'Registered user name is ' + gCognitoUser.getUsername());
  });

  console.log("A function " + userSignUp.name + " has finished.");
};

function verifyCode(){
  console.log("A function " + verifyCode.name + " has started.");
  gPutMessage("");
  const inputData = gLoadInputData();
  console.log("inputData: " + JSON.stringify(inputData));

  const userData = {
    Username: inputData.username,
    Pool: gCognitoUserPool
  };

  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  cognitoUser.confirmRegistration(inputData.verificationCode, true, function(err, result) {
    console.log("err: ", err);
    console.log("result: ", result);
    if (err) {
      gPutMessage('User verification error: Cognito has returned the message as follows: \n' + JSON.stringify(err));
      alert("sorry, verification has failed.");
      return;
    };
  });

  console.log("A function " + verifyCode.name + " has finished.");
};

function resendConfirmationByEmail(){
  console.log("A function " + resendConfirmationByEmail.name + " has started.");
  gPutMessage("");
  const inputData = gLoadInputData();
  console.log("inputData: " + JSON.stringify(inputData));

  const userData = {
    Username: inputData.username,
    Pool: gCognitoUserPool
  };

  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  cognitoUser.resendConfirmationCode(function(err, result) {
    console.log("err: ", err);
    console.log("result: ", result);
    if (err) {
      gPutMessage('Resending confirmation code error: Cognito has returned the message as follows: \n' + JSON.stringify(err));
      alert("sorry, resending confirmation has failed.");
      return;
    };
  });

  console.log("A function " + resendConfirmationByEmail.name + " has finished.");
};

function resetPassword(){
  console.log("A function " + resetPassword.name + " has started.");
  gPutMessage("");
  const inputData = gLoadInputData();
  console.log("inputData: " + JSON.stringify(inputData));

  const userData = {
    Username: inputData.username,
    Pool: gCognitoUserPool
  };

  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  cognitoUser.forgotPassword({
    onSuccess: (data) => {
      console.log(data);
      gPutMessage("Your password needs resetting and confirming.");
      gAppendMessage("data: " + JSON.stringify(data));
    },
    onFailure: (err) => {
      console.log(err);
      gPutMessage("Resetting password failed.");
      gAppendMessage("err: " + JSON.stringify(err));
    },
    inputVerificationCode: (data) => {
      console.log("Code sent to:" + data);
      var verificationCode = prompt('Please input verification code ', '');
      var newPassword = prompt('Enter new password ', '');
      cognitoUser.confirmPassword(verificationCode, newPassword, {
        onSuccess: () => {
          console.log('Password confirmed!');
          gAppendMessage('Resetting password succeeded!');
        },
        onFailure: (err) => {
          console.log('Password not confirmed!');
          gAppendMessage('Resetting password failed.');
        }
      });
    }
  });

  console.log("A function " + resetPassword.name + " has finished.");
};

function confirmPassword(){
  console.log("A function " + resetPassword.name + " has started.");
  gPutMessage("");
  const inputData = gLoadInputData();
  console.log("inputData: " + JSON.stringify(inputData));

  const userData = {
    Username: inputData.username,
    Pool: gCognitoUserPool
  };

  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  cognitoUser.confirmPassword(inputData.verificationCode, inputData.password, {
    onSuccess: () => {
      console.log('Password confirmed!');
      gAppendMessage('Resetting your password succeeded!');
    },
    onFailure: (err) => {
      console.log('Password not confirmed!');
      gAppendMessage('Confirming your verification code or new password failed.');
    }
  });

};

function loginUser(){
  console.log("A function " + loginUser.name + " has started.");
  gPutMessage("");
  const inputData = gLoadInputData();
  console.log("inputData: " + JSON.stringify(inputData));


  const authenticationData = {
    Username: inputData.username,
    Password: inputData.password
  };
  const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
  const userData = {
    Username: inputData.username,
    Pool: gCognitoUserPool
  };

  // override the global variable "gCognitoUser" object.
  gCognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  gCognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: (result) => {
      console.log("result: ", result);
      console.log("gCognitoUser: ", gCognitoUser);
      const accessToken = result.getAccessToken().getJwtToken();
      gPutMessage("Login succeeded!\n");
      gAppendMessage("\naccessToken: " + accessToken);

     gInitCognitoUser();
    },
    onFailure: (err) => {
      console.log("err: ", err);
      gPutMessage("\n" + "login failed.\n");
      gAppendMessage("err: " + JSON.stringify(err));
    },
  });

  console.log("A function " + loginUser.name + " has finished.");
};

function getAWSCredentials(){
  console.log("A function " + getAWSCredentials.name + " has started.");
  gPutMessage("");
  const inputData = gLoadInputData();
  console.log("inputData: " + JSON.stringify(inputData));

  // retrieve current session
  gCognitoUser.getSession((err, session) => {
    if (err) {
      console.log("getSession: err: " + JSON.stringify(err));
      return;
    }
    console.log('session validity: ' + session.isValid());
    // console.log('session: ' + JSON.stringify(session));


    // Prepare an object corresponds to the Cognito Identity Pool
    const cognitoIdentityParams = {
      IdentityPoolId: IDENTITY_POOL_ID,
      Logins: {
        [LOGINS_KEY]: session.getIdToken().getJwtToken()
      }
    };
    console.log(cognitoIdentityParams);

    AWS.config.region = REGION;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials(cognitoIdentityParams);

    // refresh AWS credentials
    AWS.config.credentials.refresh((err) => {
      if (err){
        console.log(err);
        gAppendMessage("\n" + "refreshing AWS credentials failed. Cognito Identity returns messages as follows: \n" + JSON.stringify(err));
        return;
      }

      gAppendMessage("\n" + "refreshing has succeeded.");

      const identityId = AWS.config.credentials.identityId;
      const credentials = AWS.config.credentials;
      console.log("identityId: " + identityId);
      console.log(AWS.config.credentials)
      gAppendMessage("\n" + "identityId: " + identityId);
      gAppendMessage("\n" + "accessKeyId: " + credentials.accessKeyId);
      gAppendMessage("\n" + "secretAccessKey: " + credentials.secretAccessKey);
      gAppendMessage("\n" + "sessionToken: " + credentials.sessionToken);
    });
  });

  console.log("A function " + getAWSCredentials.name + " has finished.");
};

function logoutUser(){
  gCognitoUser.signOut();
  console.log(gCognitoUser);

  gPutMessage("Signing out has been finished.");
  gAppendMessage("\n" + "gCognitoUser: " + JSON.stringify(gCognitoUser));
};


// ------------------------------------------------------------
// associates each functionalities to each button.
// ------------------------------------------------------------
document.getElementById("sign-up-button").addEventListener("click", userSignUp);
document.getElementById("verify-code-button").addEventListener("click", verifyCode);
document.getElementById("resend-confirmation-by-email-button").addEventListener("click", resendConfirmationByEmail);
document.getElementById("reset-password-button").addEventListener("click", resetPassword);
document.getElementById("confirm-password-button").addEventListener("click", confirmPassword);
document.getElementById("login-button").addEventListener("click", loginUser);
document.getElementById("get-aws-credentials-button").addEventListener("click", getAWSCredentials);
document.getElementById("logout-button").addEventListener("click", logoutUser);


// ------------------------------------------------------------
// main processes
// ------------------------------------------------------------


gInitCognitoUser();
gUpdateShowingState();

