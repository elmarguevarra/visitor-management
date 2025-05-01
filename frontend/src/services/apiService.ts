import axios from 'axios'

const API_BASE = process.env.VUE_APP_API_ENDPOINT || ''

export async function createVisitor(data: any): Promise<any> {
  const response = await axios.post(`${API_BASE}visitor`, data)
  return response.data
}

export async function createInvite(residentId: string): Promise<any> {
  const response = await axios.post(`${API_BASE}invite`, {
    residentId: residentId,
  })
  return response.data
}

export async function createVisitRequest(data: any): Promise<any> {
  const response = await axios.post(`${API_BASE}visit-request`, data)
  return response.data
}

export async function getVisitorsByResidentId(
  residentId: string,
): Promise<any> {
  const response = await axios.get(
    `${API_BASE}visitors?residentId=${residentId}`,
  )
  return response.data
}

export async function getVisitRequestsByResidentId(
  residentId: string,
): Promise<any> {
  const response = await axios.get(
    `${API_BASE}visit-requests?residentId=${residentId}`,
  )
  return response.data
}

export async function getVisitorByRegistrationId(
  registrationId: string,
): Promise<any> {
  const response = await axios.get(`${API_BASE}visitor/${registrationId}`)
  return response.data
}

export async function getInviteByToken(inviteToken: string): Promise<any> {
  const response = await axios.get(`${API_BASE}invite/${inviteToken}`)
  return response.data
}

export async function getVisitRequestByToken(
  inviteToken: string,
): Promise<any> {
  const response = await axios.get(`${API_BASE}visit-request/${inviteToken}`)
  return response.data
}
