
import { API } from "aws-amplify";
import { CreateFormSchema } from "@/types/question";
import { queryClient } from "@/lib/query";
import { getCurrentUser, getGuestUsername } from "./utils";

const API_NAME = 'gimme5'

export async function deleteQuestion (questionId: string) {
	const queryStrings = {
		questionId
	};

	const item = await API.del(API_NAME, '/questions', {
        queryStringParameters: queryStrings,
		headers: { 'x-api-key': import.meta.env.VITE_APIG_KEY}
    });
    return item
}

type QuestionParams = {
	category?: string, 
	questionId? : string,
	play?: boolean,
}

export async function getQuestion(params: QuestionParams) {

	let currentUser = await getCurrentUser()
    let username = currentUser ? currentUser.username : getGuestUsername()

	const queryStrings: Record<string, any> = {
		username: username,
	}

	if (params.play) {
		queryStrings.play = params.play
	}

	if (params.category) {
		queryStrings.category = params.category
	}

	if (params.questionId) {
		queryStrings.questionId = params.questionId
	}

	const item = await API.get(API_NAME, '/questions', {
        queryStringParameters: queryStrings,
		headers: { 'x-api-key': import.meta.env.VITE_APIG_KEY}
    });
    return item
}

export async function getQuestions(userName? : string) {
	let params = {}

	if (userName) {
		params = {
			userName: userName
		}
	}

    const items = await API.get(API_NAME, '/questions', {
        queryStringParameters: params,
		headers: { 'x-api-key': import.meta.env.VITE_APIG_KEY}
    });

    return items.data
}

export async function saveGameResult(gameData: any) {
	const postBody = {
		body: gameData,
		headers: { 'x-api-key': import.meta.env.VITE_APIG_KEY}
	};

	const result =  await API.post(API_NAME, '/games', postBody);
	queryClient.invalidateQueries({ queryKey: ['gameResults'] })
	queryClient.invalidateQueries({ queryKey: ['questions', gameData.userName] })
	queryClient.invalidateQueries({ queryKey: ['leaderboard'] })
	return result
}

export async function getGameResults(userName: string) {
	const items = await API.get(API_NAME, '/games', {
        queryStringParameters: {
          userName: userName,
        },
		headers: { 'x-api-key': import.meta.env.VITE_APIG_KEY}
    });
    return items
}


export async function getUserProfile(email: string) {

	const items = await API.get(API_NAME, '/users', {
        queryStringParameters: {
          email
        },
		headers: { 'x-api-key': import.meta.env.VITE_APIG_KEY}
    });

    return items
}

export async function getLeaderboardData() {
	const items = await API.get(API_NAME, '/leaderboard', {
        queryStringParameters: {
			dataBy: 'userPoints'
        },
		headers: { 'x-api-key': import.meta.env.VITE_APIG_KEY}
    });

	return items
}


export async function createQuestion(question: typeof CreateFormSchema) {
	const myInit = {
		body: question,
		headers: { 'x-api-key': import.meta.env.VITE_APIG_KEY}
	};

	const items = await API.post(API_NAME, '/questions', myInit);
    return items

}