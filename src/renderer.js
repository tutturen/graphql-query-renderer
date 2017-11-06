import React from 'react';
import PropTypes from 'prop-types';
import shallowEqual from './shallowEqual';
import { GraphQLClient } from 'graphql-request';

class GraqhqlRenderer extends React.Component {
  static propTypes = {
    endpoint: PropTypes.string.isRequired,
    query: PropTypes.string.isRequired,
    variables: PropTypes.any,
    headers: PropTypes.any,
    children: PropTypes.func,
  };

  static defaultProps = {
    variables: {},
  };

  state = {
    isFetching: true,
    data: null,
    error: null,
  };

  componentDidMount() {
    this.dispatch();
  }

  componentWillReceiveProps(nextProps) {
    if (
      shallowEqual(nextProps.query, this.props.query) &&
      shallowEqual(nextProps.variables, this.props.variables) &&
      shallowEqual(nextProps.endpoint, this.props.endpoint)
    ) {
      return;
    }
    this.dispatch(nextProps);
  }

  componentWillUnmount() {
    this.willUnmount = true;
  }

  dispatch = (props = this.props) => {
    this.setState({ isFetching: true, error: null });

    const headers =
      typeof props.headers === 'function' ? props.headers() : props.headers;

    const client = new GraphQLClient(props.endpoint, {
      headers,
    });

    return client
      .request(props.query, props.variables)
      .then(data => {
        if (this.willUnmount) {
          return;
        }
        this.setState({
          isFetching: false,
          data,
        });
      })
      .catch(error => {
        if (this.willUnmount) {
          return;
        }
        this.setState({
          isFetching: false,
          error,
        });
      });
  };

  render() {
    if (!this.props.children) {
      return null;
    }
    return (
      this.props.children({
        isFetching: this.state.isFetching,
        data: this.state.data,
        error: this.state.error,
        dispatch: this.dispatch,
      }) || null
    );
  }
}

export default GraqhqlRenderer;
