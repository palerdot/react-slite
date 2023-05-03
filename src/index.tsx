import Editor, { SliteProps } from './Editor'
import './styles.css'

import ThemeClassList, {
  SLITE_EDITOR_CONTAINER_CLASS,
} from './themes/DefaultTheme'

export { ThemeClassList, SLITE_EDITOR_CONTAINER_CLASS }

function Slite({ initialValue, onChange, readOnly }: SliteProps) {
  return (
    <div>
      <Editor
        initialValue={initialValue}
        onChange={onChange}
        readOnly={readOnly}
      />
    </div>
  )
}

export default Slite
