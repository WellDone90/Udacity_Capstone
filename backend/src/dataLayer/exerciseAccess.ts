import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import * as AWS  from 'aws-sdk'

import { ExerciseUpdate } from '../models/ExerciseUpdate'
import {ExerciseItem} from '../models/ExerciseItem'

export class ExerciseAccess{

    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly exerciseTable = process.env.EXERCISES_TABLE,
        private readonly s3 = new AWS.S3({ signatureVersion: 'v4'}),
        private readonly bucketName = process.env.S3_BUCKET
        ){
    }

    async getAllExercises(): Promise<ExerciseItem[]> {
    
        const result = await this.docClient.scan({
          TableName: this.exerciseTable
        }).promise()
    
        const items = result.Items
        return items as ExerciseItem[]
    }

    async getAllExercisesForUser(userId: string): Promise<ExerciseItem[]> {
    
        const result = await this.docClient.query({
          TableName: this.exerciseTable,
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues:{
              ':userId': userId
          }
        }).promise()
  
        const items = result.Items
        return items as ExerciseItem[]
    }
    
    async createExercise(exerciseItem: ExerciseItem): Promise<ExerciseItem> {
        await this.docClient.put({
        TableName: this.exerciseTable,
        Item: exerciseItem
        }).promise()
    
        return exerciseItem
    }

    async generateSignedUrl(exerciseId: string){

        return this.s3.getSignedUrl('putObject', {
          Bucket: this.bucketName,
          Key: exerciseId,
          Expires: 300
        })
    
      }

    async deleteExercise(userId: string, exerciseId: string) {

        await this.docClient
            .delete({
                TableName: this.exerciseTable,
                Key: {
                    "userId" : userId,
                    "exerciseId" : exerciseId
                },
            }).promise();

        console.log("Deleted exercise " + exerciseId)
    }

    async updateAttachementUrl(exerciseId: string, userId: string){

        const url = `https://${this.bucketName}.s3.amazonaws.com/${exerciseId}`
    
        var params = {
            TableName: this.exerciseTable,
            Key:{
                "userId": userId,
                "exerciseId": exerciseId
            },
            UpdateExpression: "set attachmentUrl = :au",
            ExpressionAttributeValues: {
                    ":au" : url,
            },
            ReturnValues:"UPDATED_NEW"
        }
        
        await this.docClient.update(params, function(err, data) {
            if (err) {
                console.error("Unable to update item with the attachment. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
            }
        }).promise()
        
      }

    async updateExercise(userId: string, exerciseId: string, exerciseUpdate: ExerciseUpdate) {
        var params = {
            TableName: this.exerciseTable,
            Key: {
                "userId" : userId,
                "exerciseId" : exerciseId,
            },
            UpdateExpression: 'set #name = :name, #distance = :distance, #time = :time, #speed = :speed',
            ExpressionAttributeValues: {
              ":name": exerciseUpdate.name,
              ":distance" : exerciseUpdate.distance,
              ":time" : exerciseUpdate.time,
              ":speed" : exerciseUpdate.speed
            },
            ExpressionAttributeNames: {
              "#name": 'name',
              "#distance": 'distance',
              "#time": 'time',
              "#speed": 'speed'
            },
            ReturnValues:"UPDATED_NEW"
          }
          
          
        await this.docClient.update(params, function(err, data) {
            if (err) console.log(err);
            else console.log(data);
        }).promise()

    }
}

function createDynamoDBClient(){
    if(process.env.IS_OFFLINE){
        console.log("Creating a local DynamoDB instance")
        return new AWS.DynamoDB.DocumentClient({
            region: 'localhost',
            endpoint: 'http://localhost:8000'
        })
    }

    return new AWS.DynamoDB.DocumentClient()
}

