import { useAuthenticationStore } from '@/stores/authenticationStore'
import axios from 'axios'

const API_BASE = process.env.VUE_APP_API_ENDPOINT || ''

const defaultUserGroup = 'unassigned'

export async function evaluatePermissions(
  userGroup: string | undefined,
  actions: string[] | undefined,
): Promise<any> {
  const authenticationStore = useAuthenticationStore()
  const token = authenticationStore.user?.access_token

  const params = new URLSearchParams()
  params.append('principalId', userGroup ?? defaultUserGroup)

  if (actions && actions.length > 0) {
    params.append('actions', actions.join(','))
  }

  const queryString = params.toString()
  const url = queryString
    ? `${API_BASE}permissions?${queryString}`
    : `${API_BASE}permissions`

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}
