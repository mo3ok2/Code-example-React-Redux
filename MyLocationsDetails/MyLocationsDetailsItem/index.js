import React, { Component, Fragment } from 'react';
import Divider from '@material-ui/core/Divider';

class MyLocationsDetailsItem extends Component {
  render() {
    const { name, description, startDate, endDate, status, cost } = this.props;

    return (
      <Fragment>
        <li>
          <div>
            <p>{status}</p>
            <p className="bold">
              {startDate} - {endDate}
            </p>
          </div>
          <div>
            <p>{name}</p>
            <p className="bold">${cost.toLocaleString('en')}</p>
          </div>
          <div>
            <p>{description}</p>
          </div>
        </li>
        <Divider />
      </Fragment>
    );
  }
}

export default MyLocationsDetailsItem;
