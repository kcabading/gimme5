import { useEffect } from "react"

function Leaderboards() {
  useEffect(() => {
    console.log('initial render')
  }, [])
  
  return (
    <div>leaderboards</div>
  )
}

export default Leaderboards