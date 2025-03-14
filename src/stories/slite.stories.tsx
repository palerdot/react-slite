import type { Meta, StoryObj } from '@storybook/react'

import Slite, { Toolbar, Editor, type SliteProps } from '../index'

function SliteWrapper({ initialValue, onChange, readOnly }: SliteProps) {
  return (
    <Slite initialValue={initialValue} onChange={onChange} readOnly={readOnly}>
      {!readOnly && <Toolbar />}
      <Editor readOnly={readOnly} />
    </Slite>
  )
}

// ref: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof Slite> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Slite',
  component: SliteWrapper,
}

export default meta
type Story = StoryObj<typeof Slite>

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/react/api/csf
 * to learn how to use render functions.
 */
export const Default: Story = {
  name: 'Default Slite',
  args: {
    onChange: () => {},
  },
}

const initialValue = `
> porumai ... 


This is a new line 

amaidhi





and a line after a break
`

export const InitialText: Story = {
  name: 'Slite with initial text',
  args: {
    initialValue: initialValue,
    onChange: changed => {
      console.log(changed)
    },
  },
}

export const ReadOnly: Story = {
  name: 'Read Only editor',
  args: {
    initialValue: 'porumai ... wait and hope ... `readonly` editor',
    onChange: () => {},
    readOnly: true,
  },
}
