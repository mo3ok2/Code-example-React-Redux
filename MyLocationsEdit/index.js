import React, { Component, Fragment } from 'react';
import './style.scss';
// material UI
import FormHelperText from '@material-ui/core/FormHelperText/FormHelperText';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import MenuItem from '@material-ui/core/MenuItem';
import FormGroup from '@material-ui/core/FormGroup';
// components
import { bindActionCreators } from 'redux';
import connect from 'react-redux/es/connect/connect';
import PageTemplate from '../../../PageTemplate';

// redux
import * as locationsEditActions from '../../../../../store/actions/locationsEditActions';
import * as generalInfoActions from '../../../../../store/actions/generalInformationActions';
import * as homepageActions from '../../../../../store/actions/homePageActions';
import * as hostProfileActions from '../../../../../store/actions/hostProfileActions';
import { HOST_MY_PROFILE_LOCATIONS_DETAILS } from '../../../../../constants/routes';
import { linkTo } from '../../../../../helpers/routeHelpers';
import { NUMBER } from '../../../../../constants/regexps';

@connect(
  state => ({
    name: state.host_profile_losations_edit.name,
    address: state.host_profile_losations_edit.address,
    square: state.host_profile_losations_edit.square,
    about: state.host_profile_losations_edit.about,
    type: state.host_profile_losations_edit.type,
    status: state.host_profile_losations_edit.status,
    bedrooms: state.host_profile_losations_edit.bedrooms,
    bathrooms: state.host_profile_losations_edit.bathrooms,
    parking: state.host_profile_losations_edit.parking,
    from: state.host_profile_losations_edit.from,
    to: state.host_profile_losations_edit.to,

    activityList: state.homePage.activityList,
    allInterestsText: state.host_profile_losations_edit.allInterestsText,
    allInterestsSwitch: state.host_profile_losations_edit.allInterestsSwitch,
    anotherData: state.host_profile_losations_edit.anotherData,

    locationsDetail: state.hostProfileLocationsReducer.locationsDetail,
  }),
  dispatch => ({
    actions: bindActionCreators(locationsEditActions, dispatch),
    actionsGeneral: bindActionCreators(generalInfoActions, dispatch),
    actionsHome: bindActionCreators(homepageActions, dispatch),
    actionsProfile: bindActionCreators(hostProfileActions, dispatch),
  }),
)
class MyLocationsEdit extends Component {
  state = {
    file: {},
    imagePreviewUrl: [],
    allFiles: [],
    allNewFiles: [],
    idToDeleteState: [],
    editWarrning: false,
    editWarrningMessage: '',
    priceWarning: false,
    swithesWarning: false,
    inputWarning: false,
    emptyInput: false,
    emptyInputText: '',
  };

  numberValidation(value) {
    return NUMBER.test(value);
  }

