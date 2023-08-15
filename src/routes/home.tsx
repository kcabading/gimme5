import logo from '@/assets/gimme5-logo.png'

import { Link } from 'react-router-dom'

function Home() {
	return (
		<>
			<div className="intro flex flex-col sm:flex-row mb-20">
				<div className="max-sm:pb-10 text-center">
					<img src={logo} alt="logo" width={200} className='m-auto mb-5' />
					<h1 className='font-bold text-4xl mb-5'>Welcome to Gimme 5 - Laro ng mga Henyo!</h1>
					<p className='text-xl leading-loose'>Get ready to take charades to a whole new level with Gimme 5, the most thrilling and creative word-guessing game around! Can you guess not one, not two, but five correct answers to the given clue? Prepare for a brain-teasing, high-energy, and laughter-filled experience that will leave you and your friends begging for more!</p>
				</div>
			</div>
			<div className="mt-5">
				<div className="w-full sm:pl-10 max-sm:mt-5">
					<h2 className='font-bold text-3xl mb-5 text-cyan-500'>How to Play</h2>
					<ol className="list-decimal ml-4 space-y-5">
						<li>Pick a Category: Start by selecting a category from our list. From Tao (People), Bagay(Things), Hayop(Animals), Pagkain(Food) and Lugar(Places)</li>
						<li>Type in 5 Answers: Once you've chosen a category, you'll be presented with a clue related to that category. Your task is to type in not just one, but five correct answers that match the clue. Each answer must be unique and accurate to score points.</li>
						<li>Race Against the Clock: Time is of the essence! You'll have a limited time to come up with all five answers. Think fast, be creative, and challenge yourself to reach new heights of word-guessing brilliance.</li>
						<li>Challenge Your Friends: Invite your friends to join the fun! Play together in private rooms and compete to see who can guess all five answers with lightning speed. Show off your word association skills and outwit your opponents.</li>
						<li>Climb the Rankings: The more you play, the more points you'll earn. Climb the ranks on our global leaderboard and prove you're the ultimate word guru in Gimme 5!</li>
					</ol>
					<div className='text-center mt-10'>
						<Link to={'/play'} className='font-bold hover:bg-red-500 bg-red-400 px-5 py-2 rounded-lg text-white'>PLAY NOW!</Link>
					</div>
				</div>
			</div>
		</>
	)
}

export default Home