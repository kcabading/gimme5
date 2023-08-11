
import { API } from "aws-amplify";
import { CreateFormSchema } from "@/routes/questionsCreate";

const API_NAME = 'gimme5'

export async function getQuestion(category: string) {
	const item = await API.get(API_NAME, '/questions', {
        queryStringParameters: {
          category: category
        }
    });
    return item
}

export async function getQuestions() {
    const items = await API.get(API_NAME, '/questions', {
        queryStringParameters: {
          order: 'byPrice'
        }
    });
    return items
}

export async function saveGameResult(gameData: any) {
	console.log('SAVING TO API', gameData)
	const postBody = {
		body: gameData
	};

	const result =  await API.post(API_NAME, '/games', postBody);
	return result
}

export async function getGameResults(userName: string) {
	const items = await API.get(API_NAME, '/games', {
        queryStringParameters: {
          userName: userName
        }
    });
    return items
}


export async function getUserProfile(email: string) {

	const items = await API.get(API_NAME, '/users', {
        queryStringParameters: {
          email: email
        }
    });

    return items
}


export async function createQuestion(question: typeof CreateFormSchema) {
	console.log('creating question', question)

	const myInit = {
		body: question,
		headers: {} // OPTIONAL
	};

	const items = await API.post(API_NAME, '/questions', myInit);
	console.log('RESULT', items)
    return items

}