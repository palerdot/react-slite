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

import { Leaf as LeafType, Mark, FormatType } from './utils/custom-types'
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
  initialValue: Descendant[]
  onChange: (newValue: Descendant[]) => void
  children: React.ReactNode
}

function Slite({ initialValue, onChange, children }: Props) {
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
        onChange={(value) => {
          setValue(value)
          // update onchange handler with new value
          onChange(value)
        }}
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
    case FormatType.CodeBlock:
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

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.code) {
    children = <code>{children}</code>
  }

  return <span {...attributes}>{children}</span>
}

export { Toolbars }

export default Slite
