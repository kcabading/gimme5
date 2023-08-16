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
import React from "react"
import { Skeleton } from "@/components/ui/skeleton"

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
	const { user } = useAuthenticator((context) => [context.user])

	const { data: games, isLoading } = useQuery<TGame[]>(gameListQuery(user.username!))

	console.log(games)

	return (
		<>
			<h1 className="text-center text-lg font-bold mb-5">Recent Games</h1>
			{
				isLoading
				?
				<>
					<div className="gimme5-game-loading w-full">
                        <div className="grid grid-cols-5 gap-2">
                            {
                            [1,2,3,4,5,6,7].map( (number) => {
                                return (
                                    <React.Fragment key={number}>
                                        <Skeleton className="h-[50px] rounded-md" />
                                        <Skeleton className="h-[50px] rounded-md" />
                                        <Skeleton className="h-[50px] rounded-md" />
										<Skeleton className="h-[50px] rounded-md" />
										<Skeleton className="h-[50px] rounded-md" />
                                    </React.Fragment>
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
				</>
			}
		</>
	)
}

export default Settings