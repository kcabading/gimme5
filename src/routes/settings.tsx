import { useQuery } from "@tanstack/react-query"
import { getGameResults } from "@/lib/api"

import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
  } from "@/components/ui/table"
import { useAuthenticator } from "@aws-amplify/ui-react"
import { Skeleton } from "@/components/ui/skeleton"

type TGame = {
    _id: string,
    userName: string,
    questionId: string,
	question: string,
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
	const { user } = useAuthenticator((context) => [context.user])
	const { data: games, isLoading } = useQuery<TGame[]>(gameListQuery(user.username!))
	return (
		<>
			<h1 className="text-center text-lg font-bold mb-5">Recent Games</h1>
			{
				isLoading
				?
				<>
					<div className="gimme5-game-loading w-full">
                        <div className="grid grid-cols-1 gap-2">
                            {
                            [1,2,3,4,5,6,7,8,9,10].map( (number) => {
                                return (
                                    <Skeleton className="h-[50px] rounded-md" key={number}/>
                                )
                            })
                            }
                        </div>
                    </div>
				</>
				:
				<>
					<Table className="bg-slate-200 dark:bg-stone-700 rounded-lg">
						<TableCaption>A list of your recent games.</TableCaption>
						<TableHeader>
							<TableRow>
							<TableHead className="w-[100px]">Question</TableHead>
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
										<TableCell className="w-[300px] font-medium">{game.question}</TableCell>
										<TableCell className="text-center">{game.points}</TableCell>
										<TableCell>{game.firstAnswerTime}</TableCell>
										<TableCell>{game.completionTime}</TableCell>
										<TableCell className="text-right">{formattedDate}</TableCell>
									</TableRow>
								)
							})
						}
						</TableBody>
					</Table>
				</>
			}
		</>
	)
}

export default Settings