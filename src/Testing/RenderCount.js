import { useEffect, useRef } from 'react'

function RenderCount() {

  const count = useRef(1)
  useEffect(() => { count.current++ })
  return count.current;
}

export default RenderCount
