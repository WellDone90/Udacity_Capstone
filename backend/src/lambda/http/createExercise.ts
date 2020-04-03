import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateExerciseRequest } from '../../requests/CreateExerciseRequest'
import { createExercise } from '../../businessLogic/exercises'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newExercise: CreateExerciseRequest = JSON.parse(event.body)

  // TODO: Implement creating a new Exercise item
  const auth = event.headers.Authorization
  const auth_split = auth.split(' ')
  const jwtToken = auth_split[1]
  const newItem = await createExercise(newExercise, jwtToken)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: newItem
    })
  }
}
