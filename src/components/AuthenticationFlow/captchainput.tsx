// 验证码组件
import * as React from 'react'

const size = 4
const verifycode = {
  width: '150px',
  height: '40px',
  marginTop:'9px',
  marginLeft: '20%',
  display: 'inline-block',
  top: '0',
  right: '0'
}

export default function CaptchaInput ({ cRef }) {
  const [options, setOptions] = React.useState({
    id: 'verifycode', // 容器Id
    canvasId: 'verifyCanvas', // canvas的ID
    width: 150, // 默认canvas宽度
    height: 42, // 默认canvas高度
    type: 'blend', // 图形验证码默认类型blend:数字字母混合类型、number:纯数字、letter:纯字母
    code: '',      // 图形验证码的值，用户录入的值必须等于此处的code
    numArr: '0,1,2,3,4,5,6,7,8,9'.split(','),
    letterArr: getAllLetter() 
  })
 
  React.useImperativeHandle(cRef, () => ({
    validate: (value: any) => {
      const vcode = value?.toLowerCase()
      const v_code = options.code?.toLowerCase()
      if (vcode === v_code) {
        return true
      } else {
        return false
      }
    }
  }))
 
  React.useEffect(() => {
    _init()
    refresh()
  })
 
  function _init() {
    const con = document.getElementById(options.id)
    const canvas: any = document.createElement('canvas')
    options.width = con.offsetWidth > 0 ? con.offsetWidth : 150
    options.height = con.offsetHeight > 0 ? con.offsetHeight : 47
    canvas.id = options.canvasId
    canvas.width = options.width
    canvas.height = options.height
    canvas.style.cursor = 'pointer'
    canvas.innerHTML = '您的浏览器版本不支持canvas'
    con.appendChild(canvas)
    canvas.onclick = function() {
      refresh()
    }
  }
 
  function refresh() {
    options.code = ''
    const canvas: any = document.getElementById(options.canvasId)
    let ctx = null
    if (canvas.getContext) {
      ctx = canvas.getContext('2d')
    } else {
      return
    }
    ctx.clearRect(0, 0, options.width, options.height)
    ctx.textBaseline = 'middle'
 
    ctx.fillStyle = randomColor(180, 240)
    ctx.fillStyle = 'rgba(206, 244, 196)'// 背景色
    ctx.fillRect(0, 0, options.width, options.height)
 
    if (options.type == 'blend') { // 判断验证码类型
      var txtArr = options.numArr.concat(options.letterArr)
    } else if (options.type == 'number') {
      var txtArr = options.numArr
    } else {
      var txtArr = options.letterArr
    }
 
    for (let i = 1; i <= size; i++) {
      const txt = txtArr[randomNum(0, txtArr.length)]
      options.code += txt
      ctx.font = randomNum(options.height / 2, options.height) + 'px SimHei' // 随机生成字体大小
      ctx.fillStyle = randomColor(50, 160) // 随机生成字体颜色
      // ctx.fillStyle = "rgb(46, 137, 255)";//固定字体颜色
      ctx.shadowOffsetX = randomNum(-3, 3)
      ctx.shadowOffsetY = randomNum(-3, 3)
      ctx.shadowBlur = randomNum(-3, 3)
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
      const x = options.width / (size + 1) * i
      const y = options.height / 2
      const deg = randomNum(-30, 30)
      /** 设置旋转角度和坐标原点**/
      ctx.translate(x, y)
      ctx.rotate(deg * Math.PI / 180)
      ctx.fillText(txt, 0, 0)
      /** 恢复旋转角度和坐标原点**/
      ctx.rotate(-deg * Math.PI / 180)
      ctx.translate(-x, -y)
    }
    /** 绘制干扰线**/
    for (let i = 0; i < 4; i++) {
      ctx.strokeStyle = randomColor(40, 180)
      ctx.beginPath()
      ctx.moveTo(randomNum(0, options.width), randomNum(0, options.height))
      ctx.lineTo(randomNum(0, options.width), randomNum(0, options.height))
      ctx.stroke()
    }
    // 绘制干扰点
    // for (let i = 0; i < 100; i++) {
    //   ctx.fillStyle = randomColor(0, 255)
    //   ctx.beginPath()
    //   ctx.arc(randomNum(0, options.width), randomNum(0, options.height), 1, 0, 2 * Math.PI)
    //   ctx.fill()
    // }
  }
 
  /** 生成字母数组**/
  function getAllLetter() {
    const letterStr = 'a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z'
    return letterStr.split(',')
  }
  /** 生成一个随机数**/
  function randomNum(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min)
  }
  /** 生成一个随机色**/
  function randomColor(min: number, max: number) {
    const r = randomNum(min, max)
    const g = randomNum(min, max)
    const b = randomNum(min, max)
    return 'rgb(' + r + ',' + g + ',' + b + ')'
  }
 
  console.log("options:",options)

  return (
    <div id='verifycode' style={verifycode} />
  )
}
