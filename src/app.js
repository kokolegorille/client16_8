import React, {useState, useEffect} from 'react';

const App = () => {
  const [count, setCount] = useState(0)
  const handleIncrease = () => setCount(count + 1)
  const handleDecrease = () => setCount(count - 1)

  useEffect(() => {
    console.log(`I'm inside useEffect function with count ${count}`)

    return () => {
      console.log(`callback function with count ${count}`)
    }
  })

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={handleIncrease}>Increase</button>
      <button onClick={handleDecrease}>Decrease</button>
    </div>
  )
};

export default App;