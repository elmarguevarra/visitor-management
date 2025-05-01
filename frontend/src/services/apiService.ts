import axios from 'axios'

const API_BASE = process.env.VUE_APP_API_ENDPOINT || ''

export interface CreateVisitorRequest {
  residentId: string
  residentName: string
  residentContact: string
  visitorName: string
  visitDate: string
  arrivalTime?: string | null
  departureTime?: string | null
  hasArrived: boolean
  hasDeparted: boolean
}

export interface CreatedVisitorResponse {
  visitorName: string
  registrationId: string
  visitDate: string
  qrCodeDataURL: string
}

export async function createVisitor(
  data: CreateVisitorRequest,
): Promise<CreatedVisitorResponse> {
  const response = await axios.post(`${API_BASE}visitor`, data)
  return response.data
}
