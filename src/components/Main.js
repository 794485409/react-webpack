require('normalize.css/normalize.css');
require('styles/App.css');


import React from 'react';

//获取图片的相关数据
let imageDataJson = require('../data/imageData.json');

//将图片名信息转换成图片地址URL路径信息
let imageDatas = imageDataJson => {
  for(let imgI of imageDataJson) {
    imageDataJson[imgI].imageUrl = require('../images/' + imageDataJson[imgI].fileName)
  }
  return imageDataJson;
}

// let yeomanImage = require('../images/yeoman.png');

class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
        <section className="img-sec">
        </section>
        <nav className="controller-nav">
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
