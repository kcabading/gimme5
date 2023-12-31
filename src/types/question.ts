import { z } from "zod"

export const LanguageTypes = ['English', 'Tagalog', 'English or Tagalog'] as const
export const LanguageTypeSchema = z.enum(LanguageTypes)
export const CategoryTypes = ['Tao', 'Bagay', 'Hayop', 'Lugar', 'Pagkain'] as const
export const CategoryTypeSchema = z.enum(CategoryTypes)


export const CreateFormSchema = z.object({
    _id: z.string().optional(),
	question: z.string().min(10, {
		message: "Question must be at least 10 characters.",
	}),
	language: LanguageTypeSchema,
	category: CategoryTypeSchema,
	answers: z.string().refine( (inputAnswers) => {
		let allAnswers = [...new Set(inputAnswers.split('\n').filter(answer => answer !== '')) ]
		console.log('ALL ANSWERS', allAnswers)
		return allAnswers.length === 5
	}, {
		message: "The possible answers should be at least 5 and each answer must be unique",
	})
})

export type TQuestion = {
    _id: string,
    question: string,
    category: string,
    language: string,
    answers: string[],
    noOfTimesUsed: number,
    noOfTimesCompleted: number,
    bestTimeInt: number
}

export type QuestionParams = {
	category?: string, 
	questionId? : string,
	play?: boolean,
}