import { deleteQuestion, getQuestions } from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
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

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog"

import { useAuthenticator } from "@aws-amplify/ui-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import React, { useState } from "react";
import { Copy } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { queryClient } from "@/lib/query";
import { convertMSTimeToString } from "@/lib/utils";

type Question = {
    _id: string,
    question: string,
    category: string,
    answers: string[],
    noOfTimesUsed: number,
    noOfTimesCompleted: number,
    bestTimeInt: number
}

const Questions = () => {
    const { user } = useAuthenticator((context) => [context.user])

    const [confirmDelete, setConfirmDelete] = useState<boolean>(false)
    const [questionToDelete, setQuestionToDelete] = useState<Question | null>(null)

    const navigate = useNavigate();

    const { data: questions, isLoading } = useQuery<Question[]>({
        queryKey: ['questions', user.username],
        queryFn: async () => getQuestions(user.username)
    })

    const { mutate, isLoading: isDeleting } = useMutation({
		mutationFn: (id: string) => deleteQuestion(id),
		onSuccess: () => {
			toast({
				description: "Successfully deleted the Question",
				duration: 3000
			})
			// ✅ refetch our questions
			queryClient.invalidateQueries({ queryKey: ['questions', user.username] })
            setConfirmDelete(false)
		},
	})

    const handlePlayButton = (questionId: string) => {
        navigate(`/play?questionId=${questionId}`)
    }

    const handleShareButton = (questionId: string) => {
        // navigate(`/play/${questionId}`)

        let shareURL = `${window.location.origin}/play?questionId=${questionId}`
        window.navigator.clipboard.writeText(shareURL);

        toast({
            description: "Game URL copied to clipboard",
            duration: 3000
        })

    }

    const handleDeleteButton = (question: Question) => {
        setQuestionToDelete( (prev) => { 
            return {
                ...prev, 
                ...question
            }
         })
        setConfirmDelete(true)
    }

    const handleConfirmDelete = () => {
        mutate(questionToDelete?._id!)
    }

    const handleCancelDelete = () => {
        setConfirmDelete(false)
    }

    return (
        <>
            <AlertDialog open={confirmDelete}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Delete this question?</AlertDialogTitle>
                    <AlertDialogDescription>
                        {questionToDelete?.question}
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => handleCancelDelete()} disabled={isDeleting}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleConfirmDelete()} disabled={isDeleting}>{isDeleting ? 'Deleting...' : 'Continue'}</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

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
                        <Table className="bg-slate-200 dark:bg-stone-700 rounded-lg">
                            <TableCaption>A list of your recent games.</TableCaption>
                            <TableHeader>
                                <TableRow>
                                <TableHead className="w-[300px] dark:text-white">Question</TableHead>
                                <TableHead className="text-center dark:text-white">Category</TableHead>
                                <TableHead className=" dark:text-white">Answers</TableHead>
                                <TableHead className="text-center dark:text-white"># of Times Used</TableHead>
                                <TableHead className="text-center dark:text-white"># of Times Completed</TableHead>
                                <TableHead className=" dark:text-white">Best Time</TableHead>
                                <TableHead className="text-center dark:text-white">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                            {
                                questions?.map( (item, index) => {
                                    // let formattedDate = new Date(game.dateEntered).toLocaleString()

                                    const { timerString: bestTime } = convertMSTimeToString(item.bestTimeInt)

                                    return (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">{item.question}</TableCell>
                                            <TableCell className="text-center">{item.category}</TableCell>
                                            <TableCell>{item.answers.join(', ')}</TableCell>
                                            <TableCell className="text-center">{item.noOfTimesUsed}</TableCell>
                                            <TableCell className="text-center">{item.noOfTimesCompleted}</TableCell>
                                            <TableCell>{bestTime}</TableCell>
                                            <TableCell className="text-right flex">
                                                <Button variant={"default"} onClick={ () => handlePlayButton(item._id)}>Play</Button>
                                                <Button className="mx-2" variant={'secondary'} onClick={ () =>handleShareButton(item._id)}><Copy />&nbsp;Share</Button>
                                                <Button variant={"destructive"} onClick={ () =>handleDeleteButton(item)}>Delete</Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
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