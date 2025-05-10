import { UserManager } from 'oidc-client-ts'

const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID || ''
const USER_POOL_CLIENT_ID = process.env.COGNITO_USER_POOL_CLIENT_ID || ''
const USER_POOL_DOMAIN = process.env.COGNITO_USER_POOL_DOMAIN || ''
const AUTHORITY = process.env.AUTHORITY || ''


const cognitoAuthConfig = {
  authority: AUTHORITY,
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
  const cognitoDomain = USER_POOL_DOMAIN
  window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`
}
