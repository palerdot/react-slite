import React, { KeyboardEvent } from 'react'
import {
  Editor,
  Range,
  Transforms,
  Point,
  Element as SlateElement,
} from 'slate'

import {
  toggleMark,
  isMarkActive,
  toggleBlock,
  isBlockActive,
} from '../components'
import {
  FormatType,
  BulletedListElement,
  ElementType,
  HeadingType,
} from './custom-types'

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

  // clear the status if the user is not doing a block code indent
  // No backquote is pressed; Current status is Inline
  if (codeStatus === CodeStatus.Block && !isBackQuote) {
    // reset the status
    setCodeStatus(CodeStatus.None)
    // do not proceed
    return
  }

  // handle Block code highlight
  // Inline status; Backquote character is incoming
  if (codeStatus === CodeStatus.Block && isBackQuote) {
    if (isBlockActive(editor, FormatType.CodeBlock)) {
      // do not proceed
      return
    }
    // remove code mark
    Editor.removeMark(editor, 'code')
    // enable codeblock
    toggleBlock(editor, FormatType.CodeBlock)
    // reset code status
    setCodeStatus(CodeStatus.None)
    event.preventDefault()
    // do not proceed
    return
  }

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
  if (codeStatus === CodeStatus.None) {
    // set inline code mark as active
    setCodeStatus(CodeStatus.Inline)
    // do not proceed
    return
  }

  if (codeStatus === CodeStatus.Inline) {
    // second backtick is pressed; enable inline code
    event.preventDefault()
    const { selection } = editor
    const isStart = selection?.anchor.offset === 1

    if (isStart) {
      editor.deleteBackward('character')
      toggleMark(editor, 'code')
      Editor.insertText(editor, '')
    } else {
      toggleMark(editor, 'code')
      editor.deleteBackward('character')
    }

    // set status to block
    setCodeStatus(CodeStatus.Block)
    // remove two backticks
    // do not proceed
    return
  }
}

export const SHORTCUTS = {
  '* ': ElementType.ListItem,
  '- ': ElementType.ListItem,
  '+ ': ElementType.ListItem,
  '> ': ElementType.BlockQuote,
  '# ': HeadingType.One,
  '## ': HeadingType.Two,
  '### ': HeadingType.Three,
  '#### ': HeadingType.Four,
  '##### ': HeadingType.Five,
  '###### ': HeadingType.Six,
  '{{ ': ElementType.CodeBlock,
  '--- ': ElementType.ThematicBreak,
}

export type ShortcutKey = keyof typeof SHORTCUTS

// type predicate to check if string is of valid shortcut type
function isValidShortcutType(type: string): type is ShortcutKey {
  return Object.keys(SHORTCUTS).includes(type)
}

// withShortcuts for wiring shortcuts
export const withShortcuts = (editor: Editor) => {
  const { deleteBackward, insertText } = editor

  editor.insertText = (text) => {
    const { selection } = editor

    if (selection && Range.isCollapsed(selection)) {
      const { anchor } = selection
      const block = Editor.above(editor, {
        match: (n) => Editor.isBlock(editor, n),
      })
      const path = block ? block[1] : []
      const start = Editor.start(editor, path)
      const range = {
        anchor,
        focus: start,
      }

      const beforeText = Editor.string(editor, range)
      // we have to match beforeText + currentText
      const currentText = beforeText + text

      if (isValidShortcutType(currentText)) {
        const type = SHORTCUTS[currentText]
        Transforms.select(editor, range)
        Transforms.delete(editor)
        const newProperties: Partial<SlateElement> = {
          type,
        }
        Transforms.setNodes<SlateElement>(editor, newProperties, {
          match: (n) => Editor.isBlock(editor, n),
        })

        if (type === FormatType.ListItem) {
          const list: BulletedListElement = {
            type: ElementType.BulletList,
            children: [],
          }
          Transforms.wrapNodes(editor, list, {
            match: (n) =>
              !Editor.isEditor(n) &&
              SlateElement.isElement(n) &&
              n.type === FormatType.ListItem,
          })
        }

        return
      }
    }

    insertText(text)
  }

  editor.deleteBackward = (...args) => {
    const { selection } = editor

    if (selection && Range.isCollapsed(selection)) {
      const match = Editor.above(editor, {
        match: (n) => Editor.isBlock(editor, n),
      })

      if (match) {
        const [block, path] = match
        const start = Editor.start(editor, path)

        if (
          !Editor.isEditor(block) &&
          SlateElement.isElement(block) &&
          block.type !== FormatType.Paragraph &&
          Point.equals(selection.anchor, start)
        ) {
          const newProperties: Partial<SlateElement> = {
            type: ElementType.Paragraph,
          }
          Transforms.setNodes(editor, newProperties)

          if (block.type === FormatType.ListItem) {
            Transforms.unwrapNodes(editor, {
              match: (n) =>
                !Editor.isEditor(n) &&
                SlateElement.isElement(n) &&
                n.type === FormatType.BulletList,
              split: true,
            })
          }

          return
        }
      }

      deleteBackward(...args)
    }
  }

  return editor
}
