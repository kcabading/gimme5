
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { queryClient } from "@/lib/query"
import { createQuestion } from "@/lib/api";

import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react';

import { useMutation } from "@tanstack/react-query"
import { useToast } from "@/components/ui/use-toast";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { Link } from "react-router-dom";
import { CreateFormSchema } from "@/types/question";
import CreateQuestion from "@/components/form/CreateQuestion";



export default function questionsCreate() {
	const { user } = useAuthenticator((context) => [context.user])
	const { toast } = useToast()

	const form = useForm<z.infer<typeof CreateFormSchema>>({
		resolver: zodResolver(CreateFormSchema),
		defaultValues: {
			_id: '',
			question: "Magbigay ng 5 ...",
			language: "English",
			category: "Tao",
			answers: ""
		},
	})

	const mutation = useMutation({
		mutationFn: (payload: any) => createQuestion(payload),
		onSuccess: () => {
			toast({
				title: "Thank you",
				description: "Successfully submitted the Question",
				duration: 5000
			})
			// ✅ refetch our questions
			queryClient.invalidateQueries({ queryKey: ['questions', user.username] })
			console.log('invalidating question queries')
			form.reset()
		},
	})

	function onSubmit(values: z.infer<typeof CreateFormSchema>) {
		// submit
		mutation.mutate({...values, submittedBy: user.username})
	}

	return (
		<>
			<Link to={'/questions'}><Button variant={'secondary'} className="mb-5"><ArrowLeft />&nbsp;Go Back to your Questions</Button></Link>
			<CreateQuestion form={form} onSubmit={onSubmit} isLoading={mutation.isLoading}/>

		</>	
	)
	

}
