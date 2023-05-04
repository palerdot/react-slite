import React from 'react'
import { createRoot } from 'react-dom/client'
import { describe, test } from 'vitest'

import Slite, { Editor } from '../src/'

function DefaultSlite() {
  return (
    <Slite initialValue={``} onChange={() => {}}>
      <Editor />
    </Slite>
  )
}

describe('Slite', () => {
  test('render without crashing', () => {
    const div = document.createElement('div')
    const root = createRoot(div) // createRoot(container!) if you use TypeScript
    root.render(<DefaultSlite />)
    root.unmount()
  })
})
