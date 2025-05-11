import { UserManager } from 'oidc-client-ts'

// const USER_POOL_CLIENT_ID = process.env.COGNITO_USER_POOL_CLIENT_ID || ''
// const USER_POOL_DOMAIN_URL = process.env.COGNITO_USER_POOL_DOMAIN_URL || ''
// const AUTHORITY_URL = process.env.COGNITO_AUTHORITY_URL || ''

console.log(
  'process.env.COGNITO_USER_POOL_CLIENT_ID: ',
  process.env.VUE_APP_COGNITO_USER_POOL_CLIENT_ID,
)
console.log(
  'process.env.COGNITO_USER_POOL_DOMAIN_URL: ',
  process.env.VUE_APP_COGNITO_USER_POOL_DOMAIN_URL,
)
console.log(
  'process.env.COGNITO_AUTHORITY_URL: ',
  process.env.VUE_APP_COGNITO_AUTHORITY_URL,
)

const USER_POOL_CLIENT_ID = '32kjaah9rh2c0q38dghktm71t1'
const USER_POOL_DOMAIN_URL =
  'https://alphine-vms-auth.auth.ap-southeast-1.amazoncognito.com'
const AUTHORITY_URL =
  'https://cognito-idp.ap-southeast-1.amazonaws.com/ap-southeast-1_DSpKRdggr'

const cognitoAuthConfig = {
  authority: AUTHORITY_URL,
  client_id: USER_POOL_CLIENT_ID,
  redirect_uri: 'https://vms.alphinecodetech.click/signin-callback',
  response_type: 'code',
  scope: 'email openid',
}

// create a UserManager instance
export const userManager = new UserManager({
  ...cognitoAuthConfig,
})

export async function signOutRedirect() {
  const clientId = USER_POOL_CLIENT_ID
  const logoutUri = 'https://vms.alphinecodetech.click/signout-callback'
  const cognitoDomain = USER_POOL_DOMAIN_URL
  window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`
}
