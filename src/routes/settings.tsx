import { useQuery } from "@tanstack/react-query"
import { getGameResults } from "@/lib/api"
import { useBoundStore } from "@/store"

import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
  } from "@/components/ui/table"

type TGame = {
    _id: string,
    userName: string,
    questionId: string,
	points: number,
	firstAnswerTime: string,
	completionTime: string,
    answers: string[],
	dateEntered: string,
}

const gameListQuery = (userName: string) => ({
    queryKey: ['gameResults'],
    queryFn: async () => getGameResults(userName)
})

function Settings() {
	const userName = useBoundStore.getState().userName
	const { data: games, isLoading } = useQuery<TGame[]>(gameListQuery(userName))

	console.log(games)

	return (
		<>
			{
				isLoading
				? ('Loading...')
				:
				<>
					<div className="lg:w-3/4 max-sm:px-5 w-full">
						<Table>
							<TableCaption>A list of your recent games.</TableCaption>
							<TableHeader>
								<TableRow>
								<TableHead className="w-[100px]">QuestionId</TableHead>
								<TableHead className="text-center">Points</TableHead>
								<TableHead>First Answer Time</TableHead>
								<TableHead>Completion Time</TableHead>
								<TableHead className="text-right">Date Taken</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
							{
								games?.map( (game, index) => {
									let formattedDate = new Date(game.dateEntered).toLocaleString()
								return (
									<TableRow key={index}>
										<TableCell className="font-medium">{game.questionId}</TableCell>
										<TableCell className="text-center">{game.points}</TableCell>
										<TableCell>{game.firstAnswerTime}</TableCell>
										<TableCell>{game.completionTime}</TableCell>
										<TableCell className="text-right">{formattedDate}</TableCell>
									</TableRow>
								)})
							}
							</TableBody>
						</Table>
					</div>
				</>
			}
			<div>Settings page</div>
		</>
	)
}

export default Settings