import React, { KeyboardEvent } from 'react'
import { Editor } from 'slate'

import { toggleMark, isMarkActive } from '../components'

// tracks status of code
// None: No code block
// Inline: Inline code block active
// Block: Block code block active

export enum CodeStatus {
  None,
  Inline,
  Block,
}

interface CodeHandlerArgs {
  editor: Editor
  event: KeyboardEvent<HTMLElement>
  codeStatus: CodeStatus
  setCodeStatus: React.Dispatch<React.SetStateAction<CodeStatus>>
}

export function handleCodeBlockHighlight({
  editor,
  event,
  codeStatus,
  setCodeStatus,
}: CodeHandlerArgs) {
  // clearing operation: If -> (right arrow) key is pressed when
  // inline code mark is active, we have to clear it and move to next word

  // const isRightArrowKey = event.which === 39
  // if (isRightArrowKey && isMarkActive(editor, 'code')) {
  //   toggleMark(editor, 'code')
  //   // insert a plain text
  //   editor.insertText(' ')
  //   // do not proceed
  //   return
  // }

  // handle only '`' (Code: 192)
  const isBackQuote = event.which === 192

  // handling Ctrl + ~ (bug in is-hotkey)
  // ref: https://github.com/ianstormtaylor/is-hotkey/issues/37
  if (event.ctrlKey && isBackQuote) {
    toggleMark(editor, 'code')
    // do not proceed
    return
  }

  // if not backtick do not proceed
  if (!isBackQuote) {
    // do not proceed
    return
  }

  // if inline mark is already enabled do not proceed
  if (isMarkActive(editor, 'code')) {
    // do not proceed
    return
  }

  // case 1: first backtick is pressed
  if (!codeStatus) {
    // set inline code mark as active
    setCodeStatus(CodeStatus.Inline)
    // do not proceed
    return
  }

  if (codeStatus) {
    // second backtick is pressed; enable inline code
    editor.deleteBackward('character')
    toggleMark(editor, 'code')
    editor.insertText('')

    setCodeStatus(CodeStatus.None)
    // remove two backticks
    // do not proceed
    return
  }
}
