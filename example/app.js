'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { StyleRoot } from 'radium';
import { Treebeard, decorators } from '../src/index';

import data from './data';
import styles from './styles';
import * as filters from './filter';

const HELP_MSG = 'Select A Node To See Its Data Structure Here...';

// Example: Customising The Header Decorator To Include Icons
decorators.Header = ({ style, node }) => {
  /* const iconType = node.children ? 'folder' : 'file-text';
    const iconClass = `fa fa-${iconType}`;
    const iconStyle = {marginRight: '5px'};

    <i className={iconClass} style={iconStyle}/>*/
  return (
    <div style={style.base}>
      <div style={style.title}>

        {node.name}
      </div>
    </div>
  );
};

class NodeViewer extends React.Component {
  render() {
    const style = styles.viewer;
    let json = JSON.stringify(this.props.node, null, 4);

    if (!json) {
      json = HELP_MSG;
    }

    return <div style={style.base}>{json}</div>;
  }
}
NodeViewer.propTypes = {
  node: PropTypes.object
};

class DemoTree extends React.Component {
  constructor() {
    super();

    this.state = { data };
    this.state.visibility = false;
    this.onToggle = this.onToggle.bind(this);
  }

  onToggle(node, toggled) {
    const { cursor } = this.state;

    if (cursor) {
      cursor.active = false;
    }

    node.active = true;
    if (node.children && node.children.length > 0) {
      node.toggled = toggled;
    }

    this.setState({ cursor: node });
  }

  toggleVis() {
    this.setState({ visibility: !this.state.visibility });
  }

  onFilterMouseUp(e) {
    const filter = e.target.value.trim();
    if (!filter) {
      return this.setState({ data });
    }
    var filtered = filters.filterTree(data, filter);
    filtered = filters.expandFilteredNodes(filtered, filter);
    this.setState({ data: filtered });
  }

  render() {
    const { data: stateData, cursor } = this.state;
    /*
        <span className="input-group-addon">
          <i className="fa fa-search"/>
        </span>
        */

    return (
      <div>
        <button onClick={this.toggleVis.bind(this)} style={{ textAlign: 'left', width: '100%', color: 'black', backgroundColor: 'white', border: '1px solid #7a7a7a' }}>
          {cursor !== undefined ? cursor.name : 'Nothing'}
        </button>
        {this.state.visibility
          ? <StyleRoot
              style={{
                position: 'absolute',
                backgroundColor: 'white',
                maxHeight: '300px',
                width: '400px',
                overflowY: 'scroll'
              }}
            >
              <div style={styles.searchBox}>
                <div className="input-group" style={{ width: '100%' }}>
                  <input
                    className="form-control"
                    onKeyUp={this.onFilterMouseUp.bind(this)}
                    placeholder="Search the tree..."
                    type="text"
                  />
                </div>
              </div>
              <div style={styles.component}>
                <Treebeard
                  data={stateData}
                  decorators={decorators}
                  onToggle={this.onToggle}
                />
              </div>
              <div style={styles.component}>
                <NodeViewer node={cursor} />
              </div>
            </StyleRoot>
          : null}
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </div>
    );
  }
}

const content = document.getElementById('content');
ReactDOM.render(<DemoTree />, content);
