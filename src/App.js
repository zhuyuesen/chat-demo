import React from 'react';
import { ApolloProvider } from '@apollo/client';
import apolloClient from './apollo/client';
import ChatDemo from './components/ChatDemo';
import './App.css';

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <div className="App">
        <ChatDemo />
      </div>
    </ApolloProvider>
  );
}

export default App;