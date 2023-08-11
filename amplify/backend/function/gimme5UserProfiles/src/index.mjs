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
    console.log('EVENT', event)

    const method = event.httpMethod
    const queryParams = event.queryStringParameters
    let response = {}
    const db = await client.db("gimme5");
    const collection = await db.collection("userProfiles");
  
    response.body = await collection.find().limit(20).toArray()

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
