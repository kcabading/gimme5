import { useBoundStore } from "@/store"
import { Button } from "../ui/button"
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
  } from "@/components/ui/table"
import {Fragment} from "react"
  

const Results = () => {

	const resetGameState = useBoundStore((state) => state.resetPlay)

	const guesses = useBoundStore((state) => state.guesses)
	const answers = useBoundStore((state) => state.answers)
	console.log(guesses)
	
	return (
		<>
			<div className="gimme5-result text-center w-full">
				<p className="font-bold text-2xl sm:text-4xl">Game Results</p>
			</div>
			<div className="guesses text-center">
				<Table>
					<TableCaption>Correct Answers and Time Taken.</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead className="text-center">Answers</TableHead>
							<TableHead className="text-center">Time Taken</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
							{
								guesses.map( (record, id) => {
									let guessedAnswer = record.guess.toLowerCase()

									return (
										<Fragment key={id}>
											<TableRow className={`${answers.map(answer => answer.toLowerCase()).includes(guessedAnswer) ? 'bg-green-300' : 'bg-red-300'}`}>
												<TableCell>{record.guess}</TableCell>
												<TableCell>{record.time}</TableCell>
											</TableRow>
										</Fragment>
									)
								})
							}
						
					</TableBody>
				</Table>
			</div>
			<div className="flex justify-center my-5">
				<Button variant={'secondary'} onClick={resetGameState}>Try Again?</Button>
			</div>
		</>
	)
}

	
export default Results