
// See also about the way to load the AmazonCognitoIdentity module.
// https://github.com/aws-amplify/amplify-js/tree/master/packages/amazon-cognito-identity-js#usage

var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
import { CognitoUserPool, CognitoUserAttribute, CognitoUser } from 'amazon-cognito-identity-js';

// ------------------------------------------------------------
// Global variables
// ------------------------------------------------------------
const POOL_DATA = {
  UserPoolId: 'ap-northeast-1_6Z1yvHL9b',
  ClientId: 'jerk5a5h1ca9j6ku74pf4m7c7'
};
const IDENTITY_POOL_ID = 'ap-northeast-1:9d83eb8a-e9ed-41e6-83d7-1a5d23d31de1';
const REGION = 'ap-northeast-1';

var userPool = new AmazonCognitoIdentity.CognitoUserPool(POOL_DATA);

// ------------------------------------------------------------
// Functions to be associated with each button.
// ------------------------------------------------------------
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

function resetPassword(){
  console.log("A function " + resetPassword.name + " has started.");
  _putMessage("");
  const inputData = _loadInputData();
  console.log("inputData: " + JSON.stringify(inputData));

  const userData = {
    Username: inputData.username,
    Pool: userPool
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
    Pool: userPool
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
    Pool: userPool
  };
  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);


  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: (result) => {
      console.log("result: ", result);
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
    // Prepare an object corresponds to the Cognito Identity Pool
    const cognitoIdpUrl = 'cognito-idp.' + REGION + '.amazonaws.com/' + POOL_DATA.UserPoolId;
    var logins;
    logins[cognitoIdpUrl] = result.getIdToken().getJwtToken();

    AWS.config.region = 'ap-northeast-1';
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: IDENTITY_POOL_ID,
      // Logins : { }
      logins
    });

    // refresh AWS credentials
    AWS.config.credentials.refresh((err) => {
      if (err){
        console.log(err);
        _appendMessage("\n" + "refreshing AWS credentials failed. Cognito Identity returns messages as follows: \n" + JSON.stringify(err));
      } else {
        _appendMessage("\n" + "refreshing has succeeded.");
      }
    });



};

function logoutUser(){


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

