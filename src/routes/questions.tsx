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
import { useState } from "react";
import { Edit2, Play, Share, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { queryClient } from "@/lib/query";
import { convertMSTimeToString } from "@/lib/utils";

import { TQuestion } from "@/types/question";

const Questions = () => {
    const { user } = useAuthenticator((context) => [context.user])

    const [confirmDelete, setConfirmDelete] = useState<boolean>(false)
    const [questionToDelete, setQuestionToDelete] = useState<TQuestion | null>(null)

    const navigate = useNavigate();

    const { data: questions, isLoading } = useQuery<TQuestion[]>({
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
			queryClient.invalidateQueries({ queryKey: ['questions'] })
            setConfirmDelete(false)
		},
	})

    const handlePlayButton = (questionId: string) => {
        navigate(`/play?questionId=${questionId}`)
    }

    const handleEditButton = (questionId: string) => {
        navigate(`/questions/edit/${questionId}`)
    }

    const handleShareButton = (questionId: string) => {

        let shareURL = `${window.location.origin}/play?questionId=${questionId}`
        window.navigator.clipboard.writeText(shareURL);

        toast({
            description: "Game URL copied to clipboard",
            duration: 3000
        })

    }

    const handleDeleteButton = (question: TQuestion) => {
        setConfirmDelete(true)
        setQuestionToDelete( (prev) => { 
            return {
                ...prev, 
                ...question
            }
        })
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
                <Link to={'/questions/create'} > <Button className="rounded-md sm-px-4 sm:py-2 max-sm:w-[120px]" variant={'secondary'}>Create New</Button></Link>
            </div>
            
            {
                isLoading 
                ? 
                <>
                    <div className="gimme5-game-loading w-full">
                        <div className="grid grid-cols-1 gap-4">
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
                : <ul>
                {
                    <>
                        <Table className="bg-slate-200 dark:bg-stone-700 rounded-lg bg-opacity-80">
                            <TableCaption>A list of your recent games.</TableCaption>
                            <TableHeader>
                                <TableRow>
                                <TableHead className="w-[300px] dark:text-white">Question</TableHead>
                                <TableHead className="text-center dark:text-white">Category</TableHead>
                                <TableHead className="text-center dark:text-white">Language</TableHead>
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
                                            <TableCell className="text-center">{item.language}</TableCell>
                                            <TableCell>{item.answers.join(', ')}</TableCell>
                                            <TableCell className="text-center">{item.noOfTimesUsed}</TableCell>
                                            <TableCell className="text-center">{item.noOfTimesCompleted}</TableCell>
                                            <TableCell>{bestTime}</TableCell>
                                            <TableCell className="text-right flex gap-x-2">
                                                <Button variant={"default"} onClick={ () => handlePlayButton(item._id)} title="Play"><Play /></Button>
                                                <Button variant={"secondary"} onClick={ () => handleEditButton(item._id)} title="Edit"><Edit2 /></Button>
                                                <Button variant={'secondary'} onClick={ () =>handleShareButton(item._id)} title="Share"><Share /></Button>
                                                <Button variant={"destructive"} onClick={ () =>handleDeleteButton(item)} title="Delete"><Trash2 /></Button>
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