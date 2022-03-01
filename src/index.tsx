import React, {
  useState,
  useCallback,
  useMemo,
  useContext,
  createContext,
  KeyboardEvent,
} from 'react'
import {
  Slate,
  Editable,
  withReact,
  RenderElementProps,
  RenderLeafProps,
} from 'slate-react'
import { createEditor, Descendant } from 'slate'
import { withHistory } from 'slate-history'
import isHotkey from 'is-hotkey'

import {
  ElementType,
  HeadingType,
  Leaf as LeafType,
  Mark,
} from './utils/custom-types'
import { toggleMark, Toolbars } from './components/'
import { handleCodeBlockHighlight, CodeStatus, withShortcuts } from './utils/'

type SliteContextValue = {
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void
}

const defaultContextValue: SliteContextValue = {
  onKeyDown: (event) => {
    console.log('porumai ... default keydown ???', event)
  },
}

const SliteContext = createContext(defaultContextValue)

const HOTKEYS: { [key: string]: keyof Mark } = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+`': 'code',
}

const renderElement = (props: RenderElementProps) => <Element {...props} />
const renderLeaf = (props: RenderLeafProps) => <Leaf {...props} />

export function Editor() {
  const { onKeyDown } = useContext(SliteContext)

  return (
    <Editable
      renderElement={renderElement}
      renderLeaf={renderLeaf}
      placeholder="Write some markdown..."
      spellCheck
      autoFocus
      onKeyDown={onKeyDown}
    />
  )
}

type Props = {
  children: React.ReactNode
}

function Slite({ children }: Props) {
  const [value, setValue] = useState<Descendant[]>(initialValue)
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
    <SliteContext.Provider
      value={{
        onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
          for (const hotkey in HOTKEYS) {
            if (isHotkey(hotkey, event as any)) {
              event.preventDefault()
              const mark = HOTKEYS[hotkey]
              toggleMark(editor, mark)
            }
          }

          // handle '``' double backtick for inline code handling
          handleInlineCode(event)
        },
      }}
    >
      <Slate
        editor={editor}
        value={value}
        onChange={(value) => setValue(value)}
      >
        {children}
      </Slate>
    </SliteContext.Provider>
  )
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

export default Slite
