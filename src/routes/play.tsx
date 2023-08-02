import { Input } from "@/components/ui/input";
import { useEffect, useRef } from "react";
// import { Form } from "react-router-dom";
import { useBoundStore } from '@/store/index'
// import { useAuthenticator, Heading } from '@aws-amplify/ui-react';

export default function Play() {
    const inputRef = useRef<HTMLInputElement>(null)

    const playState = useBoundStore((state) => state.playState)
    const playCategories= useBoundStore((state) => state.categories)

    const selectedCategory = useBoundStore((state) => state.selectedCategory)
    const setSelectedCategory = useBoundStore((state) => state.setSelectedCategory)
    console.log(selectedCategory)

    const guesses = useBoundStore((state) => state.guesses)
    const setGuesses = useBoundStore((state) => state.setGuesses)
    
    const gimme5answers = ['Switzerland', 'Singapore', 'Spain', 'Samoa', 'Suriname']
    const gimme5question = 'Give 5 Countries that starts with the Letter S?'

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
        if (playState === 'PLAY') inputRef.current?.focus()
    //   return () => {
    //     second
    //   }
    }, [playState])
    
    return (
        <div className="lg:w-3/4 max-sm:px-5">
            {
                playState === 'SELECT' 
                ?
                <div className="gimme5-categories">
                    <p className="text-4xl text-center mb-5 font-bold">SELECT YOUR CATEGORY</p>
                    <div className="grid grid-cols-8 gap-5">
                    {
                        playCategories.map( (cat, index) => {
                            return (
                                <button
                                    key={index}
                                    className={`${index === 2 ? 'col-start-3' : ''} col-span-4 px-5 py-5 text-black font-bold hover:bg-amber-300 rounded-2xl text-2xl sm:text-4xl shadow-2xl`}
                                    onClick={() => setSelectedCategory(cat)} 
                                >
                                    {cat}
                                </button>
                            )
                        })
                    }
                    </div>
                </div>
                :
                <div className="gimme5-game text-center">
                    <div className="gimme5-question">
                        <p className="text-2xl"><span className="font-bold mb-5">Category</span>: {selectedCategory}</p>
                        <p className="text-4xl text-black">{gimme5question}</p>
                    </div>
                    <div className="input-answer my-8 sm:w-1/2 m-auto">
                        <Input ref={inputRef} type="text" className="text-4xl border-4 focus-visible:ring-0 p-8" placeholder="Start Typing..." onKeyUpCapture={ (e) => handleInputChange(e) }/>
                    </div>
                    <div className="grid grid-cols-8 gap-5">
                        {
                            gimme5answers.map( (answer, index) => {

                                let isCorrect = guesses.includes(answer.toLowerCase()) ? true : false

                                return (
                                    <button
                                        key={index}
                                        className={`${index === 2 ? 'col-start-3' : ''} ${isCorrect ? 'border-green-300' : ''} col-span-4 px-5 py-5 border-4 text-black font-bold rounded-2xl text-2xl sm:text-4xl shadow-2xl`} 
                                    >
                                        { isCorrect ?  answer : <span className="font-bold">{index + 1}</span>}
                                    </button>
                                )
                            })
                        }
                    </div>
                </div>
            }
        </div>

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