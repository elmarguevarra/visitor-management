import { ACTIONS } from '@/constants/actions'
import { useAuthenticationStore } from '@/stores/authenticationStore'
import axios from 'axios'

const defaultUserGroup = 'unassigned'

export async function postVisitor(data: any): Promise<any> {
  const authenticationStore = useAuthenticationStore()
  const token = authenticationStore.user?.access_token

  const response = await axios.post(`api/visitor`, data, {
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

  const response = await axios.post(`api/invite`, data, {
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

  const response = await axios.post(`api/visit-request`, data, {
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

  const response = await axios.get(`api/visitors?residentId=${residentId}`, {
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

  const response = await axios.get(`api/visitor/${registrationId}`, {
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

  const response = await axios.get(`api/invite/${inviteToken}`, {
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
  const authenticationStore = useAuthenticationStore()
  const token = authenticationStore.user?.access_token

  const response = await axios.get(`api/visit-request/${inviteToken}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'X-Required-Permission': ACTIONS.API.GET_VISIT_REQUEST,
    },
  })
  return response.data
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
  const url = queryString ? `api/permissions?${queryString}` : `api/permissions`

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'X-Required-Permission': ACTIONS.API.GET_PERMISSIONS,
    },
  })

  return response.data
}

export async function sendNotification(data: any): Promise<any> {
  const authenticationStore = useAuthenticationStore()
  const token = authenticationStore.user?.access_token

  const response = await axios.post(`api/send-email`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'X-Required-Permission': ACTIONS.API.SEND_NOTIFICATION, //TODO: Revisit this if still needed. System notifications may not require explicit permissions
    },
  })
  return response.data
}
