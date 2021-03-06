import React from 'react';
import { Navigation } from './navigation';

class Page extends React.Component {
  render() {
    return (
      <div>
        <div className='bg-gray-faint scroll-auto viewport-full-mm w180-mm fixed-mm top left flex-parent-mm flex-parent--stretch-cross-mm'>
          <Navigation navData={this.props.navData} />
        </div>
        <div className='ml180-mm wmax1200 pl24 pr24 pl48-mm pr48-mm mb72 mt24'>
          {this.props.children}
        </div>
      </div>
    );
  }
}

Page.propTypes = {
  children: React.PropTypes.node.isRequired,
  navData: React.PropTypes.object.isRequired
};


export { Page };
