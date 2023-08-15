
import { API } from "aws-amplify";
import { CreateFormSchema } from "@/routes/questionsCreate";

const API_NAME = 'gimme5'


export async function deleteQuestion (questionId: string) {
	console.log('deleting question')

	const queryStrings = {
		questionId: questionId
	};

	const item = await API.del(API_NAME, '/questions', {
        queryStringParameters: queryStrings
    });
	console.log('deleted', item)
    return item
}

export async function getQuestion(category: string, questionId? : string) {

	const queryStrings: Record<string, any> = {
		play: true,
		category
	}

	if (questionId) {
		queryStrings.questionId = questionId
	}
	console.log('query params', queryStrings)

	const item = await API.get(API_NAME, '/questions', {
        queryStringParameters: queryStrings
    });
    return item
}

export async function getQuestions(userName? : string) {

	console.log('API get questions', userName)
	let params = {}

	if (userName) {
		params = {
			userName: userName
		}
	}

    const items = await API.get(API_NAME, '/questions', {
        queryStringParameters: params
    });

    return items.data
}

export async function saveGameResult(gameData: any) {
	console.log('SAVING TO API', gameData)
	const postBody = {
		body: gameData
	};

	const result =  await API.post(API_NAME, '/games', postBody);
	// queryClient.invalidateQueries({ queryKey: ['gameResults'] })
	// queryClient.invalidateQueries({ queryKey: ['questions', gameData.userName] })
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