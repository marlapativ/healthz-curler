import { useState } from 'react'

export function ConfigSelector() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <div className="text-center p-2">
        <h1>Vite + React</h1>
        <div className="p-2">
          <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className="p-2">Click on the Vite and React logos to learn more</p>
      </div>
    </div>
  )
}
