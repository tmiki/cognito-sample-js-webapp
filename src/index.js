
// See also about the way to load the AmazonCognitoIdentity module.
// https://github.com/aws-amplify/amplify-js/tree/master/packages/amazon-cognito-identity-js#usage

const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
import { CognitoUserPool, CognitoUserAttribute, CognitoUser } from 'amazon-cognito-identity-js';

const AWS = require('aws-sdk');
require('amazon-cognito-js');

// ------------------------------------------------------------
// Global variables
// ------------------------------------------------------------
const REGION = 'ap-northeast-1';
const POOL_DATA = {
  UserPoolId: 'ap-northeast-1_6Z1yvHL9b',
  ClientId: 'jerk5a5h1ca9j6ku74pf4m7c7'
};
const IDENTITY_POOL_ID = 'ap-northeast-1:9d83eb8a-e9ed-41e6-83d7-1a5d23d31de1';
const LOGINS_KEY = 'cognito-idp.' + REGION + '.amazonaws.com/' + POOL_DATA.UserPoolId;

var cognitoUserPool;
var cognitoUser;

// ------------------------------------------------------------
// Utility functions.
// ------------------------------------------------------------
function _loadInputData() {
  const username = document.getElementById("input-username").value;
  const password = document.getElementById("input-password").value;
  const verificationCode = document.getElementById("input-verification-code").value;
  const email = document.getElementById("input-email").value;
 
  return {username: username, password: password, verificationCode: verificationCode, email: email};
};

function _putMessage(message) {
  document.getElementById("message-area").innerText = message;
  return;
};

function _appendMessage(message) {
  document.getElementById("message-area").innerText = document.getElementById("message-area").innerText + message;
  return;
};

function _initCognitoUser() {
  cognitoUserPool = new AmazonCognitoIdentity.CognitoUserPool(POOL_DATA);
  console.log(cognitoUserPool);

  cognitoUser = cognitoUserPool.getCurrentUser();
  console.log(cognitoUser);

  if (cognitoUser === null) {
    console.log("nobody logged in.");
    return;
  };

  cognitoUser.getSession((err, session) => {
    if (err) {
      console.log("getSession: err: " + JSON.stringify(err));
      _putMessage("getSession: err: " + JSON.stringify(err));
      return;
    }
    console.log('session validity: ' + session.isValid());
    // console.log('session: ' + JSON.stringify(session));

    cognitoUser.getUserAttributes((err, attributes) => {
      if (err) {
        console.log("getUserAttributes: err: " + JSON.stringify(err));
        _putMessage("getUserAttributes: err: " + JSON.stringify(err));
      } else {
        console.log("attributes: " + JSON.stringify(attributes));
        _putMessage("attributes: " + JSON.stringify(attributes));
      };

    });

  });

};

function _updateShowingState() {
  var loginStateText = document.getElementById("state-login-status").innerText;
  var loginUsernameText = document.getElementById("state-login-username").innerText;

  if(cognitoUser === null) {
    document.getElementById("state-login-status").innerText = "not logged in";
    return;
  }

  document.getElementById("state-login-status").innerText = "logged in";
  document.getElementById("state-login-username").innerText = cognitoUser.username;

//  const accessToken = cognitoUser.getAccessToken();
//  const idToken = cognitoUser.getIdToken();
//  const refreshToken = cognitoUser.getRefreshToken();

};

// ------------------------------------------------------------
// Functions to be associated with each button.
// ------------------------------------------------------------
function userSignUp() {
  console.log("A function " + userSignUp.name + " has started.");
  _putMessage("");

  const inputData = _loadInputData();
  console.log("inputData: " + JSON.stringify(inputData));

  // validate input values
  if (inputData.username.length < 6){
    _putMessage('User registration error: too short username. it shoud be greater than 6 characters.');
    return;
  }
  if (inputData.password.length < 8){
    _putMessage('User registration error: too short password. it shoud be greater than 8 characters.');
    return;
  }

  const userAttributeList = [];
  const dataEmail = {
    Name: 'email',
    Value: inputData.email
  };

  const attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);

  userAttributeList.push(attributeEmail);

  cognitoUserPool.signUp(inputData.username, inputData.password, userAttributeList, null, function(err, result) {
    console.log("err: ", err);
    console.log("result: ", result);

    // Registration failed.
    if(err){
      _putMessage('User registration error: Cognito has returned the message as follows: \n' + JSON.stringify(err));
      alert("sorry, your try to sign up has failed.");
      return;
    }

    // Registration succeeded.
    cognitoUser = result.user;

    console.log('registered user name is ' + cognitoUser.getUsername());
    _putMessage('User registration has finished successfully.\n' + 'Registered user name is ' + cognitoUser.getUsername());
  });

  console.log("A function " + userSignUp.name + " has finished.");
};

