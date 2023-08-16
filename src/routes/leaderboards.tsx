import { getLeaderboardData } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"

import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
  } from "@/components/ui/table"
import { rankToText } from "@/lib/utils"
import React from "react"
import { Skeleton } from "@/components/ui/skeleton"


export type TLeaderData = {
	username: string,
	points: number
}

function Leaderboards() {

	const { data, isLoading } = useQuery<TLeaderData[]>({
        queryKey: ['leaderboard'],
        queryFn: async () => getLeaderboardData()
    })

	console.log('leaderboard data: ', data)
  
    return (
		<>
			<h1 className="text-center text-2xl font-bold mb-5">Top 20 Users with Highest Accumulated Points</h1>
			{
				isLoading 
				? 
				<>
					<div className="gimme5-game-loading w-full">
                        <div className="grid grid-cols-3 gap-2">
                            {
                            [1,2,3,4,5,6,7].map( (number) => {
                                return (
                                    <React.Fragment key={number}>
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
				<Table className="bg-slate-200 dark:bg-stone-700 rounded-lg bg-opacity-80">
					<TableCaption>Leaderboard by Total accumulated points.</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead className="text-center">RANK</TableHead>
							<TableHead className="text-center">User</TableHead>
							<TableHead className="text-center">Total Points</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
					{
						data?.map( (leader, index) => {

							let rank = rankToText(index)
							return (
								<TableRow key={index}>
									<TableCell className="text-center"><span className={`${index == 0 ? 'text-red-500 text-4xl' : ''} font-medium`}>{rank}</span></TableCell>
									<TableCell className="text-center">{leader.username}</TableCell>
									<TableCell className="text-center">{leader.points}</TableCell>
								</TableRow>
							)
						})
					}
					</TableBody>
				</Table>
					
				
			}
		</>
      

    )
}

export default Leaderboards