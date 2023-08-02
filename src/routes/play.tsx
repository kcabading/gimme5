import { Input } from "@/components/ui/input";
import { useRef } from "react";
// import { Form } from "react-router-dom";
import { useBoundStore } from '@/store/index'
// import { useAuthenticator, Heading } from '@aws-amplify/ui-react';

export default function Play() {

    // const { route } = useAuthenticator((context) => [context.route]);

    // const message = route === 'authenticated' ? 'FIRST PROTECTED ROUTE!' : 'Loading...';

    // console.log('MESSAGE:', message)

    const inputRef = useRef<HTMLInputElement>(null)

    const playState = useBoundStore((state) => state.playState)
    const playCategories= useBoundStore((state) => state.categories)

    const selectedCategory = useBoundStore((state) => state.selectedCategory)
    const setSelectedCategory = useBoundStore((state) => state.setSelectedCategory)
    console.log(selectedCategory)

    const guesses = useBoundStore((state) => state.guesses)
    const setGuesses = useBoundStore((state) => state.setGuesses)
    
    const gimme5answers = ['Switzerland', 'Singapore', 'Spain', 'Samoa', 'Suriname']

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
    
    return (
        <div className="lg:w-3/4 max-sm:px-5">
            {
                playState === 'SELECT' 
                ?
                <div className="gimme5-categories">
                    <p className="text-2xl text-center mb-5 font-bold">SELECT YOUR CATEGORY</p>
                    <div className="grid grid-cols-8 gap-5">
                    {
                        playCategories.map( (cat, index) => {
                            return (
                                <button
                                    key={index}
                                    className={`${index === 2 ? 'col-start-3' : ''} col-span-4 px-10 py-5 bg-amber-400 text-white font-bold rounded-lg hover:bg-amber-500`}
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
                        <p className="text-2xl">Give 5 Countries that starts with the Letter S</p>
                    </div>
                    <div className="input-answer my-4 sm:w-1/2 m-auto">
                        <Input ref={inputRef} type="text" className="border-4 focus-visible:ring-0" placeholder="Start Typing..." onKeyUpCapture={ (e) => handleInputChange(e) }/>
                    </div>
                    <div className="grid grid-cols-8 gap-5">
                        {
                            gimme5answers.map( (answer, index) => {
                                return (
                                    <button
                                        key={index}
                                        className={`${index === 2 ? 'col-start-3' : ''} col-span-4 px-10 py-5 bg-amber-400 text-white font-bold rounded-lg`} 
                                    >
                                        { guesses.includes(answer.toLowerCase()) ?  answer : '-'}
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