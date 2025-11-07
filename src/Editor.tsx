import { defineExtension, configExtension } from 'lexical'

import { RichTextExtension } from '@lexical/rich-text'
import { AutoFocusExtension } from '@lexical/extension'
import { ListExtension } from '@lexical/list'
import { LexicalExtensionComposer } from '@lexical/react/LexicalExtensionComposer'
import { ReactExtension } from '@lexical/react/ReactExtension'

import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { ListItemNode, ListNode } from '@lexical/list'
import { CodeHighlightNode, CodeNode } from '@lexical/code'
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

export interface SliteProps {
  initialValue?: string
  onChange: (text: string) => void
  readOnly?: boolean
  children: React.ReactNode
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

const getExtensionConfig = (initialValue: string, editable: boolean) => {
  const appExtension = defineExtension({
    name: 'ReactSlite',
    namespace: 'ReactSlite',
    dependencies: [
      AutoFocusExtension,
      RichTextExtension,
      ListExtension,
      configExtension(ReactExtension, { contentEditable: null }),
    ],
    $initialEditorState: () => {
      // ref: https://stackoverflow.com/a/72172529/1410291
      // ref: https://github.com/facebook/lexical/issues/2308#issuecomment-1382721253
      if (initialValue === '') {
        const paragraph = $createParagraphNode()
        $getRoot().append(paragraph)
        paragraph.select()
      } else {
        $convertFromMarkdownString(initialValue, TRANSFORMERS)
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
    editable,
  })

  // ref: https://lexical.dev/docs/extensions/react
  return appExtension
}

export function Editor({ readOnly }: { readOnly: SliteProps['readOnly'] }) {
  const placeholderText = 'Enter some rich text...'
  return (
    <div className="editor-inner">
      <ContentEditable
        readOnly={readOnly}
        className="editor-input"
        aria-placeholder={placeholderText}
        placeholder={
          <div className="editor-placeholder">{placeholderText}</div>
        }
      />
      <CodeHighlightPlugin />
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
    <LexicalExtensionComposer
      extension={getExtensionConfig(initialValue || '', editable)}
      contentEditable={null}
    >
      <div className={SLITE_EDITOR_CONTAINER_CLASS}>
        {editable && (
          <OnChangePlugin
            onChange={editorState => onChangeHandler(editorState, onChange)}
          />
        )}
        {editable && <MarkdownShortcutPlugin transformers={TRANSFORMERS} />}
        {children}
      </div>
    </LexicalExtensionComposer>
  )
}

export { ToolbarPlugin }
