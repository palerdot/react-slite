import { Descendant, BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'
import { HistoryEditor } from 'slate-history'

export const HeadingType = {
  Default: 'heading',
  One: 'heading-one',
  Two: 'heading-two',
  Three: 'heading-three',
  Four: 'heading-four',
  Five: 'heading-five',
  Six: 'heading-six',
} as const

export const ElementType = {
  BlockQuote: 'block-quote',
  BulletList: 'bulleted-list',
  CheckListItem: 'check-list-item',
  ListItem: 'list-item',
  EditableVoid: 'editable-void',
  Heading: HeadingType,
  Image: 'image',
  Link: 'link',
  Button: 'button',
  Mention: 'mention',
  Paragraph: 'paragraph',
  Table: 'table',
  TableCell: 'table-cell',
  TableRow: 'table-row',
  Title: 'title',
  Video: 'video',
} as const

export type BlockQuoteElement = {
  type: typeof ElementType.BlockQuote
  children: Descendant[]
}

export type BulletedListElement = {
  type: typeof ElementType.BulletList
  children: Descendant[]
}

export type CheckListItemElement = {
  type: typeof ElementType.CheckListItem
  checked: boolean
  children: Descendant[]
}

export type EditableVoidElement = {
  type: typeof ElementType.EditableVoid
  children: EmptyText[]
}

export type HeadingOneElement = {
  type: typeof HeadingType.One
  children: Descendant[]
}
export type HeadingTwoElement = {
  type: typeof HeadingType.Two
  children: Descendant[]
}
export type HeadingThreeElement = {
  type: typeof HeadingType.Three
  children: Descendant[]
}
export type HeadingFourElement = {
  type: typeof HeadingType.Four
  children: Descendant[]
}
export type HeadingFiveElement = {
  type: typeof HeadingType.Five
  children: Descendant[]
}
export type HeadingSixElement = {
  type: typeof HeadingType.Six
  children: Descendant[]
}

export type HeadingElement =
  | { type: typeof HeadingType.Default; children: Descendant[] }
  | HeadingOneElement
  | HeadingTwoElement
  | HeadingThreeElement
  | HeadingFourElement
  | HeadingFiveElement
  | HeadingSixElement

export type ImageElement = {
  type: typeof ElementType.Image
  url: string
  children: EmptyText[]
}

export type LinkElement = {
  type: typeof ElementType.Link
  url: string
  children: Descendant[]
}

export type ButtonElement = {
  type: typeof ElementType.Button
  children: Descendant[]
}

export type ListItemElement = {
  type: typeof ElementType.ListItem
  children: Descendant[]
}

export type MentionElement = {
  type: typeof ElementType.Mention
  character: string
  children: CustomText[]
}

export type ParagraphElement = {
  type: typeof ElementType.Paragraph
  children: Descendant[]
}

export type TableCellElement = {
  type: typeof ElementType.TableCell
  children: CustomText[]
}

export type TableRowElement = {
  type: typeof ElementType.TableRow
  children: TableCellElement[]
}

export type TableElement = {
  type: typeof ElementType.Table
  children: TableRowElement[]
}

export type TitleElement = {
  type: typeof ElementType.Title
  children: Descendant[]
}

export type VideoElement = {
  type: typeof ElementType.Video
  url: string
  children: EmptyText[]
}

type CustomElement =
  | BlockQuoteElement
  | BulletedListElement
  | CheckListItemElement
  | EditableVoidElement
  | HeadingElement
  | ImageElement
  | LinkElement
  | ButtonElement
  | ListItemElement
  | MentionElement
  | ParagraphElement
  | TableElement
  | TableRowElement
  | TableCellElement
  | TitleElement
  | VideoElement

export type CustomText = {
  bold?: boolean
  italic?: boolean
  code?: boolean
  text: string
}

export type EmptyText = {
  text: string
}

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor
    Element: CustomElement
    Text: CustomText | EmptyText
  }
}
