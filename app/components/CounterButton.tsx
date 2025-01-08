import { useState } from 'react';

export function CounterButton() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-lg font-semibold">Count: {count}</p>
      <button
        onClick={() => setCount(i => i + 1)}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        Increment
      </button>
    </div>
  );
}
