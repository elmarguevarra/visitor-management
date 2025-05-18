import { UserManager } from 'oidc-client-ts'

const USER_POOL_CLIENT_ID =
  process.env.VUE_APP_COGNITO_USER_POOL_CLIENT_ID || ''
const USER_POOL_DOMAIN_URL =
  process.env.VUE_APP_COGNITO_USER_POOL_DOMAIN_URL || ''
const AUTHORITY_URL = process.env.VUE_APP_COGNITO_AUTHORITY_URL || ''
const FRONTEND_BASE_URL = process.env.VUE_APP_FRONTEND_BASE_URL || ''

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
console.log(
  'process.env.VUE_APP_FRONTEND_BASE_URL: ',
  process.env.VUE_APP_FRONTEND_BASE_URL,
)

const cognitoAuthConfig = {
  authority: AUTHORITY_URL,
  client_id: USER_POOL_CLIENT_ID,
  redirect_uri: `${FRONTEND_BASE_URL}/signin-callback`,
  response_type: 'code',
  scope: 'email openid profile',
}

// create a UserManager instance
export const userManager = new UserManager({
  ...cognitoAuthConfig,
})

export async function signOutRedirect() {
  const clientId = USER_POOL_CLIENT_ID
  const logoutUri = `${FRONTEND_BASE_URL}/signout-callback`
  const cognitoDomain = USER_POOL_DOMAIN_URL
  window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`
}
