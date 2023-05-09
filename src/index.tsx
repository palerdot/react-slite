import LexicalWrapper, { SliteProps, Editor, ToolbarPlugin } from './Editor'
import './styles.css'

import ThemeClassList, {
  SLITE_EDITOR_CONTAINER_CLASS,
  SLITE_DROPDOWN_CLASS,
} from './themes/DefaultTheme'

export {
  ThemeClassList,
  SLITE_EDITOR_CONTAINER_CLASS,
  SLITE_DROPDOWN_CLASS,
  Editor,
  ToolbarPlugin as Toolbar,
}

export type { SliteProps }

function Slite({ initialValue, onChange, readOnly, children }: SliteProps) {
  return (
    <LexicalWrapper
      initialValue={initialValue}
      onChange={onChange}
      readOnly={readOnly}
    >
      {children}
    </LexicalWrapper>
  )
}

export default Slite

const isBlockQuote = (input: string) => {
  return input.startsWith('> ')
}

const isCodeBlockStart = (input: string) => {
  return input.startsWith('```')
}
const isCodeBlockEnd = (input: string) => {
  return input.endsWith('```')
}

// helper function to insert soft line breaks in markdown to preserve new line/paragraph
// adds a trailing slash -> 'LINE_BREAK_FIX' transformer
export function insertSoftLineBreaks(input: string): string {
  const NEW_LINE = '\n\n'
  const SOFT_BREAK = '\n\\\n'

  const splitted = input.split(NEW_LINE)
  const mapped: Array<string> = []

  let isActiveCodeBlock = false

  splitted.forEach(s => {
    mapped.push(s)

    if (isCodeBlockStart(s)) {
      isActiveCodeBlock = true
    }
    if (isCodeBlockEnd(s)) {
      isActiveCodeBlock = false
    }

    if (isBlockQuote(s.trim())) {
      mapped.push(NEW_LINE)
    } else if (isActiveCodeBlock) {
      mapped.push(NEW_LINE)
    } else {
      mapped.push(SOFT_BREAK)
    }
  })

  return mapped.join('')
}

// remove trailing slash from the exported markdown
export function removeSoftLineBreaks(input: string): string {
  const DOUBLE_LINE = '\n\n'
  const splitted = input.split('\\\n')
  // hack to remove extra new lines inserted by lexical
  const mapped = splitted.map(s => {
    // if there is a double new line in between we will trim into a single new line
    if (
      !s.startsWith(DOUBLE_LINE) &&
      !s.endsWith(DOUBLE_LINE) &&
      // and if it has a double line in between text nodes we will convert it
      s.includes(DOUBLE_LINE) &&
      // we will not touch the lines with code block
      !s.includes('```') &&
      // we will not touch block quote
      !s.includes('> ')
    ) {
      return s.replaceAll(DOUBLE_LINE, '\n')
    }

    return s
  })

  return mapped.join('\n')
}
