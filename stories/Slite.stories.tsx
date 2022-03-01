import React from 'react'
import { Meta, Story } from '@storybook/react'

import './storybook.css'

import Slite, { Editor, Toolbars } from '../src'

type Props = {}

function DefaultSlite() {
  return (
    <Slite>
      <Toolbar />
      <Editor />
    </Slite>
  )
}

const meta: Meta = {
  title: 'Welcome',
  component: DefaultSlite,
  argTypes: {
    children: {
      control: {
        type: 'text',
      },
    },
  },
  parameters: {
    controls: { expanded: true },
  },
}

export default meta

const Template: Story<Props> = (args) => <DefaultSlite {...args} />

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({})

Default.args = {}

function Toolbar() {
  return (
    <div>
      <Toolbars.Bold>
        {({ isActive, onMouseDown }) => (
          <button
            style={{
              background: isActive ? 'green' : 'blue',
            }}
            onMouseDown={onMouseDown}
          >
            {'Bold'}
          </button>
        )}
      </Toolbars.Bold>

      <Toolbars.Italic>
        {({ isActive, onMouseDown }) => (
          <button
            style={{
              background: isActive ? 'green' : 'blue',
            }}
            onMouseDown={onMouseDown}
          >
            {'Italic'}
          </button>
        )}
      </Toolbars.Italic>

      <Toolbars.Code>
        {({ isActive, onMouseDown }) => (
          <button
            style={{
              background: isActive ? 'green' : 'blue',
            }}
            onMouseDown={onMouseDown}
          >
            {'Code'}
          </button>
        )}
      </Toolbars.Code>

      <Toolbars.CodeBlock>
        {({ isActive, onMouseDown }) => (
          <button
            style={{
              background: isActive ? 'green' : 'blue',
            }}
            onMouseDown={onMouseDown}
          >
            {'</>'}
          </button>
        )}
      </Toolbars.CodeBlock>

      <Toolbars.HeadingOne>
        {({ isActive, onMouseDown }) => (
          <button
            style={{
              background: isActive ? 'green' : 'blue',
            }}
            onMouseDown={onMouseDown}
          >
            {'H1'}
          </button>
        )}
      </Toolbars.HeadingOne>

      <Toolbars.HeadingTwo>
        {({ isActive, onMouseDown }) => (
          <button
            style={{
              background: isActive ? 'green' : 'blue',
            }}
            onMouseDown={onMouseDown}
          >
            {'H2'}
          </button>
        )}
      </Toolbars.HeadingTwo>

      <Toolbars.HeadingThree>
        {({ isActive, onMouseDown }) => (
          <button
            style={{
              background: isActive ? 'green' : 'blue',
            }}
            onMouseDown={onMouseDown}
          >
            {'H3'}
          </button>
        )}
      </Toolbars.HeadingThree>

      <Toolbars.BlockQuote>
        {({ isActive, onMouseDown }) => (
          <button
            style={{
              background: isActive ? 'green' : 'blue',
            }}
            onMouseDown={onMouseDown}
          >
            {'|>'}
          </button>
        )}
      </Toolbars.BlockQuote>

      <Toolbars.NumberedList>
        {({ isActive, onMouseDown }) => (
          <button
            style={{
              background: isActive ? 'green' : 'blue',
            }}
            onMouseDown={onMouseDown}
          >
            {'1)'}
          </button>
        )}
      </Toolbars.NumberedList>

      <Toolbars.BulletedList>
        {({ isActive, onMouseDown }) => (
          <button
            style={{
              background: isActive ? 'green' : 'blue',
            }}
            onMouseDown={onMouseDown}
          >
            {'-'}
          </button>
        )}
      </Toolbars.BulletedList>
    </div>
  )
}
