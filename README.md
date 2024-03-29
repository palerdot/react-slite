## react-slite

> `SL`ack `I`nspired `T`ext `E`diting

This react component **aims** to provide a slack like rich text editing experience powered by [lexical library](https://lexical.dev). This project is currently in alpha stage and used internally for [Remindoro extension](https://palerdot.in/remindoro).

NOTE: Starting `v0.2.0`, `react-slite` is powered by [lexical](https://github.com/facebook/lexical). Right now, it is just a thin wrapper around vanilla lexical functionality. As lexical becomes more stable and moves towards `v1.x`, this library will become more feature complete. Till then, apis are subject to change.

### Usage

```javascript
import Slite, { Toolbar, Editor, SliteProps, ThemeClassList, SLITE_EDITOR_CONTAINER_CLASS } from '../index'

function SliteWrapper({ initialValue, onChange, readOnly }: SliteProps) {
  return (
    <Slite
      initialValue={`your initial markdown string`}
      onChange={(currentMarkdown) => {}}
      readOnly={false}
    >
      {/* decide if and how you want to display the toolbar */}
      {!readOnly && <Toolbar />}
      {/* editor text area */}
      <Editor readOnly={readOnly} />
    </Slite>
  )
}

// ThemeClassList has all the classes used within the rich text editor
// SLITE_EDITOR_CONTAINER_CLASS exports the container class name, which is `slite-container`
// With this info, theming can be done via classes
```
For more examples, please run `pnpm run storybook` in the repo.


