# graphql-query-renderer
A minimalistic container for rendering GraphQL data in React.

## Installation

### with npm

```npm install --save graphql-query-renderer```

### with yarn

```yarn add graphql-query-renderer```

## Usage example

```javascript
import React from 'react';
import GraphqlQueryRenderer from 'graphql-query-renderer';

const GRAPHQL_ENDPOINT = 'https://graphql-pokemon.now.sh/';

const query = `
  query GetPokemon($name: String!) {
    pokemon(name: $name) {
      name
      number
      maxHP
    }
  }
`;

const variables = {
  name: 'bulbasaur',
};

class PokemonPage extends React.Component {
  render() {
    return (
      <GraphqlQueryRenderer query={query} variables={variables} endpoint={GRAPHQL_ENDPOINT}>
        {({ isFetching, data, error }) => {
          if (isFetching) {
            return <div>Loading</div>;
          }
          if (error) {
            return <div>Error</div>;
          }
          return (
            <div>
              <div>
                <span>Number: </span>
                <span>{data.pokemon.number}</span>
              </div>
              <div>
                <span>Name: </span>
                <span>{data.pokemon.name}</span>
              </div>
              <div>
                <span>Max HP: </span>
                <span>{data.pokemon.maxHP}</span>
              </div>
            </div>
          );
        }}
      </GraphqlQueryRenderer>
    );
  }
}

export default PokemonPage;
```
