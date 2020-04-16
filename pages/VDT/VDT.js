// pages/VDT/VDT.js
var wxCharts = require("../../dist/wxcharts.js");
var app = getApp();
var lineChart = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    d1: '',
    d2: '',
    d3: '',
    volume1:'',
    volume2: '',
    volume3: '',
    volume1b: '',
    volume2b: '',
    volume3b: '',
    diff12: ' ',
    diff13: ' ',
    diff23: ' ',
    vdt12: ' ',
    vdt13: ' ',
    vdt23: ' ',
    vd12: ' ',
    vd12: ' ',
    vd23: ' ',
    msPerDay: 1000 * 60 * 60 * 24

  },

  /**
   * 输入
   */
  bindDate1Change: function (e) {
    let d1 = e.detail.value.replace(/-/g, "/");
    this.setData({
      d1: d1
    });
    d1 = new Date(d1);
    if (this.data['d2']) {
      let d2 = new Date(this.data['d2']);
      this.setData({
        diff12: (d2 -d1)/this.data['msPerDay']
      });
    };
    if (this.data['d3']) {
      let d3 = new Date(this.data['d3']);
      this.setData({
        diff13: (d3 - d1) / this.data['msPerDay']
      });
    };
    this.createSimulationData();
    this.vdt()
  },
  bindDate2Change: function (e) {
    let d2 = e.detail.value.replace(/-/g, "/");
    this.setData({
      d2: d2
    });
    d2 = new Date(d2);
    if (this.data['d1']) {
      let d1 = new Date(this.data['d1']);
      this.setData({
        diff12: (d2 - d1) / this.data['msPerDay']
      });
    };
    if (this.data['d3']) {
      let d3 = new Date(this.data['d3']);
      this.setData({
        diff23: (d3 - d2) / this.data['msPerDay']
      });
    };
    this.createSimulationData();
    this.vdt()
  },
  bindDate3Change: function (e) {
    let d3 = e.detail.value.replace(/-/g, "/");
    this.setData({
      d3: d3
    });
    d3 = new Date(d3);
    if (this.data['d1']) {
      let d1 = new Date(this.data['d1']);
      this.setData({
        diff13: (d3 - d1) / this.data['msPerDay']
      });
    };
    if (this.data['d2']) {
      let d2 = new Date(this.data['d2']);
      this.setData({
        diff23: (d3 - d2) / this.data['msPerDay']
      });
    };
    this.createSimulationData()
    this.vdt()
  }, 
  bindDim1Change: function (e) {
    let dim1 = e.detail.value;
    this.setData({
      dim1: dim1
    });
    dim1 = dim1.replace(/ x /g, " ").replace(/x/g, " ").replace(/  /g, " ").trim();  // remove x, double whitespace and trailing whitespace
    let dim1s = this.data["dim1"].split(" ");
    if (dim1s.length == 1) dim1 = Math.pow(dim1s[0], 3)
    if (dim1s.length == 2) dim1 = dim1s[0] * dim1s[1] * (dim1s[0] / 2 + dim1s[1] / 2)
    if (dim1s.length == 3) dim1 = dim1s[0] * dim1s[1] * dim1s[2]

    let volume1 = parseFloat(Math.round(dim1 / 2 * 100) / 100).toFixed(2)
    let pi = Math.PI
    let volume1b = parseFloat(Math.round(pi / 6 * dim1 * 100) / 100).toFixed(2)
    this.setData({
      volume1: volume1,
      volume1b: volume1b
    });
    this.vdt()
  },
  bindDim2Change: function (e) {
    let dim2 = e.detail.value;
    this.setData({
      dim2: dim2
    });
    dim2 = dim2.replace(/ x /g, " ").replace(/x/g, " ").replace(/  /g, " ").trim();  // remove x, double whitespace and trailing whitespace
    let dim2s = this.data["dim2"].split(" ");
    if (dim2s.length == 1) dim2 = Math.pow(dim2s[0], 3)
    if (dim2s.length == 2) dim2 = dim2s[0] * dim2s[1] * (dim2s[0]/2 + dim2s[1]/2)
    if (dim2s.length == 3) dim2 = dim2s[0] * dim2s[1] * dim2s[2]

    let volume2 = parseFloat(Math.round(dim2 / 2 * 100) / 100).toFixed(2)
    let pi = Math.PI;
    let volume2b = parseFloat(Math.round(pi/6*dim2*100)/100).toFixed(2);
    this.setData({
      volume2: volume2,
      volume2b: volume2b
    });
    this.vdt()
  },
  bindDim3Change: function (e) {
    let dim3 = e.detail.value;
    this.setData({
      dim3: dim3
    });
    dim3 = dim3.replace(/ x /g, " ").replace(/x/g, " ").replace(/  /g, " ").trim();  // remove x, double whitespace and trailing whitespace
    let dim3s = this.data["dim3"].split(" ");
    if (dim3s.length == 1) dim3 = Math.pow(dim3s[0], 3)
    if (dim3s.length == 2) dim3 = dim3s[0] * dim3s[1] * (dim3s[0] / 2 + dim3s[1] / 2)
    if (dim3s.length == 3) dim3 = dim3s[0] * dim3s[1] * dim3s[2]

    let volume3 = parseFloat(Math.round(dim3 / 2 * 100) / 100).toFixed(2);
    let pi = Math.PI
    let volume3b = parseFloat(Math.round(pi / 6 * dim3 * 100) / 100).toFixed(2)
    this.setData({
      volume3: volume3,
      volume3b: volume3b
    });
    this.vdt()
  },
  bindVolume1Change: function (e){
    this.setData({
      volume1: e.detail.value
    });
    this.vdt()
  },
  bindVolume2Change: function (e) {
    this.setData({
      volume2: e.detail.value
    });
      this.vdt()
  },
  bindVolume3Change: function (e) {
    this.setData({
      volume3: e.detail.value
    });
      this.vdt()
  },
  /**
   * 计算
   */

  vdt: function()
  {
    let volume1 = this.data['volume1']
    let volume2 = this.data['volume2']
    let volume3 = this.data['volume3']
    let volume1b = this.data['volume1']
    let volume2b = this.data['volume2']
    let volume3b = this.data['volume3']
    let d1 = new Date(this.data['d1'])
    let d2 = new Date(this.data['d2'])
    let d3 = new Date(this.data['d3'])
    let msPerDay = 1000 * 60 * 60 * 24    
    let diff12 = (d2 - d1) / msPerDay
    let diff13 = (d3 - d1) / msPerDay
    let diff23 = (d3 - d2) / msPerDay
    if(diff12 > 0 && volume1 > 0 && volume2 > 0)
    {
      let vdt12 = Math.log(2) * diff12 / Math.log(volume2 / volume1)
      let vdt12b = Math.log(2) * diff12 / Math.log(volume2b / volume1b)
      let vd12 = Math.log(volume2 / volume1)
      let vd12b = Math.log(volume2b / volume1b)
      let percent12 = (volume2 - volume1) / volume1
      vdt12 = parseFloat(Math.round(vdt12 * 100) / 100).toFixed(2);
      vdt12b = parseFloat(Math.round(vdt12b * 100) / 100).toFixed(2);
      vd12 = parseFloat(Math.round(vd12 * 100) / 100).toFixed(2)
      vd12b = parseFloat(Math.round(vd12b * 100) / 100).toFixed(2)
      percent12 = Math.round(percent12 * 100)
      let percent12b = Math.round(percent12 * 100)
      this.setData({
        vd12: vd12,
        vdt12: vdt12,
        percent12: percent12 + '%'
      })
    }
    if (diff23 > 0 && volume1 > 0 && volume2 > 0 && volume3 > 0) {
      let vdt23 = Math.log(2) * diff23 / Math.log((volume3) / volume2)
      let vd23 = Math.log(volume3 / volume2)
      let percent23 = (volume3 - volume2) / volume2
      vdt23 = parseFloat(Math.round(vdt23 * 100) / 100).toFixed(2)
      vd23 = parseFloat(Math.round(vd23 * 100) / 100).toFixed(2)
      percent23 = Math.round(percent23 * 100)
      this.setData({
        vd23: vd23,
        vdt23: vdt23,
        percent23: percent23 + '%'
      })
    }
    if (diff13 > 0 && volume1 > 0 && volume2 > 0 && volume3 > 0) {
      let vdt13 = Math.log(2) * diff13 / Math.log((volume3) / volume1)
      let vd13 = Math.log(volume3 / volume1)
      let percent13 = (volume3 - volume1) / volume1
      vdt13 = parseFloat(Math.round(vdt13 * 100) / 100).toFixed(2);
      vd13 = parseFloat(Math.round(vd13 * 100) / 100).toFixed(2)
      percent13 = Math.round(percent13 * 100)
      this.setData({
        vd13: vd13,
        vdt13: vdt13,
        percent13: percent13 + '%'
      })
    }
    if (this.data['percent12'] != ' ' && this.data['percent23'] != ' ' && this.data['percent13'] != ' '){
      this.updateData()
    }
 },
  /**
   * 画图
   */
  touchHandler: function (e) {
    console.log(lineChart.getCurrentDataIndex(e));
    lineChart.showToolTip(e, {
      // background: '#7cb5ec',
    });
  },
  createSimulationData: function () {
    let vdt12 = Number(this.data['vdt12']);
    let vdt23 = Number(this.data['vdt23']);
    let vdt13 = Number(this.data['vdt13']);
    // console.log("vdt: " + vdt12+" " +vdt23+ " "+ vdt13)
    let d1 = this.data['d1'];
    let d2 = this.data['d2'];
    let d3 = this.data['d3'];
    return {
      categories: [d1, d2, d3],
      data: [vdt12, vdt23, vdt13]
    }
  },
  updateData: function () {
    var simulationData = this.createSimulationData();
    var series = [{
      name: 'vol',
      data: simulationData.data,
    }];
    lineChart.updateData({
      categories: simulationData.categories,
      series: series
    });
  },
  onLoad: function (e) {
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowHeight;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    var simulationData = this.createSimulationData();
    lineChart = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: simulationData.categories,
      animation: false,
      // background: '#f5f5f5',
      series: [{
        name: 'vdt',
        data: simulationData.data,
      }
      ],
      xAxis: {
        title: 'Time',
        disableGrid: true
      },
      yAxis: {
        title: 'vol',
        min: 0
      },
      width: windowWidth,
      height: 200,
      dataLabel: false,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve'
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  // onLoad: function (options) {
  // },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})