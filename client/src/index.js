import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import web3Obj from './helper'

const isTorus = sessionStorage.getItem('pageUsingTorus')

if (isTorus === 'true') {
  import('@toruslabs/torus-embed').then(() => {
    console.log('rehydrated Torus')
    web3Obj.setweb3()
    // set store accounts from here ideally
  })
}
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

ReactDOM.render(<App />, document.getElementById('root'));

