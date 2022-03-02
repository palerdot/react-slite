import React from 'react'
import { Descendant } from 'slate'
import { Meta, Story } from '@storybook/react'

import './storybook.css'

import { ElementType, HeadingType } from '../src/utils/custom-types'
import Slite, { Editor, Toolbars } from '../src'

const initialValue: Descendant[] = [
  {
    type: ElementType.Paragraph,
    children: [
      {
        text: 'The editor gives you full control over the logic you can add. For example, it\'s fairly common to want to add markdown-like shortcuts to editors. So that, when you start a line with "> " you get a blockquote that looks like this:',
      },
    ],
  },
  {
    type: ElementType.BlockQuote,
    children: [{ text: 'A wise quote.' }],
  },
  {
    type: ElementType.Paragraph,
    children: [
      {
        text: 'Order when you start a line with "## " you get a level-two heading, like this:',
      },
    ],
  },
  {
    type: HeadingType.Two,
    children: [{ text: 'Try it out!' }],
  },
  {
    type: ElementType.Paragraph,
    children: [
      {
        text: 'Try it out for yourself! Try starting a new line with ">", "-", or "#"s.',
      },
    ],
  },
]

type Props = {}

function DefaultSlite() {
  return (
    <Slite
      initialValue={initialValue}
      onChange={(newValue) => {
        console.log('porumai ... updated value ', newValue)
      }}
    >
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
