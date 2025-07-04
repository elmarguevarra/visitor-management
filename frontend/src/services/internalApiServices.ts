import { ACTIONS } from '@/constants/actions'
import { useAuthenticationStore } from '@/stores/authenticationStore'
import axios from 'axios'

const API_BASE = process.env.VUE_APP_API_ENDPOINT || ''

export async function postVisitor(data: any): Promise<any> {
  const authenticationStore = useAuthenticationStore()
  const token = authenticationStore.user?.access_token

  const response = await axios.post(`${API_BASE}visitor`, data, {
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

  const response = await axios.post(`${API_BASE}invite`, data, {
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

  const response = await axios.post(`${API_BASE}visit-request`, data, {
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

  const response = await axios.get(
    `${API_BASE}visitors?residentId=${residentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-Required-Permission': ACTIONS.API.GET_VISITORS,
      },
    },
  )
  return response.data
}

export async function getVisitRequestsByResidentId(
  residentId: string,
): Promise<any> {
  const authenticationStore = useAuthenticationStore()
  const token = authenticationStore.user?.access_token

  const response = await axios.get(
    `${API_BASE}visit-requests?residentId=${residentId}`,
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

  const response = await axios.get(`${API_BASE}visitor/${registrationId}`, {
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

  const response = await axios.get(`${API_BASE}invite/${inviteToken}`, {
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

  const response = await axios.get(`${API_BASE}visit-request/${inviteToken}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'X-Required-Permission': ACTIONS.API.GET_VISIT_REQUEST,
    },
  })
  return response.data
}