  onClickSaveHendler = () => {
    const initiallocationsDetail = {
      space: {
        name: '',
        bathrooms: '',
        bedrooms: '',
        parkingPlaces: '',
        square: '',
        status: '',
        address: '',
      },
      photos: [],
    };

    const { allNewFiles } = this.state;

    const {
      locationsDetail = initiallocationsDetail,
      name = locationsDetail.space.name,
      address = locationsDetail.space.address,
      square = locationsDetail.space.square,
      about = locationsDetail.space.about,
      bathrooms = locationsDetail.space.bathrooms,
      bedrooms = locationsDetail.space.bedrooms,
      parking = locationsDetail.space.parkingPlaces,
      status = locationsDetail.space.status,
    } = this.props;

    const allIdToDeleteFromActivities = this.props.locationsDetail.categories
      .filter(item => item.checked === false)
      .map(item => item.activityId);
    const activeActivities = this.props.locationsDetail.categories.filter(
      item => item.checked !== false,
    );

    if (activeActivities.length === 0) {
      this.setState({ swithesWarning: true });
    } else if (
      activeActivities.find(
        item => !this.numberValidation(item.price) || item.price >= 999999,
      )
    ) {
      this.setState({ priceWarning: true });
    } else if (activeActivities.find(item => item.price === 0) !== undefined) {
      this.setState({ inputWarning: true });
    } else if (name === '' || address === '' || square === '' || about === '') {
      const errorFields = [
        { field: name, text: 'Location name' },
        { field: address, text: 'Location address' },
        { field: square, text: 'Location square' },
        { field: about, text: 'Location about' },
      ]
        .filter(item => item.field.length === 0)
        .map(i => i.text);

      this.setState({
        emptyInput: true,
        emptyInputText:
          errorFields.length > 1
            ? 'Such fields as ' + errorFields.join(', ') + ' are required'
            : errorFields.join(', ') + 'field is required',
      });
    } else {
      this.setState({
        swithesWarning: false,
        priceWarning: false,
        inputWarning: false,
        emptyInput: false,
      });

      this.props.actionsProfile
        .PutEditSpace(
          this.props.match.params.locationsId,
          {
            name,
            address,
            square,
            bathrooms,
            bedrooms,
            parking,
            status,
            about,
          },
          activeActivities,
          allIdToDeleteFromActivities,
        )
        .then(res => {
          if (res.error) {
            this.setState({
              editWarrning: true,
              editWarrningMessage: res.reason,
            });
          } else {
            if (allNewFiles.length > 0) {
              allNewFiles.forEach(file => {
                this.props.actionsGeneral
                  .UploadSpacePhotos(file, this.props.match.params.locationsId)
                  .then(() =>
                    this.props.actionsProfile.getLocationsById(
                      this.props.match.params.locationsId,
                    ),
                  );
              });
            }
            this.props.actions.setInitialLocationSettingReducerState();
            linkTo(
              HOST_MY_PROFILE_LOCATIONS_DETAILS(
                this.props.match.params.locationsId,
              ),
            );
          }
        });
    }
  };

  handleSubmit(e) {
    e.preventDefault();
    console.log('handle uploading-', this.state.file);
  }

  handleImageChange(e) {
    // debugger
    if (this.state.imagePreviewUrl.length <= 9) {
      for (let i = 0; i <= e.target.files.length; i++) {
        e.preventDefault();

        const reader = new FileReader();
        const file = e.target.files[i];
        reader.onloadend = () => {
          if (file.type === 'image/jpeg' || file.type === 'image/png') {
            this.setState({
              file,
              imagePreviewUrl: [...this.state.imagePreviewUrl, reader.result],
              allFiles: [...this.state.allFiles, file],
              allNewFiles: [...this.state.allNewFiles, file],
            });
          } else {
            this.setState({
              formatmgWarning: true,
            });
          }
        };
        // debugger
        reader.readAsDataURL(file);
      }
    } else {
      this.setState({
        maximumImgWarning: true,
      });
    }
  }

  deleteImgByIndex = indexToRemove => {
    const { imagePreviewUrl, allFiles, idToDeleteState } = this.state;

    let newimagePreviewUrl = [];
    let newFiles = [];
    let idToDelete = [...idToDeleteState];

    imagePreviewUrl.forEach((value, index) => {
      if (index !== indexToRemove) {
        newimagePreviewUrl = [...newimagePreviewUrl, value];
      }
    });
    allFiles.forEach((value, index) => {
      if (index != indexToRemove) {
        newFiles = [...newFiles, value];
      } else {
        value.photoUrl == imagePreviewUrl[index];
        if (value.id) {
          idToDelete = [...idToDelete, value.id];
        }
      }
    });

    this.setState({
      imagePreviewUrl: [...newimagePreviewUrl],
      allFiles: [...newFiles],
      idToDeleteState: [...idToDelete],
    });

    this.props.actionsProfile.setPhotosIdToRemove(idToDelete);
  };

  renderImages = imgList => {
    return (
      <ul>
        {imgList.map((value, index) => {
          return (
            <li key={index} className="img_wrapper_in_upload">
              <img src={value} />
              <span
                onClick={() => this.deleteImgByIndex(index)}
                className="hiden_delete_button"
              />
            </li>
          );
        })}
        <li>
          <form onSubmit={e => this.handleSubmit(e)}>
            <input
              className="fileInput"
              type="file"
              onChange={e => this.handleImageChange(e)}
              multiple
            />
          </form>
        </li>
      </ul>
    );
  };