function verifyCode(){
  console.log("A function " + verifyCode.name + " has started.");
  _putMessage("");
  const inputData = _loadInputData();
  console.log("inputData: " + JSON.stringify(inputData));

  const userData = {
    Username: inputData.username,
    Pool: cognitoUserPool
  };

  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  cognitoUser.confirmRegistration(inputData.verificationCode, true, function(err, result) {
    console.log("err: ", err);
    console.log("result: ", result);
    if (err) {
      _putMessage('User verification error: Cognito has returned the message as follows: \n' + JSON.stringify(err));
      alert("sorry, verification has failed.");
      return;
    };
  });

  console.log("A function " + verifyCode.name + " has finished.");
};

function resendConfirmationByEmail(){
  console.log("A function " + resendConfirmationByEmail.name + " has started.");
  _putMessage("");
  const inputData = _loadInputData();
  console.log("inputData: " + JSON.stringify(inputData));

  const userData = {
    Username: inputData.username,
    Pool: cognitoUserPool
  };

  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  cognitoUser.resendConfirmationCode(function(err, result) {
    console.log("err: ", err);
    console.log("result: ", result);
    if (err) {
      _putMessage('Resending confirmation code error: Cognito has returned the message as follows: \n' + JSON.stringify(err));
      alert("sorry, resending confirmation has failed.");
      return;
    };
  });

  console.log("A function " + resendConfirmationByEmail.name + " has finished.");
};

function resetPassword(){
  console.log("A function " + resetPassword.name + " has started.");
  _putMessage("");
  const inputData = _loadInputData();
  console.log("inputData: " + JSON.stringify(inputData));

  const userData = {
    Username: inputData.username,
    Pool: cognitoUserPool
  };

  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  cognitoUser.forgotPassword({
    onSuccess: (data) => {
      console.log(data);
      _putMessage("Your password needs resetting and confirming.");
      _appendMessage("data: " + JSON.stringify(data));
    },
    onFailure: (err) => {
      console.log(err);
      _putMessage("Resetting password failed.");
      _appendMessage("err: " + JSON.stringify(err));
    },
    inputVerificationCode: (data) => {
      console.log("Code sent to:" + data);
      var verificationCode = prompt('Please input verification code ', '');
      var newPassword = prompt('Enter new password ', '');
      cognitoUser.confirmPassword(verificationCode, newPassword, {
        onSuccess: () => {
          console.log('Password confirmed!');
          _appendMessage('Resetting password succeeded!');
        },
        onFailure: (err) => {
          console.log('Password not confirmed!');
          _appendMessage('Resetting password failed.');
        }
      });
    }
  });

  console.log("A function " + resetPassword.name + " has finished.");
};

function confirmPassword(){
  console.log("A function " + resetPassword.name + " has started.");
  _putMessage("");
  const inputData = _loadInputData();
  console.log("inputData: " + JSON.stringify(inputData));

  const userData = {
    Username: inputData.username,
    Pool: cognitoUserPool
  };

  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  cognitoUser.confirmPassword(inputData.verificationCode, inputData.password, {
    onSuccess: () => {
      console.log('Password confirmed!');
      _appendMessage('Resetting your password succeeded!');
    },
    onFailure: (err) => {
      console.log('Password not confirmed!');
      _appendMessage('Confirming your verification code or new password failed.');
    }
  });

};

function loginUser(){
  console.log("A function " + loginUser.name + " has started.");
  _putMessage("");
  const inputData = _loadInputData();
  console.log("inputData: " + JSON.stringify(inputData));


  const authenticationData = {
    Username: inputData.username,
    Password: inputData.password
  };
  const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
  const userData = {
    Username: inputData.username,
    Pool: cognitoUserPool
  };

  // override the global variable "cognitoUser" object.
  cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: (result) => {
      console.log("result: ", result);
      console.log("cognitoUser: ", cognitoUser);
      const accessToken = result.getAccessToken().getJwtToken();
      _putMessage("Login succeeded!\n");
      _appendMessage("\naccessToken: " + accessToken);

    },
    onFailure: (err) => {
      console.log("err: ", err);
      _putMessage("\n" + "login failed.\n");
      _appendMessage("err: " + JSON.stringify(err));
    },
  });

  console.log("A function " + loginUser.name + " has finished.");
};

function getAWSCredentials(){
  console.log("A function " + getAWSCredentials.name + " has started.");
  _putMessage("");
  const inputData = _loadInputData();
  console.log("inputData: " + JSON.stringify(inputData));

  // retrieve current session
  cognitoUser.getSession((err, session) => {
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
        _appendMessage("\n" + "refreshing AWS credentials failed. Cognito Identity returns messages as follows: \n" + JSON.stringify(err));
        return;
      }

      _appendMessage("\n" + "refreshing has succeeded.");

      const identityId = AWS.config.credentials.identityId;
      console.log("identityId: " + identityId);
      _appendMessage("\n" + "identityId: " + identityId);
    });
  });

  console.log("A function " + getAWSCredentials.name + " has finished.");
};

function logoutUser(){
  cognitoUser.signOut();
  console.log(cognitoUser);

  _putMessage("Signing out has been finished.");
  _appendMessage("\n" + "cognitoUser: " + JSON.stringify(cognitoUser));
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


_initCognitoUser();
_updateShowingState();

