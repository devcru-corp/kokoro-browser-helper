import React from 'react';
import ReactDOM from 'react-dom';

const Popup = () => {
  return (
    <div>
      <h1>Hello from Chrome Extension Popup</h1>
      <p>This is a boilerplate using React.</p>
    </div>
  );
};

ReactDOM.render(<Popup />, document.getElementById('root'));
