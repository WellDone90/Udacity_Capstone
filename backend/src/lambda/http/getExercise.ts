import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import {getAllExercisesForUser} from '../../businessLogic/exercises'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all Exercise items for a current user
  const auth = event.headers.Authorization
  const auth_split = auth.split(' ')
  const jwtToken = auth_split[1]

  const exercises = await getAllExercisesForUser(jwtToken)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      items: exercises
    })
  }
}
