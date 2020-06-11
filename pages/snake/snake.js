// pages/snake/snake.js
Page({

  data: { 
    score:0,             //当前得分
    maxscore:900,        //历史最高分
    startx:0,            //触摸开始的横坐标
    starty:0,            //触摸开始的纵坐标
    endx: 0,             //触摸结束的横坐标
    endy:0,              //触摸结束的纵坐标
    ground:[],           //存储操场的每个方块
    rows:28,             //行数
    cols:22,             //列数
    snake:[],            //蛇
    food:[],             //食物
    direction:"",        //移动方向
    timer:"",            //初始化定时器
    modalHidden:true     //modal是否隐藏,弹出框
  },

  onLoad: function (options) {
    var maxscore=wx.getStorageSync("maxscore")
    if(!maxscore){
      maxscore=0
    }
    this.setData({
      maxscore:maxscore
    })
    this.initGround(this.data.rows,this.data.cols)
    this.initSnake(3)
    this.createFood()
    this.move()
  },

  //计分器
  storeScore:function(){
    if(this.data.maxscore<this.data.score){
      this.setData({
        maxscore:this.data.score
      })
    }
    wx.setStorageSync("maxscore", this.data.maxscore)
  },

  //初始化操场
  initGround:function(rows,cols){
    for(var i=0;i<rows;i++){
      var arr=[];
      this.data.ground.push(arr);
      for(var j=0;j<cols;j++){
        this.data.ground[i].push(0)
      }
    }
  },

  //初始化蛇,蛇的长度是3，宽度是1
  initSnake:function(len){
    for(var i=0;i<len;i++){
      this.data.ground[0][i]=1
      this.data.snake.push([0,i])
    }
  },

  //创建食物
  createFood:function(){
    var x = Math.floor(Math.random()*this.data.rows)   //创建函数和列数
    var y = Math.floor(Math.random() * this.data.cols)
    var ground=this.data.ground
    var snake=this.data.snake
    ground[x][y]=3
    for(var i=0;i<snake.length;i++){
      var node = snake[i][1]
      // console.log(node)
      if (x == 0 && y == node) {
        createFood()
        return
      } else {
        this.setData({
          ground: ground,
          food: [x, y]
        })
      }  
  }
  },

  //手指触摸开始
  tapStart:function(e){
    // console.log("开始点击")
    // console.log(e)
    this.setData({
      startx:e.touches[0].pageX,
      starty:e.touches[0].pageY
    })
  },

  //手指触摸移动
  tapMove:function(e){
    // console.log("移动")
    // console.log(e)
    this.setData({
      endx:e.touches[0].pageX,
      endy:e.touches[0].pageY
    })
  },

  //手指触摸结束
  tapEnd:function(){
    //获取滑动距离
    var heng=(this.data.endx)?(this.data.endx-this.data.startx):0
    var zong=(this.data.endy)?(this.data.endy-this.data.starty):0
    if(Math.abs(heng)>5||Math.abs(zong)>5){
      var direction = Math.abs(heng) > Math.abs(zong) ? this.computerDir(1, heng) : this.computerDir(0, zong)
      switch(direction){
        case "left":
          if(this.data.direction=="right"){
            return;
          }
        break;
        case "right":
          if(this.data.direction=="left"){
            return
          }
        break;
        case "top":
          if (this.data.direction == "bottom") {
            return
          }
        break;
        case "bottom":
          if (this.data.direction == "top") {
            return
          }
        break;
      }
      this.setData({
        direction:direction,
        startx:0,
        starty:0,
        endx:0,
        endy:0
      })
    }
    // console.log(this.data.direction)
  },

  //判断滑动方向
  computerDir:function(heng,num){
    if(heng){
      return(num>0)?"right":"left"
    }else{
      return(num>0)?"bottom":"top"
    }
  },

  //移动函数
  move:function(){
    var that=this
    this.data.timer=setInterval(function(){
      that.changeDirection(that.data.direction)
      that.setData({
        ground:that.data.ground
      })
    },300)
  },

  //改变方向
  changeDirection:function(dir){
    switch(dir){
      case "left":
       return this.changeLeft();
        break;
      case "right":
       return this.changeRight();
        break;
      case "top":
       return this.changeTop();
        break;
      case "bottom":
       return this.changeBottom();
        break;
    }
  },

  //改变方向向左
  changeLeft:function(){
    var arr=this.data.snake;
    var len=this.data.snake.length;
    var snakeHEAD=arr[len-1][1]
    var snakeTAIL=arr[0]
    var ground=this.data.ground
    ground[snakeTAIL[0]][snakeTAIL[1]]=0
    for(var i=0;i<len-1;i++){
      arr[i]=arr[i+1]
    }
    var x=arr[len-1][0]
    var y=arr[len-1][1]-1
    arr[len-1]=[x,y]
    this.checkGame(snakeTAIL)
    for(var i=1;i<len;i++){
      ground[arr[i][0]][arr[i][1]]=1
    }
    this.setData({
      ground:ground,
      snake:arr
    })
    return true
  },

  //改变方向向右
  changeRight: function () {
    var arr = this.data.snake;
    var len = this.data.snake.length;
    var snakeHEAD = arr[len - 1][1]
    var snakeTAIL = arr[0]
    var ground = this.data.ground
    ground[snakeTAIL[0]][snakeTAIL[1]] = 0
    for (var i = 0; i < len - 1; i++) {
      arr[i] = arr[i + 1]
    }
    var x = arr[len - 1][0]
    var y = arr[len - 1][1] +1 
    arr[len - 1] = [x, y]
    this.checkGame(snakeTAIL)
    for (var i = 1; i < len; i++) {
      ground[arr[i][0]][arr[i][1]] = 1
    }
    this.setData({
      ground: ground,
      snake: arr
    })
    return true
  },

  //改变方向向上
  changeTop: function () {
    var arr = this.data.snake;
    var len = this.data.snake.length;
    var snakeHEAD = arr[len - 1][1]
    var snakeTAIL = arr[0]
    var ground = this.data.ground
    ground[snakeTAIL[0]][snakeTAIL[1]] = 0
    for (var i = 0; i < len - 1; i++) {
      arr[i] = arr[i + 1]
    }
    var x = arr[len - 1][0]-1
    var y = arr[len - 1][1] 
    arr[len - 1] = [x, y]
    this.checkGame(snakeTAIL)
    for (var i = 1; i < len; i++) {
      ground[arr[i][0]][arr[i][1]] = 1
    }
    this.setData({
      ground: ground,
      snake: arr
    })
      return true
  },

  //改变方向向下
  changeBottom: function () {
    var arr = this.data.snake;
    var len = this.data.snake.length;
    var snakeHEAD = arr[len - 1][1]   //头部判断
    var snakeTAIL = arr[0]
    var ground = this.data.ground
    ground[snakeTAIL[0]][snakeTAIL[1]] = 0   //让尾部为0，融入环境
    for (var i = 0; i < len - 1; i++) {
      arr[i] = arr[i + 1]
    }
    var x = arr[len - 1][0]+1
    var y = arr[len - 1][1] 
    arr[len - 1] = [x, y]
    this.checkGame(snakeTAIL)
    for (var i = 1; i < len; i++) {
      ground[arr[i][0]][arr[i][1]] = 1   // 在背景滑动
    }
    this.setData({
      ground: ground,
      snake: arr
    })
    return true
  },

  //游戏状态
  checkGame: function (snakeTAIL){
    var arr=this.data.snake;
    var len=this.data.snake.length;
    var snakeHEAD=arr[len-1]    //头部撞到四边
    if(snakeHEAD[0]<0||snakeHEAD[0]>=this.data.rows||snakeHEAD[1]<0||snakeHEAD[1]>=this.data.cols){
      clearInterval(this.data.timer)
      this.setData({
        modalHidden:false
      })
    }
    for(var i=0;i<len-1;i++){    //头部撞到自身
      if (snakeHEAD[0] == arr[i][0] && snakeHEAD[1] == arr[i][1]) {
        clearInterval(this.data.timer)
        this.setData({
          modalHidden:false
        })
      }
    }    //头部撞到食物
    if(snakeHEAD[0]==this.data.food[0]&&snakeHEAD[1]==this.data.food[1]){
      arr.unshift(snakeTAIL)
      this.setData({
        score:this.data.score+10
      })
      this.createFood()
      this.storeScore()
    }
  },

  //点击确定触发的事件
  modalConfirm:function(){
    this.setData({
      score:0,
      ground:[],
      snake:[],
      food:[],
      modalHidden:true,
      direction:""
    })
    this.onLoad()
  },
  modalCancel:function(){
    wx.switchTab({
      url: 'index/index',   //注意switchTab只能跳转到带有tab的页面，不能跳转到不带tab的页面
    })
  },
})