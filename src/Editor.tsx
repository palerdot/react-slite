import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { ListItemNode, ListNode } from '@lexical/list'
import { CodeHighlightNode, CodeNode } from '@lexical/code'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table'
import { AutoLinkNode, LinkNode } from '@lexical/link'
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin'
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS,
  TextMatchTransformer,
} from '@lexical/markdown'
import {
  $createParagraphNode,
  $getRoot,
  $isLineBreakNode,
  LineBreakNode,
  $createTextNode,
} from 'lexical'

import ToolbarPlugin from './plugins/ToolbarPlugin'
import ListMaxIndentLevelPlugin from './plugins/ListMaxIndentLevelPlugin'
import CodeHighlightPlugin from './plugins/CodeHighlightPlugin'
import DefaultTheme, {
  SLITE_EDITOR_CONTAINER_CLASS,
} from './themes/DefaultTheme'

import type { EditorState } from 'lexical'
import type { InitialConfigType } from '@lexical/react/LexicalComposer'

const LINE_BREAK_FIX: TextMatchTransformer = {
  dependencies: [LineBreakNode],
  export: node => {
    if (!$isLineBreakNode(node)) return null
    return '\\\n'
  },
  regExp: /\\$/,
  importRegExp: /\\$/,
  replace: textNode => {
    if (!textNode?.getParent()) return
    textNode.replace($createTextNode())
  },
  trigger: '',
  type: 'text-match',
}

export const SLITE_TRANSFORMERS = [...TRANSFORMERS, LINE_BREAK_FIX]

export interface SliteProps {
  initialValue?: string
  onChange: (text: string) => void
  readOnly?: boolean
  children: React.ReactNode
}

function Placeholder() {
  return <div className="editor-placeholder">{'Enter some rich text ...'}</div>
}

// ref: https://stackoverflow.com/questions/71976652/with-lexical-how-do-i-set-default-initial-text
const onChangeHandler = (
  editorState: EditorState,
  onChange: SliteProps['onChange']
) => {
  editorState.read(() => {
    const markdown = $convertToMarkdownString(SLITE_TRANSFORMERS)
    onChange(markdown)
  })
}

const getInitialConfig = (
  initialValue: string,
  editable: boolean
): InitialConfigType => {
  return {
    editorState: () => {
      // ref: https://stackoverflow.com/a/72172529/1410291
      // ref: https://github.com/facebook/lexical/issues/2308#issuecomment-1382721253
      if (initialValue === '') {
        const paragraph = $createParagraphNode()
        $getRoot().append(paragraph)
        paragraph.select()
      } else {
        $convertFromMarkdownString(initialValue, SLITE_TRANSFORMERS)
      }
    },
    // The editor theme
    theme: DefaultTheme,
    // Handling of errors during update
    onError(error: Error) {
      throw error
    },
    // Any custom nodes go here
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      AutoLinkNode,
      LinkNode,
      LineBreakNode,
    ],
    namespace: '',
    editable,
  }
}

export function Editor({ readOnly }: { readOnly: SliteProps['readOnly'] }) {
  return (
    <div className="editor-inner">
      <RichTextPlugin
        contentEditable={<ContentEditable className="editor-input" />}
        placeholder={readOnly ? null : <Placeholder />}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <AutoFocusPlugin />
      <CodeHighlightPlugin />
      <ListPlugin />
      <ListMaxIndentLevelPlugin maxDepth={1} />
    </div>
  )
}

Editor.defaultProps = {
  readOnly: false,
}

export default function LexicalWrapper({
  initialValue,
  onChange,
  readOnly,
  children,
}: SliteProps) {
  const editable = !readOnly

  return (
    <LexicalComposer
      initialConfig={getInitialConfig(initialValue || '', editable)}
    >
      <div className={SLITE_EDITOR_CONTAINER_CLASS}>
        {editable && (
          <OnChangePlugin
            onChange={editorState => onChangeHandler(editorState, onChange)}
          />
        )}
        {editable && (
          <MarkdownShortcutPlugin transformers={SLITE_TRANSFORMERS} />
        )}
        {children}
      </div>
    </LexicalComposer>
  )
}

export { ToolbarPlugin }
