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

// helper function to insert soft line breaks in markdown to preserve new line/paragraph
// adds a trailing slash -> 'LINE_BREAK_FIX' transformer
export function insertSoftLineBreaks(input: string): string {
  const NEW_LINE = '\n\n'
  const SOFT_BREAK = '\n\\\n'
  return input.split(NEW_LINE).join(SOFT_BREAK)
}

// remove trailing slash from the exported markdown
export function removeSoftLineBreaks(input: string): string {
  return input.split('\\\n').join('\n')
}
