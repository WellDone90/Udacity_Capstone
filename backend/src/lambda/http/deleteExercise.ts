import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { deleteExercise } from '../../businessLogic/exercises'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const exerciseId = event.pathParameters.exerciseId

  // TODO: Remove a Exercise item by id
  const auth = event.headers.Authorization
  const auth_split = auth.split(' ')
  const jwtToken = auth_split[1]

  await deleteExercise(exerciseId, jwtToken);

  return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: '',
  };
}
