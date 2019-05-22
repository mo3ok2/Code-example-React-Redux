import React, { Component } from 'react';
import moment from 'moment';
import Slider from 'react-slick';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  overflow: hidden;
  margin: 0 auto;
`;
const Page = styled.div`
  width: 25%;
`;

class SliderView extends Component {
  imgRender = () => {
    const { imgList } = this.props;

    const settings = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 5,
      slidesToScroll: 1,
      autoplay: false,
    };

    // debugger
    if (imgList.length === 0) {
      return <p className="empty_list_in_requests"> Slider is empty </p>;
    }
    return (
      <Slider {...settings}>
        {imgList.map(value => {
          return (
            <Page key={value.id}>
              <img src={value.photoUrl} alt="img" />
            </Page>
          );
        })}
      </Slider>
    );
  };

  render() {
    return (
      <Wrapper>
        <h2 className="photos_tittle"> Photos</h2>

        {this.imgRender()}
      </Wrapper>
    );
  }
}

export default SliderView;
