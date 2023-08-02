import { Input } from "@/components/ui/input";
import { useEffect, useRef } from "react";
// import { Form } from "react-router-dom";
import { useBoundStore } from '@/store/index'

import { GiMagnifyingGlass } from "react-icons/gi";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
import Timer from "@/components/game/Timer";


export default function Play() {

    console.log('RENDER')
    const inputRef = useRef<HTMLInputElement>(null)

    const playState = useBoundStore((state) => state.playState)
    const setPlayState = useBoundStore((state) => state.setPlayState)
    const playCategories= useBoundStore((state) => state.categories)

    const selectedCategory = useBoundStore((state) => state.selectedCategory)
    const setSelectedCategory = useBoundStore((state) => state.setSelectedCategory)

    const guesses = useBoundStore((state) => state.guesses)
    const setGuesses = useBoundStore((state) => state.setGuesses)

    const hintText = useBoundStore((state) => state.hintText)
    const setHintText = useBoundStore((state) => state.setHintText)

    const hintOpen = useBoundStore((state) => state.hintOpen)
    const setHintOpen = useBoundStore((state) => state.setHintOpen)

    const reset = useBoundStore((state) => state.resetPlay)
    
    const gimme5answers = ['Switzerland', 'Singapore', 'Spain', 'Samoa', 'Suriname']
    const gimme5question = 'Give 5 Countries that starts with the Letter S?'
    const gimme5hints = ['HINT # 1','HINT # 2', 'HINT # 3']

    // const handleGameFinished = () => {
    //     console.log('GAME FINISHED!')
    //     // stopTimer()
    // }

    const handleTimesUp = () => {
        console.log('TIMES UP')
        setPlayState('FINISHED')
    }

    const handleHintOpen = (hintNumber: number) => {
        setHintText(gimme5hints[hintNumber-1])
        setHintOpen(true)
    }

    const handleSetCategory = (category: string) => {
        setSelectedCategory(category)
        // startTimer()
        setTimeout( ()=> {
            inputRef.current?.focus()
        }, 500)
    }

    const handleInputChange = (e:React.KeyboardEvent<HTMLInputElement>) => {
        if(e.code === 'Enter') {
            if (inputRef.current !== null) {
                let guessedAnswer = (inputRef.current?.value).toLowerCase()
                if (!guesses.includes(guessedAnswer)) {
                    if (gimme5answers.map(answer => answer.toLowerCase()).includes(guessedAnswer)) {
                        console.log('adding border')
                        inputRef.current?.classList.add('border-green-300')
                        setTimeout(() => {
                            inputRef.current?.classList.remove('border-green-300')
                        }, 2000);
                    } else {
                        inputRef.current?.classList.add('border-red-300')
                        setTimeout(() => {
                            inputRef.current?.classList.remove('border-red-300')
                        }, 2000);
                    }
                    setGuesses(guessedAnswer)
                    
                }
                inputRef.current.value = ''
            }   
        }
    }

    useEffect(() => {
        // reset initial state
        reset()
    }, [])
    
    return (
        <>
            <Dialog open={hintOpen} onOpenChange={setHintOpen}>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle>HINT # </DialogTitle>
                    <DialogDescription>
                        {hintText}
                    </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
            <div className="lg:w-3/4 max-sm:px-5">
                {
                    playState === 'SELECT' 
                    &&
                    <div className="gimme5-categories">
                        <p className="text-4xl text-center mb-5 font-bold">SELECT YOUR CATEGORY</p>
                        <div className="grid grid-cols-8 gap-5">
                        {
                            playCategories.map( (cat, index) => {
                                return (
                                    <button
                                        key={index}
                                        className={`${index === 2 ? 'col-start-3' : ''} col-span-4 px-5 py-5 text-black font-bold hover:bg-amber-300 rounded-2xl text-2xl sm:text-4xl shadow-2xl`}
                                        onClick={() => handleSetCategory(cat)} 
                                    >
                                        {cat}
                                    </button>
                                )
                            })
                        }
                        </div>
                    </div>
                }
                {
                    playState === 'PLAY' 
                    &&
                    <div className="gimme5-game text-center relative">
                        {/* <div className="timer absolute right-0 -top-8 sm:-top-2 sm:right-6 font-bold text-4xl sm:text-4xl">{timer}</div> */}
                        <div className="flex justify-between items-center mb-5">
                            <p className="text-lg sm:text-2xl"><span className="font-bold mb-5">Category</span>: {selectedCategory}</p>
                            {/* <div className="timer font-bold text-4xl">{timer}</div> */}
                            <Timer initialTime={60} handleTimesUp={handleTimesUp}/>
                        </div>
                        <div className="gimme5-question">
                            <p className="text-2xl sm:text-4xl">{gimme5question}</p>
                        </div>
                        <div className="input-answer my-8 sm:w-1/2 m-auto">
                            <Input ref={inputRef} type="text" className="text-4xl border-4 focus-visible:ring-0 p-8" placeholder="Start Typing..." onKeyUpCapture={ (e) => handleInputChange(e) }/>
                            <div className="hints flex items-center justify-center mt-3 text-2xl">
                                <button className="mx-2 p-2 hover:bg-slate-200 rounded-lg" onClick={ () => handleHintOpen(1) }><GiMagnifyingGlass /></button>
                                <button className="mx-2 p-2 hover:bg-slate-200 rounded-lg" onClick={ () => handleHintOpen(2) }><GiMagnifyingGlass /></button>
                                <button className="mx-2 p-2 hover:bg-slate-200 rounded-lg" onClick={ () => handleHintOpen(3) }><GiMagnifyingGlass /></button>
                            </div>
                        </div>
                        <div className="grid grid-cols-8 gap-3 sm:gap-5">
                            {
                                gimme5answers.map( (answer, index) => {
                                    let isCorrect = guesses.includes(answer.toLowerCase()) ? true : false
                                    return (
                                        <button
                                            key={index}
                                            className={`${index === 2 ? 'col-start-3' : ''} ${isCorrect ? 'border-green-300' : ''} col-span-4 px-5 py-5 border-4 font-bold rounded-2xl text-2xl sm:text-4xl shadow-2xl`} 
                                        >
                                            { isCorrect ?  answer : <span className="font-bold">{index + 1}</span>}
                                        </button>
                                    )
                                })
                            }
                        </div>
                    </div>
                }
                {
                    playState === 'FINISHED' 
                    &&
                    <div className="gimme5-result text center">
                        <p className="font-bold text-2xl sm:text-4xl">TIMES UP!</p>
                    </div>
                }
            </div>
        </>
    )


    // return (
    // <div id="contact">
    //     <div>
    //     <img
    //         key={contact.avatar}
    //         src={contact.avatar || null}
    //     />
    //     </div>

    //     <div>
    //     <h1>
    //         {contact.first || contact.last ? (
    //         <>
    //             {contact.first} {contact.last}
    //         </>
    //         ) : (
    //         <i>No Name</i>
    //         )}{" "}
    //         <Favorite contact={contact} />
    //     </h1>

    //     {contact.twitter && (
    //         <p>
    //         <a
    //             target="_blank"
    //             href={`https://twitter.com/${contact.twitter}`}
    //         >
    //             {contact.twitter}
    //         </a>
    //         </p>
    //     )}

    //     {contact.notes && <p>{contact.notes}</p>}

    //     <div>
    //         <Form action="edit">
    //         <button type="submit">Edit</button>
    //         </Form>
    //         <Form
    //         method="post"
    //         action="destroy"
    //         onSubmit={(event) => {
    //             if (
    //             !confirm(
    //                 "Please confirm you want to delete this record."
    //             )
    //             ) {
    //             event.preventDefault();
    //             }
    //         }}
    //         >
    //         <button type="submit">Delete</button>
    //         </Form>
    //     </div>
    //     </div>
    // </div>
    // );
}

// function Favorite({ contact }) {
//   // yes, this is a `let` for later
//   let favorite = contact.favorite;
//   return (
//     <Form method="post">
//       <button
//         name="favorite"
//         value={favorite ? "false" : "true"}
//         aria-label={
//           favorite
//             ? "Remove from favorites"
//             : "Add to favorites"
//         }
//       >
//         {favorite ? "★" : "☆"}
//       </button>
//     </Form>
//   );
// }