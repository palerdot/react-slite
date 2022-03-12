import { Descendant, BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'
import { HistoryEditor } from 'slate-history'

// IMPORTANT: types should match AST TYPE
// ref: https://github.com/hanford/remark-slate/blob/master/src/ast-types.ts
// Custom types should follow

export const HeadingType = {
  // Default: 'heading',
  One: 'heading_one',
  Two: 'heading_two',
  Three: 'heading_three',
  Four: 'heading_four',
  Five: 'heading_five',
  Six: 'heading_six',
} as const

export const FormatType = {
  BlockQuote: 'block_quote',
  BulletList: 'ul_list',
  NumberedList: 'ol_list',
  // CheckListItem: 'check-list-item',
  ListItem: 'list_item',
  // EditableVoid: 'editable-void',
  // Image: 'image',
  // Link: 'link',
  // Button: 'button',
  // Mention: 'mention',
  Paragraph: 'paragraph',
  CodeBlock: 'code_block',
  ThematicBreak: 'thematic_break',
  // Marks
  // Bold: 'bold',
  // Italic: 'italic',
  // Code: 'code',
} as const

export const ElementType = {
  ...FormatType,
  ...HeadingType,
}

// ref: https://stackoverflow.com/a/60148768/1410291
export type Format = typeof ElementType[keyof typeof ElementType]

export type Mark = {
  bold?: boolean
  italic?: boolean
  code?: boolean
}

export interface Leaf extends Mark {
  text: string
}

export type BlockQuoteElement = {
  type: typeof ElementType.BlockQuote
  children: Descendant[]
}

export type BulletedListElement = {
  type: typeof ElementType.BulletList
  children: Descendant[]
}

export type NumberedListElement = {
  type: typeof ElementType.NumberedList
  children: Descendant[]
}

// export type CheckListItemElement = {
//   type: typeof ElementType.CheckListItem
//   checked: boolean
//   children: Descendant[]
// }

// export type EditableVoidElement = {
//   type: typeof ElementType.EditableVoid
//   children: EmptyText[]
// }

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
  // | { type: typeof HeadingType.Default; children: Descendant[] }
  | HeadingOneElement
  | HeadingTwoElement
  | HeadingThreeElement
  | HeadingFourElement
  | HeadingFiveElement
  | HeadingSixElement

// export type ImageElement = {
//   type: typeof ElementType.Image
//   url: string
//   children: EmptyText[]
// }

// export type LinkElement = {
//   type: typeof ElementType.Link
//   url: string
//   children: Descendant[]
// }

// export type ButtonElement = {
//   type: typeof ElementType.Button
//   children: Descendant[]
// }

export type ListItemElement = {
  type: typeof ElementType.ListItem
  children: Descendant[]
}

// export type MentionElement = {
//   type: typeof ElementType.Mention
//   character: string
//   children: CustomText[]
// }

export type ParagraphElement = {
  type: typeof ElementType.Paragraph
  children: Descendant[]
}

export type CodeBlockElement = {
  type: typeof ElementType.CodeBlock
  children: Descendant[]
}

export type ThematicBreakElement = {
  type: typeof ElementType.ThematicBreak
  children: Descendant[]
}

type CustomElement =
  | BlockQuoteElement
  | BulletedListElement
  | NumberedListElement
  | HeadingElement
  | ListItemElement
  | ParagraphElement
  | CodeBlockElement
  | ThematicBreakElement

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
