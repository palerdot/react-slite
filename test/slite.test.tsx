import React from 'react'
import * as ReactDOM from 'react-dom'
import { Default as Slite } from '../stories/Slite.stories'

describe('Slite', () => {
  test('render without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<Slite initialValue={[]} onChange={() => {}} />, div)
    ReactDOM.unmountComponentAtNode(div)
  })
})
