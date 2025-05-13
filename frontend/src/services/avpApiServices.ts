import {
  VerifiedPermissionsClient,
  BatchIsAuthorizedCommand,
  BatchIsAuthorizedCommandOutput,
  BatchIsAuthorizedInput,
} from '@aws-sdk/client-verifiedpermissions'

import { EntityIdentifier, Decision } from 'aws-sdk/clients/verifiedpermissions'

const region = process.env.AWS_REGION
const policyStoreId = process.env.POLICY_STORE_ID

const verifiedPermissionsClient = new VerifiedPermissionsClient({ region })

interface BatchIsAuthorizedResult {
  decision: Decision
}

export async function authorizeBatch(
  principalId: string,
  actions: string[],
): Promise<BatchIsAuthorizedResult[]> {
  if (!policyStoreId) {
    console.error('POLICY_STORE_ID environment variable not set!')
    return []
  }

  const principalIdentifier: EntityIdentifier = {
    entityType: 'VisitorManagement::UserGroup',
    entityId: principalId,
  }

  const resourceIdentifier: EntityIdentifier = {
    entityType: 'VisitorManagement::Visitor',
    entityId: 'visitorResource',
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

    return (
      batchIsAuthorizedCommandOutput.results?.map((result) => ({
        decision: result.decision as Decision,
      })) ?? []
    )
  } catch (err: any) {
    console.error('Error checking batch authorization:', err)
    return []
  }
}
