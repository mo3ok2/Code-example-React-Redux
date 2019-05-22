import React, { Component, Fragment } from 'react';
import './style.scss';
import moment from 'moment';
import keycode from 'keycode';
import isArray from 'lodash/isArray';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
// material UI
import FormHelperText from '@material-ui/core/FormHelperText/FormHelperText';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import * as hostProfileActions from '../../../../../store/actions/hostProfileActions';
import {
  HOST_MY_PROFILE_LOCATIONS_EDIT_DETAILS_WITH_ID,
  PROFILE,
} from '../../../../../constants/routes';
import { linkTo } from '../../../../../helpers/routeHelpers';
import Calendar from '../../../../Common/Calendar';

// components
import PageTemplate from '../../../PageTemplate';
import MyLocationsDetailsItem from './MyLocationsDetailsItem';
import SliderView from './slickSliderView';
import { reduceCalendarsDays } from '../../../../../helpers/general';

@connect(
  state => ({
    locationsDetail: state.hostProfileLocationsReducer.locationsDetail,
    date: state.hostProfileLocationsReducer.date,
  }),
  dispatch => ({
    actions: bindActionCreators(hostProfileActions, dispatch),
  }),
)
class MyLocationsDetails extends Component {
  state = {
    rangeDate: false,
    editWarning: false,
    editWarningMessage: false,
  };

  componentWillMount() {
    this.props.actions.getLocationsById(this.props.match.params.locationsId);
    this._subscribeToRangeDatePicker();
  }

  renderRequestsItems = requests => {
    if (requests.length === 0) {
      return <p className="empty_list_in_requests"> List is empty </p>;
    }
    return (
      <ul>
        {requests.map(item => {
          return (
            <MyLocationsDetailsItem
              item={item}
              key={item.booking.id}
              name={item.user.username}
              description={item.booking.note}
              cost={item.booking.price}
              endDate={moment(item.booking.endDate).format('MM/DD/YYYY LT')}
              startDate={moment(item.booking.startDate).format('MM/DD/YYYY LT')}
              date={item.booking.endDate}
              id={item.booking.id}
              status={item.booking.status}
            />
          );
        })}
      </ul>
    );
  };

  categoriesRender = locationsDetail => {
    return (
      <Fragment>
        {locationsDetail.categories.map((categories, index) => {
          return (
            <p key={index} className="categories_p_in_detail_locations">
              {categories.activityTitle} ({categories.price}$)
            </p>
          );
        })}
      </Fragment>
    );
  };

  nextButtonOnClickHender = () => {
    const { locationsDetail } = this.props;

    if (locationsDetail.isEditable) {
      linkTo(
        HOST_MY_PROFILE_LOCATIONS_EDIT_DETAILS_WITH_ID(
          this.props.match.params.locationsId,
        ),
      );
      this.setState({
        editWarning: false,
      });
    } else {
      this.setState({
        editWarning: true,
        editWarningMessage:
          'Sorry, you cannot change this location, because it was booked',
      });
    }
  };

  componentWillUnmount() {
    this._unsubscribeToRangeDatePicker();
  }

  _onRangeDatePickerHandler = e => {
    if (this.__isShiftKeyboard(e)) {
      this.__toggleRangeDatePickerHandler(e);
    }
  };

  _offRangeDatePickerHandler = e => {
    if (this.__isShiftKeyboard(e)) {
      this.__toggleRangeDatePickerHandler(e);
    }
  };

  __isShiftKeyboard = e => {
    return keycode(e) === 'shift';
  };

  __toggleRangeDatePickerHandler = e => {
    this.setState((state, props) => {
      if (e.shiftKey === state.selectRange) return;

      return {
        rangeDate: e.shiftKey,
      };
    });
  };

  _subscribeToRangeDatePicker = () => {
    window.addEventListener('keydown', this._onRangeDatePickerHandler);
    window.addEventListener('keyup', this._offRangeDatePickerHandler);
  };

