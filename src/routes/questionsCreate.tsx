
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { queryClient } from "@/lib/query"
import { createQuestion } from "@/lib/api";

import { Button } from "@/components/ui/button"
import { Apple, ArrowLeft, Cat, Loader, MapPin, PersonStanding, Shirt } from 'lucide-react';

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
import { useAuthenticator } from "@aws-amplify/ui-react";
import { Link } from "react-router-dom";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreateFormSchema } from "@/types/question";



export default function questionsCreate() {
	const { user } = useAuthenticator((context) => [context.user])
	const { toast } = useToast()

	const form = useForm<z.infer<typeof CreateFormSchema>>({
		resolver: zodResolver(CreateFormSchema),
		defaultValues: {
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
		console.log('saving')
		console.log(values)
		// submit
		mutation.mutate({...values, submittedBy: user.username})
	}

	return (
		<>
			<Link to={'/questions'}><Button variant={'secondary'} className="mb-5"><ArrowLeft />&nbsp;Go Back to your Questions</Button></Link>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 sm:w-1/2 w-full sm:p-0 mb-10">
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
						name="language"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Language</FormLabel>
								<FormControl>
									<RadioGroup {...field} onValueChange={field.onChange} disabled={mutation.isLoading}>
										<div className="flex space-x-2">
											<div className="flex items-center space-x-2">
												<RadioGroupItem value="English" id="r1" />
												<Label htmlFor="r1">English</Label>
											</div>
											<div className="flex items-center space-x-2">
												<RadioGroupItem value="Tagalog" id="r2" />
												<Label htmlFor="r2">Tagalog</Label>
											</div>
											<div className="flex items-center space-x-2">
												<RadioGroupItem value="E.A.T" id="r2" />
												<Label htmlFor="r2">English or Tagalog</Label>
											</div>
										</div>
									</RadioGroup>
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
								<Select  name={field.name} value={field.value} onValueChange={field.onChange} disabled={mutation.isLoading}>
									<FormControl>
									<SelectTrigger className="bg-white dark:bg-black">
										<SelectValue placeholder="Select a Category" />
									</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="Tao"><PersonStanding className="inline"/>&nbsp;Tao</SelectItem>
										<SelectItem value="Bagay"><Shirt className="inline"/>&nbsp;Bagay</SelectItem>
										<SelectItem value="Hayop"><Cat className="inline"/>&nbsp;Hayop</SelectItem>
										<SelectItem value="Pagkain"><Apple className="inline"/>&nbsp;Pagkain</SelectItem>
										<SelectItem value="Lugar"><MapPin className="inline"/>&nbsp;Lugar</SelectItem>
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
								<FormLabel>Enter 5 possible answers</FormLabel>
								<FormControl>
									<Textarea
									placeholder="Enter 5 possible answers"
									className="resize-none bg-white dark:bg-black"
									{...field}
									disabled={mutation.isLoading}
									/>
								</FormControl>
								<FormDescription className="dark:text-white">
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
