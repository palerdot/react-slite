import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import Slite, {
  insertSoftLineBreaks,
  removeSoftLineBreaks,
  Toolbar,
  Editor,
  SliteProps,
} from '../index'

function SliteWrapper({ initialValue, onChange, readOnly }: SliteProps) {
  return (
    <Slite initialValue={initialValue} onChange={onChange} readOnly={readOnly}>
      {!readOnly && <Toolbar />}
      <Editor readOnly={readOnly} />
    </Slite>
  )
}

// ref: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof Remindoro> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Remindoro',
  component: Remindoro,
}

// test playground story
function Remindoro() {
  const [isLive, setLive] = useState(false)
  const [content, setContent] = useState('')

  return (
    <div>
      <div>
        <input
          id="live"
          type="checkbox"
          checked={isLive}
          onChange={event => {
            setLive(event.target.checked)
          }}
        />
        <label htmlFor="live">{'Enable live'}</label>
      </div>
      <div>
        {isLive ? (
          <SliteWrapper
            initialValue={insertSoftLineBreaks(content)}
            onChange={c => setContent(removeSoftLineBreaks(c))}
            readOnly={false}
          >
            {null}
          </SliteWrapper>
        ) : (
          <textarea
            value={content}
            style={{
              width: '300px',
            }}
            rows={10}
            onChange={event => setContent(event.target.value)}
          ></textarea>
        )}
      </div>
    </div>
  )
}

export default meta
type Story = StoryObj<typeof Remindoro>

export const Default: Story = {
  name: 'Remindoro',
  args: {},
}
