import {
  VerifiedPermissionsClient,
  BatchIsAuthorizedCommand,
  BatchIsAuthorizedCommandOutput,
  BatchIsAuthorizedInput,
  BatchIsAuthorizedOutputItem,
} from '@aws-sdk/client-verifiedpermissions'

const region = process.env.AWS_REGION
const policyStoreId = process.env.POLICY_STORE_ID

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

  const command = new BatchIsAuthorizedCommand(batchIsAuthorizedInput)

  try {
    const batchIsAuthorizedCommandOutput: BatchIsAuthorizedCommandOutput =
      await verifiedPermissionsClient.send(command)

    return batchIsAuthorizedCommandOutput.results ?? []
  } catch (err: any) {
    console.error('Error checking batch authorization:', err)
    return []
  }
}
