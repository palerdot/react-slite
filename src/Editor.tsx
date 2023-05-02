import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { ListItemNode, ListNode } from '@lexical/list'
import { CodeHighlightNode, CodeNode } from '@lexical/code'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table'
import { AutoLinkNode, LinkNode } from '@lexical/link'
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin'
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS,
} from '@lexical/markdown'
import { $createParagraphNode, $getRoot } from 'lexical'

import ToolbarPlugin from './plugins/ToolbarPlugin'
import ListMaxIndentLevelPlugin from './plugins/ListMaxIndentLevelPlugin'
import CodeHighlightPlugin from './plugins/CodeHighlightPlugin'
import DefaultTheme from './themes/DefaultTheme'

import type { EditorState } from 'lexical'

export interface SliteProps {
  initialText?: string
  onChange: (text: string) => void
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
    const markdown = $convertToMarkdownString(TRANSFORMERS)
    onChange(markdown)
  })
}

const getInitialConfig = (initialText: string) => {
  return {
    editorState: () => {
      // ref: https://stackoverflow.com/a/72172529/1410291
      // ref: https://github.com/facebook/lexical/issues/2308#issuecomment-1382721253
      if (initialText === '') {
        const paragraph = $createParagraphNode()
        $getRoot().append(paragraph)
        paragraph.select()
      } else {
        $convertFromMarkdownString(initialText, TRANSFORMERS)
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
    ],
    namespace: '',
  }
}

export default function Editor({ initialText, onChange }: SliteProps) {
  return (
    <LexicalComposer initialConfig={getInitialConfig(initialText || '')}>
      <OnChangePlugin
        onChange={editorState => onChangeHandler(editorState, onChange)}
      />
      <div className="slite-editor-container">
        <ToolbarPlugin />
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <CodeHighlightPlugin />
          <ListPlugin />
          <LinkPlugin />
          <ListMaxIndentLevelPlugin maxDepth={1} />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        </div>
      </div>
    </LexicalComposer>
  )
}
