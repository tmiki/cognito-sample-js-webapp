// Those variables should be filled out with your AWS & Cognito User Pool configurations.
export const REGION = '** place your region name in string. **';
export const POOL_DATA = {
  UserPoolId: '** place your Pool Id. **',
  ClientId: '** place your App Client Id. **'
};
export const IDENTITY_POOL_ID = '** place your Cognito Identity Pool Id **';
export const LOGINS_KEY = 'cognito-idp.' + REGION + '.amazonaws.com/' + POOL_DATA.UserPoolId;
