import React, { Component } from 'react';
// material UI
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import './style.scss';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import { linkTo } from '../../../../helpers/routeHelpers';
import { SUBMIT_YOUR_SPACE_START_SCREEN } from '../../../../constants/routes';
import * as hostProfileActions from '../../../../store/actions/hostProfileActions';
import * as myProfileActions from '../../../../store/actions/myProfileActions';
// components
import MyLocationsItems from './locationItem';

@connect(
  state => ({
    profileSearchLocations:
      state.hostProfileSearchReduser.profileSearchLocations,
    locations: state.hostProfileLocationsReducer.locations,
  }),
  dispatch => ({
    actions: bindActionCreators(hostProfileActions, dispatch),
    actionsTenantProfile: bindActionCreators(myProfileActions, dispatch),
  }),
)
class MyLocations extends Component {
  state = {
    statusStatus: 'All',
    statusName: 'All',
  };

  handleChangeName = event => {
    this.setState({
      statusName: event.target.value,
    });
  };

  handleChangeStatus = event => {
    this.setState({
      statusStatus: event.target.value,
    });
  };

  itemsRender = () => {
    const { locations } = this.props;

    if (locations === undefined) {
      return (
        <div className="circular_progress_wrapper">
          <CircularProgress color="secondary" />
        </div>
      );
    }

    if (locations.length === 0) {
      return (
        <ul className="ul_content ul_content_requests no_scrole">
          <p className="empty_list_in_requests"> List is empty </p>
        </ul>
      );
    }

    let className = 'ul_content';

    if (locations.length <= 5) {
      className = `${className} ul_without_scroll`;
    }

    return (
      <ul className={`${className}`}>
        {locations.map((item, index, arr) => {
          return (
            <MyLocationsItems
              key={item.id}
              id={item.id}
              index={index + 1}
              locationName={item.name}
              status={item.status}
              statusActive={this.state.statusStatus}
            />
          );
        })}
      </ul>
    );
  };

  componentWillMount() {
    this.props.actions.getLocations();
    this.props.actions.getRequestsList();
  }

  render() {
    return (
      <div className="my_locations_host_wrapper">
        <ul className="ul_header">
          <li className="li_id">ID</li>
          <li className="li_selects">
            <FormControl className="invisible">
              <InputLabel htmlFor="age-native-simple invisible" />
              <Select
                value={this.state.statusName}
                onChange={this.handleChangeName}
                className="select_in_requests"
                id="select_in_requests"
              >
                <MenuItem selected className="options_in_requests" value="All">
                  {' '}
                  All
                </MenuItem>
                <MenuItem className="options_in_requests" value="pending">
                  Pending
                </MenuItem>
                <MenuItem className="options_in_requests" value="upcoming">
                  Upcoming
                </MenuItem>
                <MenuItem className="options_in_requests" value="past">
                  Past
                </MenuItem>
              </Select>
            </FormControl>
          </li>
          <li className="li_selects">
            <FormControl className="">
              <InputLabel htmlFor="age-native-simple" />
              <Select
                value={this.state.statusStatus}
                onChange={this.handleChangeStatus}
                className="select_in_requests select_in_hosts_my_locations"
                id="select_in_requests"
              >
                <MenuItem selected className="options_in_requests" value="All">
                  {' '}
                  All
                </MenuItem>
                <MenuItem className="options_in_requests" value="pending">
                  Pending
                </MenuItem>
                <MenuItem className="options_in_requests" value="active">
                  Active
                </MenuItem>
                <MenuItem className="options_in_requests" value="blocked">
                  Blocked
                </MenuItem>
              </Select>
            </FormControl>
          </li>
          <li className="li_button_in_host_profile">
            <Button
              variant="contained"
              color="secondary"
              onClick={() => linkTo(SUBMIT_YOUR_SPACE_START_SCREEN)}
              className="submit_location_button"
            >
              Upload new location
            </Button>
          </li>
        </ul>
        <Divider />

        {this.itemsRender()}
      </div>
    );
  }
}

export default MyLocations;
