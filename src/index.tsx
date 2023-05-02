import Editor, { SliteProps } from './Editor'
import './styles.css'

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
