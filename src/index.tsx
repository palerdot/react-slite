import LexicalWrapper, { SliteProps, Editor, ToolbarPlugin } from './Editor'
import './styles.css'

import ThemeClassList, {
  SLITE_EDITOR_CONTAINER_CLASS,
} from './themes/DefaultTheme'

export {
  ThemeClassList,
  SLITE_EDITOR_CONTAINER_CLASS,
  Editor,
  ToolbarPlugin as Toolbar,
}

export type { SliteProps }

function Slite({ initialValue, onChange, readOnly, children }: SliteProps) {
  return (
    <div>
      <LexicalWrapper
        initialValue={initialValue}
        onChange={onChange}
        readOnly={readOnly}
      >
        {children}
      </LexicalWrapper>
    </div>
  )
}

export default Slite
