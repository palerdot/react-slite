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
