
// import Amplify from '@aws-amplify/core';
// import Auth from '@aws-amplify/auth';

// See also about the way to load the AmazonCognitoIdentity module.
// https://github.com/aws-amplify/amplify-js/tree/master/packages/amazon-cognito-identity-js#usage
var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
import { CognitoUserPool, CognitoUserAttribute, CognitoUser } from 'amazon-cognito-identity-js';

const POOL_DATA = {
  UserPoolId: 'ap-northeast-1_6Z1yvHL9b',
  ClientId: 'jerk5a5h1ca9j6ku74pf4m7c7'
};
const IDENTITY_POOL_ID = 'ap-northeast-1:9d83eb8a-e9ed-41e6-83d7-1a5d23d31de1';
const REGION = 'ap-northeast-1';

var userPool = new AmazonCognitoIdentity.CognitoUserPool(POOL_DATA);

function _loadInputData(){
  const username = document.getElementById("input-username").value;
  const password = document.getElementById("input-password").value;
  const verificationCode = document.getElementById("input-verification-code").value;
  const email = document.getElementById("input-email").value;
 
  return {username: username, password: password, verificationCode: verificationCode, email: email};
}

function _putMessage(message){
  document.getElementById("message-area").innerText = message;
  return;
}

function _appendMessage(message){
  document.getElementById("message-area").innerText = document.getElementById("message-area").innerText + message;
  return;
}


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

  var cognitoUser;
  userPool.signUp(inputData.username, inputData.password, userAttributeList, null, function(err, result) {
    console.log("err: ", err);
    console.log("result: ", result);
    if(err){
      _putMessage('User registration error: Cognito has returned the message as follows: \n' + JSON.stringify(err));
      alert("sorry, your try to sign up has failed.");
      return;
    }
    cognitoUser = result.user;
  });

  console.log('registered user name is ' + cognitoUser.getUsername());
  _putMessage('User registration has finished successfully.\n' + 'Registered user name is ' + cognitoUser.getUsername());

  console.log("A function " + userSignUp.name + " has finished.");
};

function verifyCode(){
  console.log("A function " + verifyCode.name + " has started.");
  _putMessage("");
  const inputData = _loadInputData();
  console.log("inputData: " + JSON.stringify(inputData));

  const userData = {
    Username: inputData.username,
    Pool: userPool
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
    Pool: userPool
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
    Pool: userPool
  };
  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);


  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: (result) => {
      console.log("result: ", result);
      const accessToken = result.getAccessToken().getJwtToken();
      _putMessage("accessToken: " + accessToken);

      AWS.config.region = 'ap-northeast-1';
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 
      });

    },
    onFailure: (err) => {
      console.log("err: ", err);
    },
  });


  console.log("A function " + loginUser.name + " has finished.");
};

function logoutUser(){


};

// associates each functionalities to each buttons.
document.getElementById("sign-up-button").addEventListener("click", userSignUp);
document.getElementById("verify-code-button").addEventListener("click", verifyCode);
document.getElementById("resend-confirmation-by-email-button").addEventListener("click", resendConfirmationByEmail);
document.getElementById("login-button").addEventListener("click", loginUser);
document.getElementById("logout-button").addEventListener("click", logoutUser);


