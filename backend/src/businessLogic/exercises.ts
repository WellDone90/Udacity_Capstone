import * as uuid from 'uuid'
import { ExerciseItem } from '../models/ExerciseItem'
import { ExerciseAccess } from '../dataLayer/exerciseAccess'
import { CreateExerciseRequest } from '../requests/CreateExerciseRequest'
import { parseUserId } from '../auth/utils'
import { UpdateExerciseRequest } from '../requests/UpdateExerciseRequest'

const exerciseAccess = new ExerciseAccess()

export async function getAllExercises(): Promise<ExerciseItem[]> {
  return exerciseAccess.getAllExercises()
}

export async function getAllExercisesForUser(jwtToken: string): Promise<ExerciseItem[]> {
    return await exerciseAccess.getAllExercisesForUser(parseUserId(jwtToken))
  }

export async function createExercise(createExerciseRequest: CreateExerciseRequest, jwtToken: string): Promise<ExerciseItem> {

  const exerciseId = uuid.v4()
  const userId = parseUserId(jwtToken)

  return await exerciseAccess.createExercise({
    userId: userId,
    exerciseId: exerciseId,
    createdAt: new Date().toISOString(),
    name: createExerciseRequest.name,
    distance: createExerciseRequest.distance,
    time: createExerciseRequest.time,
    speed: createExerciseRequest.speed
  })
}

export async function getSignedUrl(exerciseId: string, userId: string){
  //generating the url
  const attachmentUrl = await exerciseAccess.generateSignedUrl(exerciseId)
  
  //updating the attachment URL for the Exercise item
  await exerciseAccess.updateAttachementUrl(exerciseId, userId)
  
  return attachmentUrl
}

export async function deleteExercise(exerciseId: string, jwtToken: string) {
 
  const userId = parseUserId(jwtToken)  

  await exerciseAccess.deleteExercise(userId, exerciseId)
}

export async function updatedExercise(exerciseId: string, updateExercise: UpdateExerciseRequest, jwtToken: string) {
  const userId = parseUserId(jwtToken)  
  return await exerciseAccess.updateExercise(userId, exerciseId, updateExercise)
}