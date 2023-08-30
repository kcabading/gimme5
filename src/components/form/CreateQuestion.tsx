
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Apple, Cat, Loader, MapPin, PersonStanding, Shirt } from 'lucide-react';

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

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreateFormSchema } from "@/types/question";

type CreateQuestionProps = {
    form: any,
    isLoading: boolean,
    onSubmit: (values: z.infer<typeof CreateFormSchema>) => void
}


export default function CreateQuestion({ form, isLoading, onSubmit }: CreateQuestionProps) {
	return (
		<>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 sm:w-1/2 w-full sm:p-0 mb-10">
					<FormField
						control={form.control}
						name="question"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Enter a Gimme5 Question</FormLabel>
								<FormControl>
									<Input placeholder="question" {...field} disabled={isLoading}/>
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
									<RadioGroup {...field} onValueChange={field.onChange} disabled={isLoading}>
										<div className="flex space-x-2 max-sm:justify-between">
											<div className="flex items-center space-x-2">
												<RadioGroupItem value="English" id="r1"/>
												<Label htmlFor="r1">English</Label>
											</div>
											<div className="flex items-center space-x-2">
												<RadioGroupItem value="Tagalog" id="r2" />
												<Label htmlFor="r2">Tagalog</Label>
											</div>
											<div className="flex items-center space-x-2">
												<RadioGroupItem value="English or Tagalog" id="r3" />
												<Label htmlFor="r3">English or Tagalog</Label>
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
								<Select  name={field.name} value={field.value} onValueChange={field.onChange} disabled={isLoading}>
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
									disabled={isLoading}
                                    rows={5}
									/>
								</FormControl>
								<FormDescription className="dark:text-white">
									Separate answers by new line(press enter after every answer) in the text area
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit" disabled={isLoading}>
						<Loader className={`${!isLoading && 'hidden'} animate-spin mr-2`} />Submit
					</Button>
				</form>
			</Form>
		</>	
	)
	

}
