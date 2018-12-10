# cognito-sample-js-webapp
This project is merely for learning purpose about Amazon Cognito Userpool.  
This application depends on the following library.  
https://github.com/aws-amplify/amplify-js/tree/master/packages/amazon-cognito-identity-js

## Getting Started
This project needs an AWS account and a local JavaScript development environment as below.

### Prerequisite

1. AWS environment
   * AWS account  
2. Local environment
   * npm 5.6.0 or higher  
   * Node v8.11.4 or compatible (Maybe it can run under v6 or v10. But I haven't check whether it can run under them.)  

### How to set up your Cognito User Pool/Federated Identities
Create your new User Pool according to the Step 1 of the official document below.  
https://docs.aws.amazon.com/cognito/latest/developerguide/tutorial-integrating-user-pools-javascript.html#tutorial-integrating-user-pools-console-javascript

Create your new Federated Identities pool according to the following official document.  
https://docs.aws.amazon.com/cognito/latest/developerguide/getting-started-with-identity-pools.html

You need to have the following items. Make sure to note them.  
1. Region Name
2. Cognito User Pool
   * Pool Id
   * App client id
3. Cognito Federated Identities
   * Identity Pool Id

### How to set up your Local environment
Please ensure that the node.js and npm can be run under your favorable way.  

If you prefer to run them in a Windows environment, I recommend "nvm-windows".  
https://github.com/coreybutler/nvm-windows

If you prefer to run them in a Linux environment, I recommend "nvm".  
https://github.com/creationix/nvm

## Running the application
### Change the User Pool/Federated Identities configurations.
Please place your settings into the index.js.

```
$ vi src/index.js
```

You can find the following sentences which configure User Pool and Federated Identities.
```
const REGION = '** place your region name in string. **';
const POOL_DATA = {
  UserPoolId: '** place your Pool Id. **',
  ClientId: '** place your App Client Id. **'
};
const IDENTITY_POOL_ID = '** place your Cognito Identity Pool Id **';
const LOGINS_KEY = 'cognito-idp.' + REGION + '.amazonaws.com/' + POOL_DATA.UserPoolId;
```

### Change the Listen port by webpack-dev-server
Please change the variable "webpackConfig.devServer.port" be suitable for your Local environment.  
This application will listen on the port TCP/8123 by default.  

```
$ vi webpack.config.js
```

```
const webpackConfig = {
// ** omit ** 
  devServer: {
    contentBase: DIR_DIST,
    host: '0.0.0.0',
    port: 8123
  }
};
```

### Run the webpack-dev-server by the npm command
You have to install node modules at first.

```
$ npm install
```

Once you perform the following command, the webpack-dev-server runs immediately.  

```
$ npm run start
```

### Access your application by your web browser
Open up the URL below.  

http://localhost:8123/

Congratulations!  
You've run the simple JavaScript app with Cognito User Pool and Federated Identities.

# License
MIT License

