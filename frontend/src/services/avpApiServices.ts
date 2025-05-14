import {
  VerifiedPermissionsClient,
  BatchIsAuthorizedCommand,
  BatchIsAuthorizedInput,
  BatchIsAuthorizedOutputItem,
} from '@aws-sdk/client-verifiedpermissions'

const region = process.env.AWS_REGION
console.log('region: ', region)

const policyStoreId = process.env.POLICY_STORE_ID
console.log('policyStoreId: ', policyStoreId)

const verifiedPermissionsClient = new VerifiedPermissionsClient({ region })

export async function authorizeBatch(
  principalId: string,
  actions: string[],
): Promise<BatchIsAuthorizedOutputItem[]> {
  if (!policyStoreId) {
    console.error('POLICY_STORE_ID environment variable not set!')
    return []
  }

  const batchIsAuthorizedInput: BatchIsAuthorizedInput = {
    policyStoreId,
    requests: actions.map((action) => ({
      principal: {
        entityId: principalId,
        entityType: 'VisitorManagement::UserGroup',
      },
      resource: {
        entityId: 'visitorResource',
        entityType: 'VisitorManagement::Visitor',
      },
      action: {
        actionId: action,
        actionType: 'VisitorManagement::Action',
      },
    })),
  }

  console.log('batchIsAuthorizedInput: ', batchIsAuthorizedInput)
  const command = new BatchIsAuthorizedCommand(batchIsAuthorizedInput)

  try {
    const batchIsAuthorizedCommandOutput =
      await verifiedPermissionsClient.send(command)

    const results = batchIsAuthorizedCommandOutput.results ?? []
    console.log('batchIsAuthorizedOutput: ', results)
    return results
  } catch (err: any) {
    console.error('Error checking batch authorization:', err)
    return []
  }
}
