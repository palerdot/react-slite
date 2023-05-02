import type { Meta, StoryObj } from '@storybook/react'

import Slite from '../index'

// ref: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof Slite> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Slite',
  component: Slite,
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

export const InitialText: Story = {
  name: 'Slite with initial text',
  args: {
    initialText: `> porumai ... wait and hope !!!`,
    onChange: () => {},
  },
}
