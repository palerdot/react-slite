import React from 'react'
import { Transforms, Editor, Element as SlateElement } from 'slate'
import { useSlate } from 'slate-react'

import { Mark, ElementType, FormatType, Format } from '../utils/custom-types'

const LIST_TYPES = [FormatType.NumberedList, FormatType.BulletList]
type ListType = typeof FormatType.NumberedList | typeof FormatType.BulletList

function isValidListType(format: any): format is ListType {
  return LIST_TYPES.includes(format)
}

const toggleBlock = (editor: Editor, format: Format) => {
  const isActive = isBlockActive(editor, format)
  // const isList = LIST_TYPES.includes(format)
  const isList = isValidListType(format)

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      // LIST_TYPES.includes(n.type),
      isValidListType(n.type),
    split: true,
  })
  const newProperties: Partial<SlateElement> = {
    type: isActive
      ? ElementType.Paragraph
      : isList
      ? ElementType.ListItem
      : format,
  }
  Transforms.setNodes<SlateElement>(editor, newProperties)

  if (!isActive && isList) {
    const block = { type: format as ListType, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}

export const toggleMark = (editor: Editor, format: keyof Mark) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const isBlockActive = (editor: Editor, format: Format) => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
    })
  )

  return !!match
}

const isMarkActive = (editor: Editor, format: keyof Mark) => {
  const marks: Mark | null = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

type ButtonProps = {
  format: Format
  icon?: string
  text?: string
}

interface MarkButtonProps {
  format: keyof Mark
  icon?: string
  text?: string
}

export const BlockButton = ({ format, icon, text }: ButtonProps) => {
  const editor = useSlate()
  const isActive = isBlockActive(editor, format)
  return (
    <button
      style={
        isActive
          ? {
              background: 'red',
            }
          : {
              background: 'green',
            }
      }
      onMouseDown={(event) => {
        event.preventDefault()
        toggleBlock(editor, format)
      }}
    >
      <span>{text}</span>
    </button>
  )
}

export const MarkButton = ({ format, icon, text }: MarkButtonProps) => {
  const editor = useSlate()
  const isActive = isMarkActive(editor, format)
  return (
    <button
      style={
        isActive
          ? {
              background: 'red',
            }
          : {
              background: 'green',
            }
      }
      onMouseDown={(event) => {
        event.preventDefault()
        toggleMark(editor, format)
      }}
    >
      <span>{text}</span>
    </button>
  )
}
