import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";

import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

import Redis from "ioredis"

const redisClient = new Redis(process.env.REDIS_CON_STRING);

async function getDBConnectionString() {
    const ssmClient = new SSMClient({ region: process.env.REGION });
    const input = { // GetParametersRequest
        Name: process.env.DBCON_PATH,
        WithDecryption: true,
    };
    const command = new GetParameterCommand(input);
    try {
        const data = await ssmClient.send(command);
        return data['Parameter']['Value']
        // process data.
    } catch (error) {
        // error handling.
        console.log('SSM CLIENT ERROR', error)
    }   
}

const dbConnectionString = await getDBConnectionString()
const client = new MongoClient(dbConnectionString);

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
export const handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    const method = event.httpMethod
    const queryParams = event.queryStringParameters
    
    let statusCode = 0
    let responseBody = {}
    const db = await client.db("gimme5");
    const collection = await db.collection("games");
    const questionCollections = await db.collection("questions");
    
    try {
    
        switch(method){
            case 'GET':
                if (queryParams.hasOwnProperty('userName')) {
                    let query = {userName: queryParams.userName};
                    let results = await collection.find(query).sort({ "_id": -1 }).toArray()
                    responseBody = results
                    statusCode = 200                
                } else {
                    responseBody = await collection.find().sort({ "_id": -1 }).toArray()
                }
                break
            case 'POST':
                let newDocument = JSON.parse(event.body)
                newDocument.dateEntered = new Date()
                responseBody = await collection.insertOne(newDocument);
                
                if (responseBody.acknowledged === true) {
                    // update redis
                    const result = await redisClient.zincrby(
                        "leaderboardsByUserPoints",
                        newDocument.points ,newDocument.userName
                    )
                    
                    const filter = { _id: new ObjectId(newDocument.questionId) };
                    const update = { 
                        $inc: {
                            noOfTimesUsed: 1,
                            noOfTimesCompleted: newDocument.points === 5 ? 1: 0
                        },
                        $min: { 
                            bestTimeInt: newDocument.completionTimeInt
                        },
                        // $set: {
                            // score: 
                            
                            // {
                            //     '$cond': [ true, 'true', 'false' ]
                            // }
                            // bestTime: {
                            //     $cond: {
                            //       if: { $gt: ['$bestTimeInt', 1] }, // Condition: If score < 80
                            //       then: 1,                     // Set score to 80
                            //       else: 0 // Increment score by 10
                            //     }
                            // }
                            // {
                            //     $cond: { 
                            //         if: {
                            //             $gt: [ "$bestTimeInt", newDocument.completionTimeInt ]
                            //         }, 
                            //         then: newDocument.completionTime, 
                            //         else: '$bestTime'
                            //     }
                            // }
                        // }
                    }
                    // `doc` is the document _before_ `update` was applied
                    let doc = await questionCollections.updateOne(filter, update);
                }
                statusCode = 200
                break
            default:
                break;
        }
    } catch (err) {
        console.log(err)
        console.log('DB ERROR', err.message)
        statusCode = 200
        responseBody['error'] = 'A server error has occured. Please contact Administrator to report the issue'
    }

    return {
        statusCode: statusCode,
        //  Uncomment below to enable CORS requests
        headers: {
             "Access-Control-Allow-Origin": "*",
             "Access-Control-Allow-Headers": "*"
        },
        body: JSON.stringify(responseBody),
    };
};
