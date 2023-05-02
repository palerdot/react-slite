import Editor, { SliteProps } from './Editor'
import './styles.css'

function Slite({ initialText, onChange }: SliteProps) {
  return (
    <div>
      <Editor initialText={initialText} onChange={onChange} />
    </div>
  )
}

export default Slite
