/*global chrome*/
import React from "react";
import {Amplify, Auth} from "aws-amplify";
import { useForm } from "react-hook-form";
import { createMachine, interpret } from "xstate";
export const websiteActorMachine = createMachine({
  id: 'websiteActor',
  initial: 'loggedOut',
  states:{
    loggedOut:{
      on: {
        LOGIN: 'loggedIn'
      }
    },
    loggedIn: {
      on: {
        LOGOUT: 'loggedOut'
      }
    }
  }
});
export const webMachineService = interpret(websiteActorMachine).start()
webMachineService.onTransition((state) =>{
  console.log('from xstate machine...:', state.value)
})
try{
  console.log({
    mandatorySignIn: false,
      region: 'ap-south-1',
      userPoolId: 'ap-south-1_8haSJsosG',
      identityPoolId: 'ap-south-1:6dbc5396-527f-48c7-84b2-cc47d0aef6de',
      userPoolWebClientId: '42ve7kg7ccfmstt9e1lf3ha645'
  })
  Amplify.configure({
    ssr: true,
    Auth: {
      mandatorySignIn: false,
      region: 'ap-south-1',
      userPoolId: 'ap-south-1_8haSJsosG',
      identityPoolId: 'ap-south-1:6dbc5396-527f-48c7-84b2-cc47d0aef6de',
      userPoolWebClientId: '42ve7kg7ccfmstt9e1lf3ha645'
    },
    
  })
}catch(err){
  console.log("this is error miiheer",err)
}
const App = () => {
  const { register, handleSubmit} = useForm();
  
  async function signOut(){
    try{
      await Auth.signOut({ global: true });
      let tmp="signout"
      chrome.runtime.sendMessage("gkpegopglojebblakdfikifmojhpngbp", {userInfo:tmp}, function(res){
        if(res){
          console.log("logoutcheck",res)
          alert(res);
          webMachineService.send("LOGOUT")
        }
      })  
     // console.log("user is logged out");
    }catch (error) {
      console.log('error signing out: ', error);
    }
  }
  const onSubmit = (data) => {
    alert(data.password)
    Auth.signIn(data.username, data.password).then((user) => {
      //alert("hey")
      console.log("user is from frontend",user)
      chrome.runtime.sendMessage("gkpegopglojebblakdfikifmojhpngbp", {userInfo: user}, function(res){
        if(res){
          console.log(res, "response when login from CE")
          webMachineService.send("LOGIN");
          alert(res);
        }
      })    
    }).catch((err) => {
      console.log("got error in authentication... ",err)
      chrome.runtime.sendMessage("gkpegopglojebblakdfikifmojhpngbp", {Error: err}, function(res){
        if(res){
          console.log(res, "errrrrrrrrrrrrrrrrr")
         
        }
      })
    })
  };
  return (
    <div id="AppInfo_container" className="App">
      <p>from App miheer</p>  
      <form onSubmit={handleSubmit(onSubmit)}>
        <input defaultValue="mahi" {...register("username", { required: true })} />
        <input type="password" {...register("password", { required: true })} />
        <button type="submit">Login</button>
      </form>
      <div>
        <span>miheer</span>
      <button onClick={signOut}> logout </button>
      </div>
    </div>
  )
};
export default App;
