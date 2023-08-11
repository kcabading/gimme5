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



/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	AUTH_GIMME50FE016AA_USERPOOLID
	DBCON_PATH
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
export const handler = async (event) => {
    console.log('EVENT', event)
  
  if (event.triggerSource === 'PostConfirmation_ConfirmSignUp') {
     
    let userEmail = event.request.userAttributes.email
    let userStatus = event.request.userAttributes['cognito:user_status']
    if (userStatus === 'CONFIRMED' || userStatus === 'EXTERNAL_PROVIDER') {
        // insert user to db
        const db = await client.db("gimme5")
        const collection = await db.collection("userProfiles")
        
        let newUserDocument = {
            email: userEmail,
            isOnline: false,
            rank: 0,
            NoOfgamesPlayed: 0,
            friends: [],
            dateEntered: new Date()
        }
        console.log('new document', event)
        let result = await collection.insertOne(newUserDocument);
        console.log(result)
    }
  }
  return event;
};
