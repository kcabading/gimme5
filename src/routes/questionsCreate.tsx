
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { queryClient } from "@/lib/query"
import { createQuestion } from "@/lib/api";

import { Button } from "@/components/ui/button"
import { FaSpinner } from "react-icons/fa"
import { Loader } from 'lucide-react';


import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
  } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
// import { redirect } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { useToast } from "@/components/ui/use-toast";

export const CreateFormSchema = z.object({
	question: z.string().min(10, {
		message: "Question must be at least 10 characters.",
	}),
	category: z.string({
      required_error: "Please select a category",
    }),
	answers: z.string().refine( (inputAnswers) => {
		let allAnswers = [...new Set(inputAnswers.split('\n').filter(answer => answer !== '')) ]
		return allAnswers.length === 5
	}, {
		message: "The possible answers should be at least 5 and each answer must be unique",
	})
})

export default function questionsCreate() {
	const { toast } = useToast()
	const mutation = useMutation({
		mutationFn: (payload: any) => createQuestion(payload),
		onSuccess: () => {
			toast({
				title: "Thank you",
				description: "Successfully added new Question",
				duration: 5000
			})
			// ✅ refetch our questions
			queryClient.invalidateQueries({ queryKey: ['questions', 'gameResults'] })
			console.log('invalidating question queries')
		},
	})

	const form = useForm<z.infer<typeof CreateFormSchema>>({
		resolver: zodResolver(CreateFormSchema),
		defaultValues: {
			question: "Magbigay ng 5 ...",
			category: "",
			answers: ""
		},
	})

	function onSubmit(values: z.infer<typeof CreateFormSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		console.log(values)
		// submit
		mutation.mutate(values)
	}

	return (
		<>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 sm:w-1/2 w-full sm:p-0 px-5">
					<FormField
						control={form.control}
						name="question"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Enter a Gimme5 Question</FormLabel>
								<FormControl>
									<Input placeholder="question" {...field} disabled={mutation.isLoading}/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="category"
						render={({ field }) => (
							<FormItem>
							<FormLabel>Select a Category</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value} disabled={mutation.isLoading}>
								<FormControl>
								<SelectTrigger>
									<SelectValue placeholder="Select a Category" />
								</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="Tao">Tao</SelectItem>
									<SelectItem value="Bagay">Bagay</SelectItem>
									<SelectItem value="Hayop">Hayop</SelectItem>
									<SelectItem value="Lugar">Lugar</SelectItem>
									<SelectItem value="Pagkain">Pagkain</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="answers"
						render={({ field }) => (
							<FormItem>
							<FormLabel>Enter a 5 possible answers</FormLabel>
							<FormControl>
								<Textarea
								placeholder="Enter a 5 possible answers"
								className="resize-none"
								{...field}
								disabled={mutation.isLoading}
								/>
							</FormControl>
							<FormDescription>
								Separate answers by new line(press enter after every answer) in the text area
							</FormDescription>
							<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit">
						<Loader className={`${!mutation.isLoading && 'hidden'} animate-spin mr-2`} />Submit
					</Button>
				</form>
			</Form>
		</>	
	)
	

}