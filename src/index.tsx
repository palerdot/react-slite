import Editor, { SliteProps } from './Editor'
import './styles.css'

import ThemeClassList, {
  SLITE_EDITOR_CONTAINER_CLASS,
} from './themes/DefaultTheme'

export { ThemeClassList, SLITE_EDITOR_CONTAINER_CLASS }

function Slite({ initialText, onChange, readOnly }: SliteProps) {
  return (
    <div>
      <Editor
        initialText={initialText}
        onChange={onChange}
        readOnly={readOnly}
      />
    </div>
  )
}

export default Slite
