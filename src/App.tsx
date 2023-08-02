import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from './components/ui/button'

import useCounter from '@/store'

function App() {
  // const [count, setCount] = useState(0)

  const counter = useCounter((state) => state.counter)
  const increasePopulation = useCounter((state) => state.increaseCounter)

  return (
    <>
      <div>
        <p>Counter: {counter}</p>
        <Button onClick={increasePopulation}>Click me</Button>
      </div>
    </>
  )
}

export default App
