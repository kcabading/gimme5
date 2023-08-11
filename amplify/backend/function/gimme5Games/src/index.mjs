import { MongoClient, ServerApiVersion } from "mongodb";

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

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
export const handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    const method = event.httpMethod
    const queryParams = event.queryStringParameters
    let response = {}
    const db = await client.db("gimme5");
    const collection = await db.collection("games");
    
    console.log('COLLECTIONS', collection)
    
    switch(method){
        case 'GET':
            if (queryParams.hasOwnProperty('username')) {
                let query = {username: queryParams.username};
                let results = await collection.find(query).toArray()
                response.body = results
                console.log('RESULT', response.body)
            } else {
                response.body = await collection.find().limit(50).toArray()
            }
            break
        case 'POST':
            let newDocument = JSON.parse(event.body)
            newDocument.dateEntered = new Date()
            console.log('new document', event)
            response.body = await collection.insertOne(newDocument);
            break
        default:
            break;
    }
    
    return {
        statusCode: 200,
        //  Uncomment below to enable CORS requests
        headers: {
             "Access-Control-Allow-Origin": "*",
             "Access-Control-Allow-Headers": "*"
        },
        body: JSON.stringify(response.body),
    };
};
