import React from 'react'
import { Meta, Story } from '@storybook/react'

import './storybook.css'

import Slite from '../src'

type Props = {}

const meta: Meta = {
  title: 'Welcome',
  component: Slite,
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

const Template: Story<Props> = (args) => <Slite {...args} />

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({})

Default.args = {}
