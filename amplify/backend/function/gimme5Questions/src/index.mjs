import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";

import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

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

const db = await client.db("gimme5");
const collection = await db.collection("questions");
const gamesCollection = await db.collection("games");

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
export const handler = async (event) => {
    
    let statusCode = 0
    let responseBody = {}
    
    console.log(`EVENT: ${JSON.stringify(event)}`);
    const method = event.httpMethod
    const queryParams = event.queryStringParameters
    
    try {
        
        switch(method){
            case 'GET':
                let username = queryParams.username
                if (queryParams.hasOwnProperty('questionId')) {
                    // check if question is already answered
                    let gameQuery = {questionId: queryParams.questionId, userName: username};
                    let gameResults = await gamesCollection.find(gameQuery).toArray()
                    if (gameResults.length > 0) {
                        statusCode = 200
                        responseBody['error'] = 'Question already answered!'
                    } else {
                        let query = {_id: new ObjectId(queryParams.questionId)};
                        let results = await collection.find(query).toArray()
                        statusCode = 200
                        responseBody['data'] = results[0]
                    }
                } else if (queryParams.hasOwnProperty('category')) {
                    let query = {category: queryParams.category};
                    let questionResults = await collection.find(query).toArray()
                    
                    if (questionResults.length === 0) {
                        responseBody['error'] = 'No Question found on the Category: ' + queryParams.category
                    } else {
                        
                        let gameQuery = {userName: username};
                        let gameResults = await gamesCollection.find(gameQuery).toArray()
                        let questionFound = false
                        // loop through questions
                        for (let index = 0; index < questionResults.length; index++) {
                            let curQuestion = questionResults[index];
                            if (gameResults.length === 0) {
                                questionFound = true
                                responseBody['data'] = curQuestion
                                break
                            }
                            // find cur question in the game results
                            let gameIndex = gameResults.findIndex( (game) => game.questionId === curQuestion._id.toString())
                            if (gameIndex === -1) {
                                questionFound = true
                                responseBody['data'] = curQuestion
                                break
                            }
                        }
                        
                        if (!questionFound) {
                            // if we get here, all questions are answered by the user
                            responseBody['error'] = 'You have answered all questions on this category: ' + queryParams.category
                            console.log('QUESTION', responseBody['data'])   
                        }
                    }
                    statusCode = 200
                } else if (queryParams.hasOwnProperty('userName')) {
                    let query = {submittedBy: queryParams.userName};
                    let results = await collection.find(query).toArray()
                    statusCode = 200
                    responseBody['data'] = results
                    
                } else {
                    statusCode = 200
                    responseBody['data'] = await collection.find().limit(20).toArray()   
                }
                break
            case 'POST':
                let newDocument = JSON.parse(event.body)
                newDocument.answers = newDocument.answers.split('\n').filter(answer => answer !== '')
                newDocument.date = new Date()
                console.log('new document', event)
                statusCode = 201
                responseBody['data'] = await collection.insertOne(newDocument);
                break
            case 'DELETE':
                if (queryParams.hasOwnProperty('questionId')) {
                    let query = {_id: new ObjectId(queryParams.questionId)};
                    responseBody['data'] = await collection.deleteOne(query)
                    statusCode = 200
                }
                break
            default:
                break;
        }
        
    
    } catch (err) {
        console.log(err)
        console.log('DB ERROR', err.message)
        
        return {
            statusCode: 200,
            //  Uncomment below to enable CORS requests
            headers: {
                 "Access-Control-Allow-Origin": "*",
                 "Access-Control-Allow-Headers": "*"
            },
            body: JSON.stringify({
                error: 'A server error has occured. Please contact Administrator to report the issue '
            }),
        };
    }
    
    return {
        statusCode,
        headers: {
             "Access-Control-Allow-Origin": "*",
             "Access-Control-Allow-Headers": "*"
        },
        body: JSON.stringify(responseBody),
    };
};
