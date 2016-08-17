require('normalize.css/normalize.css');
require('../styles/scss/App.scss');

// import appsass from 'styles/scss/App.scss'
import React from 'react';
import ReactDOM from 'react-dom'
//获取图片的相关数据
let imageDataJson = require('../data/imageData.json');


//将图片名信息转换成图片地址URL路径信息
var imgDatas = ((imageDataJson) => {
  let i = 0;
  for(i; i< imageDataJson.length;i++) {
    imageDataJson[i].imageUrl = require('../images/' + imageDataJson[i].fileName)
  }
  return imageDataJson;
})(imageDataJson);

// console.log(imgDatas);
// let yeomanImage = require('../images/yeoman.png');

/*
 *  获取区间内的一个随机值
 */
var getRangeRandom = (low, high) => Math.floor(Math.random() * (high - low) + low);

/*
 *  获取旋转角度随机值
 */
var getRotateRandom = (deg) => ((Math.random() > 0.5 ? '' : '-' ) + Math.floor(Math.random() * deg));

/*
 *  设置transform浏览器兼容
 */
var setTransformRotate = (element, array) => {
  (['MozTransform', 'msTransform', 'WebkitTransform', 'transform']).forEach(function(d) {
    array[d] = 'rotate(' + element.props.arrange.rotate + 'deg)';
  })
}

// /*
//  *  图片翻转点击函数
//  */
var imgRotateClick = (_this) => {
  // console.log(e);
  if(_this.props.arrange.isCenter) {
    _this.props.inverse();
  } else {
    _this.props.center();
  }
}

//ImgFigure操作
class ImgFigure extends React.Component {

  /*
   *  imgFigure 的点击处理函数
   */

  handleClick(e) {
    imgRotateClick(this);
    // if(this.props.arrange.isCenter) {
    //   this.props.inverse();
    // } else {
    //   this.props.center();
    // }

    e.stopPropagation();
    e.preventDefault();
  }
  render() {
    let styleObj = {};

    //如果props属性中指定了这张图片的位置，则使用
    if(this.props.arrange.pos) {
      styleObj = this.props.arrange.pos;
    }
    //如果图片的旋转角度有值且不为0
    if(this.props.arrange.rotate) {
      setTransformRotate(this, styleObj);
    }

    //图片正反切换    ps：因为图片的翻转[rotateY]和旋转[rotateX]都在一个div上面操作，所以只有居中元素才可以翻转
    var imgFigureClassName = 'img-figure';
        imgFigureClassName += this.props.arrange.isInverse ? ' isInverse' : ''; //类之间存在空格

    //如果是居中的图片，z-index设为11
    if(this.props.arrange.isCenter) {
      styleObj.zIndex = 101;
    }
    return (
      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick.bind(this)} >
        <div className="figure-image">
          <img src={this.props.data.imageUrl} alt={this.props.data.title}/>
        </div>
        <figcaption>
          <h2 className="image-title">{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick.bind(this)}>
            <p>{this.props.data.desc}</p>
          </div>
        </figcaption>
      </figure>
    );
  }
}
// let imgFigure = React.createClass({
//   render: function () {
//     return(
//       <figure>
//         <img src={this.props.data.imageUrl} alt={this.props.data.title}/>
//         <figcaption>
//           <h2>{this.props.data.title}</h2>
//         </figcaption>
//       </figure>
//     )
//   }
// })

//控制组件
class ControlUnit extends React.Component {
  handleClick(e) {
    imgRotateClick(this);
    // if(this.props.arrange.isCenter) {
    //   this.props.inverse();
    // } else {
    //   this.props.center();
    // }
    
    e.stopPropagation();
    e.preventDefault();
  }
  render() {
    let controlUnitClassName = 'control-unit';
    //显示居中状态按钮
    if(this.props.arrange.isCenter) {
      controlUnitClassName += ' is-center';
      //显示反转态按钮
      if(this.props.arrange.isUnverse) {
        controlUnitClassName += ' is-inverse';
      }
    }
    return(
      <span className={controlUnitClassName} onClick={this.handleClick.bind(this)}></span>
    )
  }
}

//主菜单
class AppComponent extends React.Component {
   Constant = {
    centerPos: {
      left: 0,
      right: 0
    },
    hPosRange: {    //水平方向的取值范围
      leftSecX: [0, 0],
      rightSecX: [0, 0],
      y: [0, 0]
    },
    vPosRange: {    //垂直方向的取值范围
      x: [0, 0],
      topY: [0, 0]
    }
  };