  _unsubscribeToRangeDatePicker = () => {
    window.removeEventListener('keydown', this._onRangeDatePickerHandler);
    window.removeEventListener('keyup', this._offRangeDatePickerHandler);
  };

  render() {
    const initDetail = {
      space: {
        name: '',
        address: '',
        square: '',
        bedrooms: '',
        bathrooms: '',
        parkingPlaces: '',
      },
      categories: [
        {
          activityTitle: '',
          price: '',
        },
      ],
      requests: [],
      photos: [],
    };

    if (this.props.locationsDetail == undefined) {
      return (
        <div className="hosts_profile_locations_CircularProgress">
          <CircularProgress color="secondary" />
        </div>
      );
    }

    const { locationsDetail = initDetail, date } = this.props;
    const { rangeDate, editWarning, editWarningMessage } = this.state;
    let arrayWithApprovedDates = [];
    locationsDetail.requests.forEach(value => {
      if (value.booking.status === 'approved') {
        arrayWithApprovedDates = [...arrayWithApprovedDates, value];
      }
    });
    // debugger;
    return (
      <PageTemplate>
        <div className="locations_detail_page_wrapper">
          <div className="locations_detail_main">
            <div className="locations_detail_main_left">
              <h1>{locationsDetail.space.name}</h1>
              <div className="info">
                <p>City: {locationsDetail.space.city.title}</p>
                <p>Address: {locationsDetail.space.address}</p>
                <p>Size, sq ft: {locationsDetail.space.square}</p>
                <p>Status: {locationsDetail.space.status}</p>
                <p>Bedrooms: {locationsDetail.space.bedrooms}</p>
                <p>Bathrooms: {locationsDetail.space.bathrooms}</p>
                <p>Parking spaces: {locationsDetail.space.parkingPlaces}</p>
                <p>Categories: </p>
                {this.categoriesRender(locationsDetail)}
                {locationsDetail.space.about && (
                  <p className="about-space">
                    About space: {locationsDetail.space.about}
                  </p>
                )}
              </div>
              <div className="calendar">
                <h2>Booking calendar</h2>
                <Calendar
                  bookingDates={reduceCalendarsDays(arrayWithApprovedDates)}
                  // minDate={new Date()}
                  onChange={newDate => {
                    // TODO I think it have no sense to make calendare here
                    arrayWithApprovedDates;
                    // debugger
                    if (isArray(newDate)) {
                    } else {
                      arrayWithApprovedDates.forEach(({ booking, user }) => {
                        arrayWithApprovedDates;
                        // debugger
                      });
                    }

                    this.props.actions.selectDate(new Date()); //newDate was here
                  }}
                  selectRange={rangeDate}
                  tileClassName="calendar-item"
                  calendarType="US"
                  locale="en-EN"
                  value={date}
                />
              </div>
            </div>
            <div className="locations_detail_mail_right">
              <h2>Location Requests</h2>
              <div className="requests_list">
                {this.renderRequestsItems(locationsDetail.requests)}
              </div>
            </div>
          </div>
          <div className="slider_in_edit_locations_host">
            <SliderView imgList={locationsDetail.photos} />
          </div>
          <div className="button_edit_locations_wrapper">
            <Button
              className="button_edit_locations"
              variant="contained"
              onClick={() => linkTo(PROFILE)}
            >
              Back
            </Button>
            <Button
              className="button_edit_locations"
              variant="contained"
              onClick={() => this.nextButtonOnClickHender()}
            >
              Edit
            </Button>
          </div>
          <FormHelperText
            className={
              editWarning
                ? 'red login-sign-up-alert-visible'
                : 'login-sign-up-alert-hidden'
            }
          >
            {editWarningMessage}
          </FormHelperText>
        </div>
      </PageTemplate>
    );
  }
}

export default MyLocationsDetails;
