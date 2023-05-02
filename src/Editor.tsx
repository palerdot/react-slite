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
} from '@lexical/markdown'
import { $createParagraphNode, $getRoot } from 'lexical'

import ToolbarPlugin from './plugins/ToolbarPlugin'
import ListMaxIndentLevelPlugin from './plugins/ListMaxIndentLevelPlugin'
import CodeHighlightPlugin from './plugins/CodeHighlightPlugin'
import DefaultTheme, {
  SLITE_EDITOR_CONTAINER_CLASS,
} from './themes/DefaultTheme'

import type { EditorState } from 'lexical'
import type { InitialConfigType } from '@lexical/react/LexicalComposer'

export interface SliteProps {
  initialText?: string
  onChange: (text: string) => void
  readOnly?: boolean
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

const getInitialConfig = (
  initialText: string,
  editable: boolean
): InitialConfigType => {
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
    editable,
  }
}

export default function Editor({
  initialText,
  onChange,
  readOnly,
}: SliteProps) {
  const editable = !readOnly

  return (
    <LexicalComposer
      initialConfig={getInitialConfig(initialText || '', editable)}
    >
      {editable ? (
        <OnChangePlugin
          onChange={editorState => onChangeHandler(editorState, onChange)}
        />
      ) : (
        ''
      )}
      <div className={SLITE_EDITOR_CONTAINER_CLASS}>
        {editable && <ToolbarPlugin />}
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <AutoFocusPlugin />
          <CodeHighlightPlugin />
          <ListPlugin />
          <ListMaxIndentLevelPlugin maxDepth={1} />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        </div>
      </div>
    </LexicalComposer>
  )
}
