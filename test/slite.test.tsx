import React from 'react'
import * as ReactDOM from 'react-dom'

import Slite from '../src/'

function DefaultSlite() {
  return (
    <Slite initialValue={[]} onChange={() => {}}>
      {null}
    </Slite>
  )
}

describe('Slite', () => {
  test('render without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<DefaultSlite />, div)
    ReactDOM.unmountComponentAtNode(div)
  })
})
