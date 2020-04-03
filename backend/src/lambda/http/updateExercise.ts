import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateExerciseRequest } from '../../requests/UpdateExerciseRequest'
import { updatedExercise } from '../../businessLogic/exercises'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const exerciseId = event.pathParameters.exerciseId
  const updateExercise: UpdateExerciseRequest = JSON.parse(event.body)

  // TODO: Update a Exercise item with the provided id using values in the "updatedExercise" object
  const auth = event.headers.Authorization
  const auth_split = auth.split(' ')
  const jwtToken = auth_split[1]


  await updatedExercise(exerciseId, updateExercise, jwtToken)

  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(updatedExercise)
  }
}
