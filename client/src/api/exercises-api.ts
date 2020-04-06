import { apiEndpoint } from '../config'
import { Exercise } from '../types/Exercise';
import { CreateExerciseRequest } from '../types/CreateExerciseRequest';
import Axios from 'axios'
import { UpdateExerciseRequest } from '../types/UpdateExerciseRequest';

export async function getExercises(idToken: string): Promise<Exercise[]> {
  console.log('Fetching exercises')

  const response = await Axios.get(`${apiEndpoint}/exercises`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Exercises:', response.data)
  return response.data.items
}

export async function createExercise(
  idToken: string,
  newExercise: CreateExerciseRequest
): Promise<Exercise> {
  const response = await Axios.post(`${apiEndpoint}/exercises`,  JSON.stringify(newExercise), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchExercise(
  idToken: string,
  exerciseId: string,
  updatedExercise: UpdateExerciseRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/exercises/${exerciseId}`, JSON.stringify(updatedExercise), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteExercise(
  idToken: string,
  exerciseId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/exercises/${exerciseId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  exerciseId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/exercises/${exerciseId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
