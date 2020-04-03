import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getSignedUrl } from '../../businessLogic/exercises'
import { parseUserId } from '../../auth/utils'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const exerciseId = event.pathParameters.exerciseId
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  const userId = parseUserId(jwtToken)

  // TODO: Return a presigned URL to upload a file for a Exercise item with the provided id
  
  const response = await getSignedUrl(exerciseId, userId)

  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({uploadUrl: response})
  }
  
}