  renderActivitiesLists = () => {
    const initialactivityList = {
      categories: [],
    };

    const { activityList = initialactivityList } = this.props;

    return (
      <FormGroup row>
        <p>Price</p>
        {activityList.map((item, index, arr) => {
          return (
            <Fragment key={index}>
              <FormControlLabel
                label={`Are you interested in hosting ${item.title}? `}
                control={
                  <Switch
                    defaultChecked={
                      this.props.locationsDetail.categories.find(
                        i => i.activityTitle === item.title,
                      ) && true
                    }
                    onChange={e => {
                      this.props.actions.hostProfileEditLocationsHandleSwitch(
                        item.id,
                        e.target.checked,
                        item.title,
                      );
                    }}
                  />
                }
              />
              <TextField
                disabled={
                  !(
                    this.props.locationsDetail.categories.find(
                      i => i.activityId === item.id,
                    ) !== undefined &&
                    this.props.locationsDetail.categories.find(
                      i => i.activityId === item.id,
                    ).checked !== false
                  )
                }
                placeholder="1"
                type="string"
                autoComplete="current-password"
                margin="normal"
                variant="outlined"
                defaultValue={
                  this.props.locationsDetail.categories.find(
                    i => i.activityTitle === item.title,
                  )
                    ? this.props.locationsDetail.categories.find(
                        i => i.activityTitle === item.title,
                      ).price
                    : null
                }
                onChange={e => {
                  e.target.value.length < 1
                    ? this.setState({ inputWarning: true })
                    : this.setState({ inputWarning: false });
                  this.props.actions.hostProfileEditLocationsEnterPriceValue(
                    item.id,
                    Number(e.target.value),
                  );
                }}
              />
            </Fragment>
          );
        })}
      </FormGroup>
    );
  };

  componentDidMount() {
    let allImgUrl = [];
    let allFilesNew = [];

    this.props.actionsHome.getActivityList().then(() => {
      this.props.actionsProfile
        .getLocationsById(this.props.match.params.locationsId)
        .then(res => {
          res.payload.photos.forEach(value => {
            allImgUrl = [...allImgUrl, value.photoUrl];
            allFilesNew = [...allFilesNew, value];
          });
        })
        .then(() => {
          this.setState({
            imagePreviewUrl: [...allImgUrl],
            allFiles: [...allFilesNew],
          });
        });
    });
  }

