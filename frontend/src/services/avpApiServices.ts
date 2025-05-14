import {
  VerifiedPermissionsClient,
  BatchIsAuthorizedCommand,
  BatchIsAuthorizedInput,
  BatchIsAuthorizedOutput,
} from '@aws-sdk/client-verifiedpermissions'

const policyStoreId = process.env.VUE_APP_POLICY_STORE_ID
console.log('policyStoreId: ', policyStoreId)

const verifiedPermissionsClient = new VerifiedPermissionsClient()

export async function authorizeBatch(
  principalId: string,
  actions: string[],
): Promise<BatchIsAuthorizedOutput> {
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
    const batchIsAuthorizedOutput =
      await verifiedPermissionsClient.send(command)
    console.log('batchIsAuthorizedOutput: ', batchIsAuthorizedOutput)

    return batchIsAuthorizedOutput
  } catch (err: any) {
    console.error('Error checking batch authorization:', err)
    throw new Error('Failed to evaluate access')
  }
}
