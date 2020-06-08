import React, { Component } from 'react'
import Map from './Map'
import { initStore } from './redux/store'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './redux/configureStore'

// const store = initStore()

class App extends Component {
  state = {
  }
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Map/>
        </PersistGate>
      </Provider>
    )
  }
}
export default App;