  render() {
    const initiallocationsDetail = {
      space: {
        name: '',
        bathrooms: '',
        bedrooms: '',
        parkingPlaces: '',
        square: '',
        status: '',
        address: '',
      },
      photos: [],
    };

    const {
      imagePreviewUrl,
      editWarrning,
      editWarrningMessage,
      priceWarning,
      swithesWarning,
      inputWarning,
      emptyInput,
      emptyInputText,
    } = this.state;

    const {
      locationsDetail = initiallocationsDetail,
      name = locationsDetail.space.name,
      address = locationsDetail.space.address,
      square = locationsDetail.space.square,
      about = locationsDetail.space.about,
      bathrooms = locationsDetail.space.bathrooms,
      bedrooms = locationsDetail.space.bedrooms,
      parking = locationsDetail.space.parkingPlaces,
    } = this.props;

    if (this.props.locationsDetail === undefined) return null;
    return (
      <PageTemplate>
        <div className="locations_edit_wrapper">
          <div className="locations_edit_top_block">
            <div className="locations_edit_top_block_left">
              <label htmlFor="Location_name">Location name</label>
              <TextField
                id="Location_name"
                placeholder="Location name"
                type="string"
                margin="normal"
                variant="outlined"
                onChange={({ target: { value } }) => {
                  this.props.actions.setEditLocationsName(value);
                  this.setState({ emptyInput: false });
                }}
                value={name}
              />
              <label htmlFor="Location_adress">Location address</label>
              <TextField
                id="Location_adress"
                placeholder="Location address"
                type="string"
                margin="normal"
                variant="outlined"
                onChange={({ target: { value } }) => {
                  this.props.actions.setEditLocationsAddress(value);
                  this.setState({ emptyInput: false });
                }}
                value={address}
              />
              <label htmlFor="Square_footage_of_the_space">
                Square footage of the space
              </label>
              <TextField
                id="Square_footage_of_the_space"
                placeholder="e.g. 150,5"
                type="string"
                autoComplete="current-password"
                margin="normal"
                variant="outlined"
                onChange={({ target: { value } }) => {
                  this.props.actions.setEditLocationsSquare(value);
                  this.setState({ emptyInput: false });
                }}
                value={square}
              />
              <label htmlFor="Square_footage_of_the_space">About space</label>
              <TextField
                id="About space"
                className="about-space-edit"
                placeholder="About space"
                type="text"
                margin="normal"
                variant="outlined"
                multiline
                rows="4"
                onChange={e => {
                  this.props.actions.setAboutSpaceInfo(e.target.value);
                  this.setState({ emptyInput: false });
                }}
                value={about}
              />
            </div>
            <div className="locations_edit_top_block_right">
              <label htmlFor="Number_of_bedrooms">Number of bedrooms</label>
              <TextField
                id="Status Number_of_bedrooms"
                placeholder="1"
                className="about-space-edit"
                onChange={({ target: { value } }) => {
                  this.props.actions.setEditLocationsBedrooms(value);
                }}
                value={bedrooms}
              />

              <label
                htmlFor="Number_of_bathrooms"
                className="number_of_bathrooms"
              >
                Number of bathrooms
              </label>
              <TextField
                id="Status Number_of_bathrooms"
                placeholder="1"
                className="about-space-edit"
                onChange={({ target: { value } }) => {
                  this.props.actions.setEditLocationsBathrooms(value);
                }}
                value={bathrooms}
              />
              <label
                htmlFor="Number_of_parking_spaces"
                className="number_of_parking_spaces"
              >
                Number of parking spaces
              </label>

              <TextField
                id="Status Number_of_parking_spaces"
                placeholder="1"
                className="about-space-edit"
                onChange={({ target: { value } }) => {
                  this.props.actions.setEditLocationsParking(value);
                }}
                value={parking}
              />
            </div>
          </div>
          <div className="locations_edit_center_activities_block">
            {this.renderActivitiesLists()}
          </div>
          <div className="locations_edit_center_block">
            {this.renderImages(imagePreviewUrl)}
          </div>
          <div className="locations_edit_bottom_block">
            <div className="pricing_main_bottom_bottom locations_edit_bottom_block_inner">
              <Button
                className="locations_edit_bottom_block_inner_close_button"
                variant="contained"
                onClick={() => {
                  linkTo(
                    HOST_MY_PROFILE_LOCATIONS_DETAILS(
                      this.props.match.params.locationsId,
                    ),
                  );
                  this.props.actions.setInitialLocationSettingReducerState();
                }}
              >
                Close
              </Button>
              <Button
                className=""
                variant="contained"
                color="secondary"
                onClick={() => this.onClickSaveHendler()}
              >
                Save
              </Button>
            </div>
            {editWarrning && (
              <FormHelperText className="red host-locations-alerts">
                {editWarrningMessage}
              </FormHelperText>
            )}
            {priceWarning && (
              <FormHelperText className="red host-locations-alerts">
                Price should consist only numbers and should be less than 999
                999.99
              </FormHelperText>
            )}
            {swithesWarning && (
              <FormHelperText className="red host-locations-alerts">
                Please, choose interest
              </FormHelperText>
            )}
            {inputWarning && (
              <FormHelperText className="red host-locations-alerts">
                Price fields are required
              </FormHelperText>
            )}
            {emptyInput && (
              <FormHelperText className="red host-locations-alerts">
                {emptyInputText}
              </FormHelperText>
            )}
          </div>
        </div>
      </PageTemplate>
    );
  }
}

export default MyLocationsEdit;
