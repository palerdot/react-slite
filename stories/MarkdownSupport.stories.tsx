import React, { useState, useEffect, useCallback } from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'

import Slite, { Editor, mdToSlate, slateToMd } from '../src'
import { Toolbar } from './Slite.stories'

const defaultText = `
  porumai

  > porumai wait and hope

  \`porumai ... \`
`

function PreviewSlate({ md }: { md: string }) {
  const [initialValue, setInitialValue] = useState(undefined)
  const [status, setStatus] = useState(false)

  const refreshSlate = useCallback(() => {
    mdToSlate(md).then(slateValue => {
      setStatus(false)
      setTimeout(() => {
        setInitialValue(slateValue)
        // slateToMd(slateValue).then(againString => {
        //   console.log(
        //     'porumai ... updated slate tree and string',
        //     slateValue,
        //     JSON.stringify(againString)
        //   )
        // })
        setStatus(true)
      }, 314)
    })
  }, [md])

  return (
    <div>
      <div>
        <button
          onClick={() => {
            refreshSlate()
          }}
        >
          {'Refresh'}
        </button>
      </div>
      {status && (
        <div>
          <Slite initialValue={initialValue} onChange={newValue => {}}>
            <Editor readOnly={true} />
          </Slite>
        </div>
      )}
    </div>
  )
}

function MarkdownSlite() {
  const [initialValue, setInitialValue] = useState(undefined)
  const [finalString, setFinalString] = useState('')

  useEffect(() => {
    mdToSlate(defaultText).then(slateValue => {
      setInitialValue(slateValue)
    })
  }, [])

  if (!initialValue) {
    return null
  }

  return (
    <div>
      <Slite
        initialValue={initialValue}
        onChange={newValue => {
          // console.log('porumai ... original slate ', newValue)
          slateToMd(newValue).then(s => setFinalString(s))
        }}
      >
        <Toolbar />
        <Editor />
      </Slite>
      <PreviewSlate md={finalString} />
    </div>
  )
}

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Markdown Support',
  component: MarkdownSlite,
} as ComponentMeta<typeof MarkdownSlite>

export const MarkdownSupport: ComponentStory<typeof MarkdownSlite> = () => (
  <MarkdownSlite />
)