  /*
   *  翻转index图片
   *  @param index 输入当前被执行翻转的图片对应的数组的index
   *  @return {function}是闭包函数，其中return的函数是真正带执行的函数
   */
  inverse(index) {
    return function() {
      let imgsArrangeArr = this.state.imgsArrangeArr;
          imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

      this.setState({
        imgsArrangeArr: imgsArrangeArr
      })
    }.bind(this);
  }

  /*
   *   重新布局所有图片
   *   @param centerIndex 指定居中排布哪个图片
   */
  rearrange(centerIndex) {
    let imgsArrangeArr = this.state.imgsArrangeArr,
      Constant = this.Constant,
      centerPos = Constant.centerPos,
      hPosRange = Constant.hPosRange,
      vPosRange = Constant.vPosRange,
      hPosRangeLeftSecX = hPosRange.leftSecX,
      hPosRangeRightSecX = hPosRange.rightSecX,
      hPosRangeY = hPosRange.y,
      vPosRangeTopY = vPosRange.topY,
      vPosRangeX = vPosRange.x,

      imgsArrangeTopArr = [],
      topImgNum = Math.floor(Math.random() * 2), //取一个或不取
      topImgSpliceIndex = 0,

      imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1); //从centerIndex处开始选取一个元素删除，此元素作为中心显示图片

      //首先居中centerIndex,无需旋转
      imgsArrangeCenterArr[0] = {
        pos: centerPos,
        rotate: 0,
        isCenter: true
      };

      //取出要布局上侧的图片的状态信息
      topImgSpliceIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum));
      imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

      //布局位于上层的图片
      imgsArrangeTopArr.forEach((value, index) => {
        imgsArrangeTopArr[index] = {
          pos: {
            top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
            left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
          },
          rotate: getRotateRandom(30),
          isCenter: false
        };
      });

      //布局位于左右两侧图片的状态信息
      for(let i = 0,j = imgsArrangeArr.length,k = j / 2; i < j; i++) {
        let hPosRangeLORX = null;

        if(i < k) {
          hPosRangeLORX = hPosRangeLeftSecX;    //左边
        } else {
          hPosRangeLORX = hPosRangeRightSecX;   //右边
        }

        imgsArrangeArr[i] = {
          pos: {
            top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
            left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
          },
          rotate: getRotateRandom(30),
          isCenter: false
        };
      }

      //重新填充
      if(imgsArrangeTopArr && imgsArrangeTopArr[0]) {
        imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
      }
      imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

      this.setState({
        imgsArrangeArr: imgsArrangeArr
      });
  }

  /*
   *  居中index图片
   *  @param index, 需要居中的图片的index值
   *  return {function}
   */
   center(index) {
     return function() {
       this.rearrange(index);
     }.bind(this);
   }


  constructor(props) {    //constructor函数，指组件被创建时执行
    super(props);
    this.state = {
      imgsArrangeArr: [
        // {
        //   pos: {
        //     left: 0,
        //     top: 0
        //   },
        //   rotate: 0,      //旋转角度
        //   isInverse: false,   //图片正反
        //   isCenter: false
        // }
      ]
    }
  }
  //组件加载后，为每张图片计算其位置的范围
  componentDidMount() {

    //首先拿到舞台的大小
    let stageDom = ReactDOM.findDOMNode(this.refs.stageDetail),
      stageW = stageDom.scrollWidth,
      stageH = stageDom.scrollHeight,
      halfStageW = Math.floor(stageW / 2),
      halfStageH = Math.floor(stageH / 2);

    //拿到一个imgFigure的大小
    let imgFigureDom = ReactDOM.findDOMNode(this.refs.imgFigure0),
      imgW = imgFigureDom.scrollWidth,
      imgH = imgFigureDom.scrollHeight,
      halfImgW = Math.floor(imgW / 2),
      halfImgH = Math.floor(imgH / 2);

    //计算中心图片的位置点
    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    };

    //计算左侧，右侧区域图片的取值范围 0 － 左， 1 － 右
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    //计算上侧区域图片的取值范围
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;

    this.rearrange(0);
  }

  //渲染DOM
  render() {
    let controlUnits = [],
        imageFigures = [];

    imgDatas.forEach(function (value, index) {

      if(!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,
          isInverse: false,
          isCenter: false
        };
      }

    imageFigures.push(<ImgFigure key={index} data={value} ref={'imgFigure' + index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);

    controlUnits.push(<ControlUnit key={index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)} />);

  }.bind(this));
    return (
      <section className="stage" ref="stageDetail">
        <section className="img-sec">
          {imageFigures}
        </section>
        <nav className="controller-nav">
          {controlUnits}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
