import { getQuestions } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

type Question = {
    _id: string,
    question: string,
    category: string,
    answers: string[]
}

const questionListQuery = () => ({
    queryKey: ['questions'],
    queryFn: async () => getQuestions()
})

const Questions = () => {
    const { data: questions, isLoading } = useQuery<Question[]>(questionListQuery())
    console.log('questions', questions)
    console.log('IS LOADING', isLoading)
    return (
        <div>
            {
                isLoading 
                ? <>Loading...</>
                : <ul>
                {
                    questions?.length && questions.map( (question, index) => {
                        return <li key={index}>{question.question}</li>
                    })
                }
                </ul>
            }
            <Link to={'/questions/create'}>Create New</Link>
        </div>
    )
}

export default Questions