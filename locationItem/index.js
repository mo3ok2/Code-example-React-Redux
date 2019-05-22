import React, { Component, Fragment } from 'react';
import Divider from '@material-ui/core/Divider';
import { NavLink } from 'react-router-dom';
import { HOST_MY_PROFILE_LOCATIONS_DETAILS } from '../../../../../constants/routes';

class MyLocationsItems extends Component {
  render() {
    const { id, locationName, status, statusActive, index } = this.props;

    if (statusActive.toUpperCase() == status.toUpperCase()) {
      return (
        <Fragment>
          <li className="li_content li_booking">
            <NavLink to={HOST_MY_PROFILE_LOCATIONS_DETAILS(id)}>
              <ul>
                <li className="id_li">{index}</li>
                <li className="location_li">{locationName}</li>
                <li className={`${status}-location-status`}>{status}</li>
              </ul>
            </NavLink>
          </li>
          <Divider />
        </Fragment>
      );
    }
    if (statusActive.toUpperCase() == 'ALL') {
      return (
        <Fragment>
          <li className="li_content li_booking">
            <NavLink to={HOST_MY_PROFILE_LOCATIONS_DETAILS(id)}>
              <ul>
                <li className="id_li">{index}</li>
                <li className="location_li">{locationName}</li>
                <li className={`${status}-location-status`}>{status}</li>
              </ul>
            </NavLink>
          </li>
          <Divider />
        </Fragment>
      );
    }
    return null;
  }
}

export default MyLocationsItems;
