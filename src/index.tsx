import React, { useState, useCallback, useMemo, KeyboardEvent } from 'react'
import {
  Slate,
  Editable,
  withReact,
  RenderElementProps,
  RenderLeafProps,
} from 'slate-react'
import {
  Editor,
  Transforms,
  Range,
  Point,
  createEditor,
  Element as SlateElement,
  Descendant,
} from 'slate'
import { withHistory } from 'slate-history'
import isHotkey from 'is-hotkey'

import {
  BulletedListElement,
  ElementType,
  HeadingType,
  Leaf as LeafType,
  Mark,
} from './utils/custom-types'
import { toggleMark, Toolbars, isMarkActive } from './components/'
import { handleCodeBlockHighlight, CodeStatus } from './utils/'

const HOTKEYS: { [key: string]: keyof Mark } = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+`': 'code',
}

const SHORTCUTS = {
  '*': ElementType.ListItem,
  '-': ElementType.ListItem,
  '+': ElementType.ListItem,
  '>': ElementType.BlockQuote,
  '#': HeadingType.One,
  '##': HeadingType.Two,
  '###': HeadingType.Three,
  '####': HeadingType.Four,
  '#####': HeadingType.Five,
  '######': HeadingType.Six,
  '{{{': ElementType.CodeBlock,
}

type ShortcutKey = keyof typeof SHORTCUTS

// type predicate to check if string is of valid shortcut type
function isValidShortcutType(type: string): type is ShortcutKey {
  return Object.keys(SHORTCUTS).includes(type)
}

const SliteEditor = () => {
  const [value, setValue] = useState<Descendant[]>(initialValue)
  const renderElement = useCallback((props) => <Element {...props} />, [])
  const renderLeaf = useCallback((props) => <Leaf {...props} />, [])
  const editor = useMemo(
    () => withShortcuts(withReact(withHistory(createEditor()))),
    []
  )

  // '``' Double backtick for inline code mark
  // enables and disabled double backtick shortcut
  const [codeStatus, setCodeStatus] = useState<CodeStatus>(CodeStatus.None)
  const handleInlineCode = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      handleCodeBlockHighlight({
        editor,
        event,
        codeStatus,
        setCodeStatus,
      })
    },
    [editor, codeStatus, setCodeStatus]
  )

  return (
    <Slate editor={editor} value={value} onChange={(value) => setValue(value)}>
      <div>
        <Toolbars.Bold>
          {({ isActive, onMouseDown }) => (
            <button
              style={{
                background: isActive ? 'green' : 'blue',
              }}
              onMouseDown={onMouseDown}
            >
              {'Bold'}
            </button>
          )}
        </Toolbars.Bold>

        <Toolbars.Italic>
          {({ isActive, onMouseDown }) => (
            <button
              style={{
                background: isActive ? 'green' : 'blue',
              }}
              onMouseDown={onMouseDown}
            >
              {'Italic'}
            </button>
          )}
        </Toolbars.Italic>

        <Toolbars.Code>
          {({ isActive, onMouseDown }) => (
            <button
              style={{
                background: isActive ? 'green' : 'blue',
              }}
              onMouseDown={onMouseDown}
            >
              {'Code'}
            </button>
          )}
        </Toolbars.Code>

        <Toolbars.HeadingOne>
          {({ isActive, onMouseDown }) => (
            <button
              style={{
                background: isActive ? 'green' : 'blue',
              }}
              onMouseDown={onMouseDown}
            >
              {'H1'}
            </button>
          )}
        </Toolbars.HeadingOne>

        <Toolbars.HeadingTwo>
          {({ isActive, onMouseDown }) => (
            <button
              style={{
                background: isActive ? 'green' : 'blue',
              }}
              onMouseDown={onMouseDown}
            >
              {'H2'}
            </button>
          )}
        </Toolbars.HeadingTwo>

        <Toolbars.HeadingThree>
          {({ isActive, onMouseDown }) => (
            <button
              style={{
                background: isActive ? 'green' : 'blue',
              }}
              onMouseDown={onMouseDown}
            >
              {'H3'}
            </button>
          )}
        </Toolbars.HeadingThree>

        <Toolbars.BlockQuote>
          {({ isActive, onMouseDown }) => (
            <button
              style={{
                background: isActive ? 'green' : 'blue',
              }}
              onMouseDown={onMouseDown}
            >
              {'|>'}
            </button>
          )}
        </Toolbars.BlockQuote>

        <Toolbars.NumberedList>
          {({ isActive, onMouseDown }) => (
            <button
              style={{
                background: isActive ? 'green' : 'blue',
              }}
              onMouseDown={onMouseDown}
            >
              {'1)'}
            </button>
          )}
        </Toolbars.NumberedList>

        <Toolbars.BulletedList>
          {({ isActive, onMouseDown }) => (
            <button
              style={{
                background: isActive ? 'green' : 'blue',
              }}
              onMouseDown={onMouseDown}
            >
              {'-'}
            </button>
          )}
        </Toolbars.BulletedList>
      </div>
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Write some markdown..."
        spellCheck
        autoFocus
        onKeyDown={(event: KeyboardEvent<HTMLElement>) => {
          for (const hotkey in HOTKEYS) {
            if (isHotkey(hotkey, event as any)) {
              event.preventDefault()
              const mark = HOTKEYS[hotkey]
              toggleMark(editor, mark)
            }
          }

          // handle '``' double backtick for inline code handling
          handleInlineCode(event)
        }}
      />
    </Slate>
  )
}

const withShortcuts = (editor: Editor) => {
  const { deleteBackward, insertText } = editor

  editor.insertText = (text) => {
    const { selection } = editor

    if (text === ' ' && selection && Range.isCollapsed(selection)) {
      const { anchor } = selection
      const block = Editor.above(editor, {
        match: (n) => Editor.isBlock(editor, n),
      })
      const path = block ? block[1] : []
      const start = Editor.start(editor, path)
      const range = { anchor, focus: start }

      const beforeText = Editor.string(editor, range)

      if (isValidShortcutType(beforeText)) {
        const type = SHORTCUTS[beforeText]
        Transforms.select(editor, range)
        Transforms.delete(editor)
        const newProperties: Partial<SlateElement> = {
          type,
        }
        Transforms.setNodes<SlateElement>(editor, newProperties, {
          match: (n) => Editor.isBlock(editor, n),
        })

        if (type === 'list-item') {
          const list: BulletedListElement = {
            type: ElementType.BulletList,
            children: [],
          }
          Transforms.wrapNodes(editor, list, {
            match: (n) =>
              !Editor.isEditor(n) &&
              SlateElement.isElement(n) &&
              n.type === 'list-item',
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
          block.type !== 'paragraph' &&
          Point.equals(selection.anchor, start)
        ) {
          const newProperties: Partial<SlateElement> = {
            type: ElementType.Paragraph,
          }
          Transforms.setNodes(editor, newProperties)

          if (block.type === 'list-item') {
            Transforms.unwrapNodes(editor, {
              match: (n) =>
                !Editor.isEditor(n) &&
                SlateElement.isElement(n) &&
                n.type === 'bulleted-list',
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

interface ElementProps extends RenderElementProps {}
interface LeafProps extends RenderLeafProps {
  leaf: LeafType
}

const Element = ({ attributes, children, element }: ElementProps) => {
  switch (element.type) {
    case 'block-quote':
      return <blockquote {...attributes}>{children}</blockquote>
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>
    case 'heading-one':
      return <h1 {...attributes}>{children}</h1>
    case 'heading-two':
      return <h2 {...attributes}>{children}</h2>
    case 'heading-three':
      return <h3 {...attributes}>{children}</h3>
    case 'heading-four':
      return <h4 {...attributes}>{children}</h4>
    case 'heading-five':
      return <h5 {...attributes}>{children}</h5>
    case 'heading-six':
      return <h6 {...attributes}>{children}</h6>
    case 'list-item':
      return <li {...attributes}>{children}</li>
    case 'code-block':
      return (
        <pre className={'codeblock'}>
          <code {...attributes}>{children}</code>
        </pre>
      )
    default:
      return <p {...attributes}>{children}</p>
  }
}

const Leaf = ({ attributes, children, leaf }: LeafProps) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.code) {
    children = <code>{children}</code>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  return <span {...attributes}>{children}</span>
}

const initialValue: Descendant[] = [
  {
    type: ElementType.Paragraph,
    children: [
      {
        text: 'The editor gives you full control over the logic you can add. For example, it\'s fairly common to want to add markdown-like shortcuts to editors. So that, when you start a line with "> " you get a blockquote that looks like this:',
      },
    ],
  },
  {
    type: ElementType.BlockQuote,
    children: [{ text: 'A wise quote.' }],
  },
  {
    type: ElementType.Paragraph,
    children: [
      {
        text: 'Order when you start a line with "## " you get a level-two heading, like this:',
      },
    ],
  },
  {
    type: HeadingType.Two,
    children: [{ text: 'Try it out!' }],
  },
  {
    type: ElementType.Paragraph,
    children: [
      {
        text: 'Try it out for yourself! Try starting a new line with ">", "-", or "#"s.',
      },
    ],
  },
]

export { Toolbars }

export default SliteEditor
