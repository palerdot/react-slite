import React from 'react';
import * as ReactDOM from 'react-dom';
import { Default as Slite } from '../stories/Thing.stories';

describe('Slite', () => {
  test('render without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Slite />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
