import { getQuestions } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate} from "react-router-dom";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
  } from "@/components/ui/table"

import { useAuthenticator } from "@aws-amplify/ui-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

type Question = {
    _id: string,
    question: string,
    category: string,
    answers: string[],
    noOfTimesUsed: number,
    noOfTimesCompleted: number,
    bestTimeCompleted: string
}

const Questions = () => {
    const { user } = useAuthenticator((context) => [context.user])

    const navigate = useNavigate();

    const { data: questions, isLoading } = useQuery<Question[]>({
        queryKey: ['questions', user.username],
        queryFn: async () => getQuestions(user.username)
    })

    console.log('questions', questions)
    console.log('IS LOADING', isLoading)

    const handlePlayButton = (questionId: string) => {
        navigate(`/play?questionId=${questionId}`)
    }

    const handleShareButton = (questionId: string) => {
        navigate(`/play/${questionId}`)
    }

    const handleDeleteButton = (questionId: string) => {
        navigate(`/play/${questionId}`)
    }

    return (
        <>
            <div className="flex justify-between items-center mb-5">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Welcome back, {user?.attributes?.email}!</h2>
                    <p className="text-muted-foreground">
                        Here&apos;s a list of questions you have submitted and their stats!
                    </p>
                </div>
                <Link to={'/questions/create'} className="bg-green-500 hover:bg-green-400 text-white rounded-md px-4 py-2">Submit New</Link>
            </div>
            
            {
                isLoading 
                ? 
                <>
                    <div className="gimme5-game-loading w-full">
                        <div className="grid grid-cols-7 gap-4">
                            {
                            [1,2,3,4,5,6,7].map( (number) => {
                                return (
                                    <React.Fragment key={number}>
                                        <Skeleton className="s:w-[200px] w-[250px] h-[50px] rounded-md" />
                                        <Skeleton className="s:w-[200px] w-[150px] h-[50px] rounded-md" />
                                        <Skeleton className="s:w-[200px] w-[150px] h-[50px] rounded-md" />
                                        <Skeleton className="s:w-[200px] w-[150px] h-[50px] rounded-md" />
                                        <Skeleton className="s:w-[200px] w-[150px] h-[50px] rounded-md" />
                                        <Skeleton className="s:w-[200px] w-[150px] h-[50px] rounded-md" />
                                        <Skeleton className="s:w-[200px] w-[150px] h-[50px] rounded-md" />
                                    </React.Fragment>
                                )
                            })
                            }
                        </div>
                    </div>
                </>
                : <ul>
                {
                    <>
                        <Table>
                            <TableCaption>A list of your recent games.</TableCaption>
                            <TableHeader>
                                <TableRow>
                                <TableHead className="w-[300px]">Question</TableHead>
                                <TableHead className="text-center">Category</TableHead>
                                <TableHead>Answers</TableHead>
                                <TableHead className="text-center"># of Times Used</TableHead>
                                <TableHead className="text-center"># of Times Completed</TableHead>
                                <TableHead>Best Time</TableHead>
                                <TableHead className="text-center">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                            {
                                questions?.map( (item, index) => {
                                    // let formattedDate = new Date(game.dateEntered).toLocaleString()
                                return (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{item.question}</TableCell>
                                        <TableCell className="text-center">{item.category}</TableCell>
                                        <TableCell>{item.answers.join(', ')}</TableCell>
                                        <TableCell className="text-center">{item.noOfTimesUsed}</TableCell>
                                        <TableCell className="text-center">{item.noOfTimesCompleted}</TableCell>
                                        <TableCell>{item.bestTimeCompleted}</TableCell>
                                        <TableCell className="text-right flex">
                                            <Button variant={"default"} onClick={ () => handlePlayButton(item._id)}>Play</Button>
                                            <Button className="mx-2" variant={'secondary'} onClick={ () =>handleShareButton(item._id)}>Share</Button>
                                            <Button variant={"destructive"} onClick={ () =>handleDeleteButton(item._id)}>Delete</Button>
                                        </TableCell>
                                    </TableRow>
                                )})
                            }
                            </TableBody>
                        </Table>
                    </>

                }
                </ul>
            }
        </>
    )
}

export default Questions