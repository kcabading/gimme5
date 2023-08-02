

function Home() {
  return (
    <div className='lg:w-3/4 max-lg:px-4'>
        <div className="intro flex flex-col sm:flex-row mb-20">
        <div className="max-sm:pb-10 text-center">
            <h1 className='font-bold text-4xl mb-5'>Welcome to Gimme 5 - The Ultimate Charades Challenge!</h1>
            <p className='text-xl'>Get ready to take charades to a whole new level with Gimme 5, the most thrilling and creative word-guessing game around! Can you guess not one, not two, but five correct answers to the given clue? Prepare for a brain-teasing, high-energy, and laughter-filled experience that will leave you and your friends begging for more!</p>
        </div>
        {/* <div className="quick-start flex flex-col place-items-center sm:w-1/3">
            <QuizOptions setNoOfFlags={handleFlagNumberChange} setLevel={handleLevelChange}/>
            <button className='mt-3 border-2 border-slate-500 rounded-lg py-2 px-4 font-bold hover:bg-amber-400'>Try it Now !</button>
        </div> */}
        </div>
        <div className="mt-5">
        {/* <Image priority={true} src='/leaderboards.png' height={300} width={300} alt='leaderboards image' className='sm:w-1/3 w-3/4'/> */}

        <div className="w-full sm:pl-10 max-sm:mt-5">
            <h2 className='font-bold text-3xl mb-5 text-cyan-500'>How to Play</h2>
            <ol className="list-decimal ml-4">
                <li>Pick a Category: Start by selecting a category from our diverse and ever-expanding list. From movies and music to animals, history, and beyond, there's a category that suits every taste and interest.</li>
                <li>Type in 5 Answers: Once you've chosen a category, you'll be presented with a clue related to that category. Your task is to type in not just one, but five correct answers that match the clue. Each answer must be unique and accurate to score points.</li>
                <li>Race Against the Clock: Time is of the essence! You'll have a limited time to come up with all five answers. Think fast, be creative, and challenge yourself to reach new heights of word-guessing brilliance.</li>
                <li>Challenge Your Friends: Invite your friends to join the fun! Play together in private rooms and compete to see who can guess all five answers with lightning speed. Show off your word association skills and outwit your opponents.</li>
                <li>Climb the Rankings: The more you play, the more points you'll earn. Climb the ranks on our global leaderboard and prove you're the ultimate word guru in Gimme 5!</li>
            </ol>
            {/* {
            !session?.user?.email && <button onClick={ (e) => signIn('cognito') } className='mt-3 border-2 border-slate-500 rounded-lg py-2 px-4 font-bold hover:bg-amber-400' >Sign In Now !</button>
            } */}
        </div>
        </div>
    </div>
  )
}

export default Home