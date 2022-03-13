import React, { MouseEvent, useCallback } from 'react'
import { Transforms, Editor, Element as SlateElement } from 'slate'
import { useSlate } from 'slate-react'

import {
  Mark,
  ElementType,
  FormatType,
  Format,
  HeadingType,
} from '../utils/custom-types'

const LIST_TYPES = [FormatType.NumberedList, FormatType.BulletList]
type ListType = typeof FormatType.NumberedList | typeof FormatType.BulletList

function isValidListType(format: any): format is ListType {
  return LIST_TYPES.includes(format)
}

export const toggleBlock = (editor: Editor, format: Format) => {
  const isActive = isBlockActive(editor, format)
  // const isList = LIST_TYPES.includes(format)
  const isList = isValidListType(format)

  Transforms.unwrapNodes(editor, {
    match: n => !Editor.isEditor(n) && SlateElement.isElement(n),
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

export const isBlockActive = (editor: Editor, format: Format) => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n =>
        !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
    })
  )

  return !!match
}

export const isMarkActive = (editor: Editor, format: keyof Mark) => {
  const marks: Mark | null = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

type ToolbarChildrenProps = {
  isActive: boolean
  onMouseDown: (event: MouseEvent) => void
}

type ToolbarChildren = ({
  isActive,
  onMouseDown,
}: ToolbarChildrenProps) => React.ReactElement

type ToolbarProps = {
  children: ToolbarChildren
}

type ButtonProps = {
  format: Format
  children: ToolbarChildren
}

interface MarkButtonProps {
  format: keyof Mark
  children: ToolbarChildren
}

export const BlockButton = ({ format, children }: ButtonProps) => {
  const editor = useSlate()
  const isActive = isBlockActive(editor, format)

  const onMouseDown = useCallback(
    (event: MouseEvent) => {
      event.preventDefault()
      if (format === FormatType.ThematicBreak) {
        editor.insertBreak()
      }
      toggleBlock(editor, format)
    },
    [editor, format]
  )

  return children({
    isActive,
    onMouseDown,
  })
}

export const MarkButton = ({ format, children }: MarkButtonProps) => {
  const editor = useSlate()
  const isActive = isMarkActive(editor, format)

  const onMouseDown = useCallback(
    (event: MouseEvent) => {
      event.preventDefault()
      toggleMark(editor, format)
    },
    [editor, format]
  )
  return children({
    isActive,
    onMouseDown,
  })
}

function BoldButton({ children }: ToolbarProps) {
  return <MarkButton format={'bold'}>{children}</MarkButton>
}

function ItalicButton({ children }: ToolbarProps) {
  return <MarkButton format={'italic'}>{children}</MarkButton>
}

function CodeButton({ children }: ToolbarProps) {
  return <MarkButton format={'code'}>{children}</MarkButton>
}

function CodeBlockButton({ children }: ToolbarProps) {
  return <BlockButton format={FormatType.CodeBlock}>{children}</BlockButton>
}

function ThematicBreakBlockButton({ children }: ToolbarProps) {
  return <BlockButton format={FormatType.ThematicBreak}>{children}</BlockButton>
}

function HeadingOneButton({ children }: ToolbarProps) {
  return <BlockButton format={HeadingType.One}>{children}</BlockButton>
}

function HeadingTwoButton({ children }: ToolbarProps) {
  return <BlockButton format={HeadingType.Two}>{children}</BlockButton>
}

function HeadingThreeButton({ children }: ToolbarProps) {
  return <BlockButton format={HeadingType.Three}>{children}</BlockButton>
}

function HeadingFourButton({ children }: ToolbarProps) {
  return <BlockButton format={HeadingType.Four}>{children}</BlockButton>
}

function HeadingFiveButton({ children }: ToolbarProps) {
  return <BlockButton format={HeadingType.Five}>{children}</BlockButton>
}

function HeadingSixButton({ children }: ToolbarProps) {
  return <BlockButton format={HeadingType.Six}>{children}</BlockButton>
}

function BlockQuoteButton({ children }: ToolbarProps) {
  return <BlockButton format={FormatType.BlockQuote}>{children}</BlockButton>
}

function NumberedListButton({ children }: ToolbarProps) {
  return <BlockButton format={FormatType.NumberedList}>{children}</BlockButton>
}

function BulletedListButton({ children }: ToolbarProps) {
  return <BlockButton format={FormatType.BulletList}>{children}</BlockButton>
}

export const Toolbars = {
  Bold: BoldButton,
  Italic: ItalicButton,
  Code: CodeButton,
  CodeBlock: CodeBlockButton,
  ThematicBreakBlock: ThematicBreakBlockButton,
  HeadingOne: HeadingOneButton,
  HeadingTwo: HeadingTwoButton,
  HeadingThree: HeadingThreeButton,
  HeadingFour: HeadingFourButton,
  HeadingFive: HeadingFiveButton,
  HeadingSix: HeadingSixButton,
  BlockQuote: BlockQuoteButton,
  NumberedList: NumberedListButton,
  BulletedList: BulletedListButton,
}
