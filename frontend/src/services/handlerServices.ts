import { ACTIONS } from '@/constants/actions'
import { useAuthenticationStore } from '@/stores/authenticationStore'
import axios from 'axios'

const defaultUserGroup = 'unassigned'

// NOTE: Add `/` before `api` to use the correct root base URL

export async function postVisitor(data: any): Promise<any> {
  const authenticationStore = useAuthenticationStore()
  const token = authenticationStore.user?.access_token

  const response = await axios.post(`/api/visitor`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'X-Required-Permission': ACTIONS.API.POST_VISITOR,
    },
  })
  return response.data
}

export async function postInvite(data: any): Promise<any> {
  const authenticationStore = useAuthenticationStore()
  const token = authenticationStore.user?.access_token

  const response = await axios.post(`/api/invite`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'X-Required-Permission': ACTIONS.API.POST_INVITE,
    },
  })
  return response.data
}

export async function postVisitRequest(data: any): Promise<any> {
  const authenticationStore = useAuthenticationStore()
  const token = authenticationStore.user?.access_token

  const response = await axios.post(`/api/visit-request`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'X-Required-Permission': ACTIONS.API.POST_VISIT_REQUEST,
    },
  })
  return response.data
}

export async function getVisitorsByResidentId(
  residentId: string,
): Promise<any> {
  const authenticationStore = useAuthenticationStore()
  const token = authenticationStore.user?.access_token // User access token for custom lambda authorizer

  const response = await axios.get(`/api/visitors?residentId=${residentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'X-Required-Permission': ACTIONS.API.GET_VISITORS,
    },
  })
  return response.data
}

export async function getVisitRequestsByResidentId(
  residentId: string,
): Promise<any> {
  const authenticationStore = useAuthenticationStore()
  const token = authenticationStore.user?.access_token

  const response = await axios.get(
    `api/visit-requests?residentId=${residentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-Required-Permission': ACTIONS.API.GET_VISIT_REQUESTS,
      },
    },
  )
  return response.data
}

export async function getVisitorByRegistrationId(
  registrationId: string,
): Promise<any> {
  const authenticationStore = useAuthenticationStore()
  const token = authenticationStore.user?.access_token

  const response = await axios.get(`/api/visitor/${registrationId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'X-Required-Permission': ACTIONS.API.GET_VISITOR,
    },
  })
  return response.data
}

export async function getInviteByToken(inviteToken: string): Promise<any> {
  const authenticationStore = useAuthenticationStore()
  const token = authenticationStore.user?.access_token

  const response = await axios.get(`/api/invite/${inviteToken}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'X-Required-Permission': ACTIONS.API.GET_INVITE,
    },
  })
  return response.data
}

export async function getVisitRequestByToken(
  inviteToken: string,
): Promise<any> {
  try {
    const authenticationStore = useAuthenticationStore()
    const token = authenticationStore.user?.access_token

    const response = await axios.get(`/api/visit-request/${inviteToken}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-Required-Permission': ACTIONS.API.GET_VISIT_REQUEST,
      },
    })

    if (Object.keys(response.data).length === 0) {
      console.log(
        `Visit request with token '${inviteToken}' not found. API returned an empty object. Setting visitRequest to null.`,
      )
      return null
    }

    return response.data
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get visit request by token: ${error.message}`)
    } else {
      throw new Error(
        `Failed to get visit request by token: An unknown error occurred.`,
      )
    }
  }
}

export async function evaluatePermissions(
  userGroup: string | undefined,
  actions: string[] | undefined,
): Promise<any> {
  const authenticationStore = useAuthenticationStore()
  const token = authenticationStore.user?.id_token // Use id token for CognitoAuthorizer

  const params = new URLSearchParams()
  params.append('principalId', userGroup ?? defaultUserGroup)

  if (actions && actions.length > 0) {
    params.append('actions', actions.join(','))
  }

  const queryString = params.toString()
  const url = queryString
    ? `/api/permissions?${queryString}`
    : `api/permissions`

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'X-Required-Permission': ACTIONS.API.GET_PERMISSIONS,
    },
  })

  return response.data
}

const SEND_EMAIL_NOTIFICATIONS_PARAMETER =
  process.env.VUE_APP_SEND_EMAIL_NOTIFICATIONS_PARAMETER

export async function sendEmailNotification(data: any): Promise<any> {
  const authenticationStore = useAuthenticationStore()
  const token = authenticationStore.user?.access_token

  const res = await axios.get(
    `/api/ssm-parameter?param=${SEND_EMAIL_NOTIFICATIONS_PARAMETER}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  )
  const lambdaResponse = res.data
  const payload = JSON.parse(lambdaResponse.body)
  const sendEmailNotifications = payload.sendEmailNotifications
  if (sendEmailNotifications === 'false') {
    console.warn(
      'Email notifications are disabled. Skipping sendEmailNotification.',
    )
    return
  }
  console.info(
    'Sending email notification with data:',
    JSON.stringify(data, null, 2),
  )

  const response = await axios.post(`/api/send-email`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'X-Required-Permission': ACTIONS.API.SEND_NOTIFICATION, //TODO: Revisit this if still needed. System notifications may not require explicit permissions
    },
  })
  return response.data
}
