import axios from 'axios'

const API_BASE = process.env.VUE_APP_API_ENDPOINT || ''

const defaultUserGroup = 'unassigned'

export async function evaluatePermissions(
  userGroup: string | undefined,
  actions: string[] | undefined,
): Promise<any> {
  const params = new URLSearchParams()

  params.append('principalId', userGroup ?? defaultUserGroup)

  if (actions && actions.length > 0) {
    params.append('actions', actions.join(','))
  }

  const queryString = params.toString()
  const url = queryString
    ? `${API_BASE}permissions?${queryString}`
    : `${API_BASE}permissions`

  const response = await axios.get(url)
  return response.data
}
