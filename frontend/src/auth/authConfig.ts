import { UserManager } from 'oidc-client-ts'

const cognitoAuthConfig = {
  authority:
    'https://cognito-idp.ap-southeast-1.amazonaws.com/ap-southeast-1_scrgvy8Xg',
  client_id: '3jid0987p3l05ursbrs6gun0oi',
  redirect_uri: 'https://vms.alphinecodetech.click/signin-callback',
  response_type: 'code',
  scope: 'email openid',
}

// create a UserManager instance
export const userManager = new UserManager({
  ...cognitoAuthConfig,
})

export async function signOutRedirect() {
  const clientId = '3jid0987p3l05ursbrs6gun0oi'
  const logoutUri = 'https://vms.alphinecodetech.click/signout-callback'
  const cognitoDomain =
    'https://ap-southeast-1scrgvy8xg.auth.ap-southeast-1.amazoncognito.com'
  window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`
}
