import { useAuthenticationStore } from '@/stores/authenticationStore'
import axios from 'axios'

const API_BASE = process.env.VUE_APP_API_ENDPOINT || ''

export async function postVisitor(data: any): Promise<any> {
  const response = await axios.post(`${API_BASE}visitor`, data)
  return response.data
}

export async function postInvite(data: any): Promise<any> {
  const response = await axios.post(`${API_BASE}invite`, data)
  return response.data
}

export async function postVisitRequest(data: any): Promise<any> {
  const response = await axios.post(`${API_BASE}visit-request`, data)
  return response.data
}

export async function getVisitorsByResidentId(
  residentId: string,
): Promise<any> {
  const authenticationStore = useAuthenticationStore()
  const id_token = authenticationStore.user?.id_token

  const response = await axios.get(
    `${API_BASE}visitors?residentId=${residentId}`,
    {
      headers: {
        Authorization: `Bearer ${id_token}`,
      },
    },
  )
  return response.data
}

export async function getVisitRequestsByResidentId(
  residentId: string,
): Promise<any> {
  const authenticationStore = useAuthenticationStore()
  const id_token = authenticationStore.user?.id_token

  const response = await axios.get(
    `${API_BASE}visit-requests?residentId=${residentId}`,
    {
      headers: {
        Authorization: `Bearer ${id_token}`,
      },
    },
  )
  return response.data
}

export async function getVisitorByRegistrationId(
  registrationId: string,
): Promise<any> {
  const authenticationStore = useAuthenticationStore()
  const id_token = authenticationStore.user?.id_token

  const response = await axios.get(`${API_BASE}visitor/${registrationId}`, {
    headers: {
      Authorization: `Bearer ${id_token}`,
    },
  })
  return response.data
}

export async function getInviteByToken(inviteToken: string): Promise<any> {
  const authenticationStore = useAuthenticationStore()
  const id_token = authenticationStore.user?.id_token

  const response = await axios.get(`${API_BASE}invite/${inviteToken}`, {
    headers: {
      Authorization: `Bearer ${id_token}`,
    },
  })
  return response.data
}

export async function getVisitRequestByToken(
  inviteToken: string,
): Promise<any> {
  const authenticationStore = useAuthenticationStore()
  const id_token = authenticationStore.user?.id_token

  const response = await axios.get(`${API_BASE}visit-request/${inviteToken}`, {
    headers: {
      Authorization: `Bearer ${id_token}`,
    },
  })
  return response.data
}
