
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { queryClient } from "@/lib/query"
import { createQuestion, getQuestion } from "@/lib/api";

import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react';

import { useMutation, useQuery } from "@tanstack/react-query"
import { useToast } from "@/components/ui/use-toast";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { Link, useParams } from "react-router-dom";
import { CreateFormSchema } from "@/types/question";
import CreateQuestion from "@/components/form/CreateQuestion";

import { LanguageTypeSchema, CategoryTypeSchema } from "@/types/question";
import { Skeleton } from "@/components/ui/skeleton";

export default function questionsEdit() {

    let { id } = useParams();
    
    const { data: question, isLoading } = useQuery({
        queryKey: ['questions', id],
        queryFn: async () => getQuestion({questionId: id})
    })

	const { user } = useAuthenticator((context) => [context.user])
	const { toast } = useToast()

	const form = useForm<z.infer<typeof CreateFormSchema>>({
		resolver: zodResolver(CreateFormSchema),
        values: {
			question: question ? question?.data.question : '',
			language: question ? question?.data.language : LanguageTypeSchema.enum.English,
			category: question ? question?.data.category : CategoryTypeSchema.enum.Tao,
			answers: question ? question.data.answers.join('\n') : '',
        }
	})

	const mutation = useMutation({
		mutationFn: (payload: any) => createQuestion(payload),
		onSuccess: () => {
			toast({
				title: "Thank you",
				description: "Successfully updated the Question",
				duration: 5000
			})
			// ✅ refetch our questions
			queryClient.invalidateQueries({ queryKey: ['questions'] })
			form.reset()
		},
	})

	function onSubmit(values: z.infer<typeof CreateFormSchema>) {
		// submit
		mutation.mutate({...values, submittedBy: user.username, _id: id})
	}

	return (
		<>
			<Link to={'/questions'}><Button variant={'secondary'} className="mb-5"><ArrowLeft />&nbsp;Go Back to your Questions</Button></Link>
            {
                isLoading 
                ? 
                <div className="space-y-4">
                    <Skeleton className="max-sm:w-[100px] w-[200px] h-[10px] rounded-md" />
                    <Skeleton className="max-sm:w-full w-[500px] h-[30px] rounded-md" />
                    <Skeleton className="max-sm:w-[100px] w-[200px] h-[10px] rounded-md" />
                    <Skeleton className="max-sm:w-full w-[500px] h-[30px] rounded-md" />
                    <Skeleton className="max-sm:w-[100px] w-[200px] h-[10px] rounded-md" />
                    <Skeleton className="max-sm:w-full w-[500px] h-[30px] rounded-md" />
                    <Skeleton className="max-sm:w-[100px] w-[200px] h-[10px] rounded-md" />
                    <Skeleton className="max-sm:w-full w-[500px] h-[100px] rounded-md" />
                    <Skeleton className="max-sm:w-[200px] w-[300px] h-[10px] rounded-md" />
                    <Skeleton className="w-[100px] h-[30px] rounded-md" />
                </div>
                : <CreateQuestion form={form} onSubmit={onSubmit} isLoading={mutation.isLoading}/>
            }
		</>	
	)	

}
