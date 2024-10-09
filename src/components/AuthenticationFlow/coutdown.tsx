import React, { useState, useEffect} from 'react'
import { Button,Form } from 'antd'

//随机产生n个数字成的字串(如应用于手机验证码的产生)
function getStringRand(len:any) {
  const possibleCharacters = '0123456789';
  const stringLength = parseInt(len); // 你想要生成的字符串长度
  let randomString = '';

  for (let i = 0; i < stringLength; i++) {
    const randomIndex = Math.floor(Math.random() * possibleCharacters.length);
    randomString += possibleCharacters.charAt(randomIndex);
  }
  return randomString
}

//参数
// bRef事件引用参数，供外部调用本组件定义的事件
// form表单对像，外部表单对像引用本组件中
// name外部表单某一控件的名称，通常是指手机号码录入控件
export default function CountButton({bRef,form,name},){
  //--------短信动态码状态----------------------------
  const [options, setOptions] = React.useState({
    code: '',      // 验证码的值，用户录入的值必须等于此处的code 
  })

  //--------组件定义方法(供外部调用)----------------------------
  React.useImperativeHandle(bRef, () => ({
    //数据校验
    validate: (value: any) => {
    const vcode = value?.toLowerCase()
    const v_code = options.code?.toLowerCase()
    if (vcode === v_code) {
      return true
    } else {
      return false
    }
    }
    }),
  )

  //--------按扭状态:初始状态配置----------------------------
  //按扭状态识别,若手机号不能正确录入，倒计时button不能启用
  const [submittable, setSubmittable] = React.useState<boolean>(false);
  //const values = Form.useWatch('mobile', form);   //只监控某一个Form.Item
  //const values = Form.useWatch([],form);          //Watch all values
  const values = Form.useWatch(name, form);         //只监控某一个Form.Item
  
  useEffect(() => {
    form
      //.validateFields({ validateOnly: true })   //form所有项
      .validateFields([name])                 //表单的某一项
      .then(() => setSubmittable(true))
      .catch(() => setSubmittable(false));
  }, [form, values]);


  //--------按扭状态:单击过程中的状态配置----------------------------
  //倒计时button的单击状态识别
  const [isClick, setIsClick] = useState(false);
  const [count, setCount] = useState(0);
  const [btname, setBtname] = useState('发送验证码');
  //按扭倒计时进行时
  useEffect(() => { 
    const intervalId = setInterval(() => {
      //定时任务区
      if (isClick) {
      if (count < 60) {      //当少于60时
         setCount(count + 1)
         setBtname("(" + count + "秒后)发送验证码")
         setIsClick(true)
      } else {               //当等于60时，发送按扭复位
        setCount(0)
        setBtname("发送验证码")
        setIsClick(false)
        const code = getStringRand(6)   //产生6位数字的随机码作为验证码
        setOptions({code: code})        //将之前的验证码覆盖掉。
      }
      
    }}, 1000); // 每秒更新一次
    return () => clearInterval(intervalId);
    }, 
    [btname]
  );

  //--------按扭单击事件----------------------------
  function onSendCode(){
    if (!isClick) {
        setBtname("(60 秒后)发送验证码")
        setIsClick(true)   
        const code = getStringRand(6)   //产生6位数字的随机码作为验证码
        setOptions({code: code})
        //sendCode(code,values)    //在真实的业务中，需通过第三方短信通道将此验证码发到用户手机上。
        //短信码测试
        console.log(code,values)   //code是动态码。values是父组件传递而来的手机号码
    } else {
        setBtname("发送验证码")
        setIsClick(false)
    }
  }

  //渲染倒计时按扭
  return(
    <>
      <Button 
        style={{marginTop:'12px', marginLeft:'20px',borderRadius:"0",borderStyle:'none'}} 
        onClick={onSendCode} 
        disabled={(isClick||(!submittable))} 
      > 
        {btname}
      </Button>
    </>
  )
}
