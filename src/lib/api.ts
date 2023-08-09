
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