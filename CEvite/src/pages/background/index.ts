import reloadOnUpdate from "virtual:reload-on-update-in-background-script";
reloadOnUpdate("pages/background");
console.log("background@12345678 ");
import { createMachine, interpret } from 'xstate';
import { fromEvent } from 'rxjs';
import { from } from "rxjs";
import { Observable } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { mapValues } from "xstate/lib/utils";
console.log("started new background page.....")
interface ExternalMessage{
  message: any;
  sender: any;
  sendResponse: any;
}
async function querytographql(context,event){
  console.log("sending query to graphql")
  const url_get = "https://wrwtydy7y5grriv4a5k3nv46ju.appsync-api.ap-south-1.amazonaws.com/graphql"
  const token = context.accesstoken;
  const query = `
  query MyQuery($data: String) {
    cookieNotification(data: $data) {
      id
      marketplace
      notification
    }
  }`
  console.log(context.userdetails.userDetails.clientIDData, "CLIENT DETAILS")
  const variables = {
    data: JSON.stringify({clientDetails: context.userdetails.userDetails.clientIDData})
  }
  const option_get = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: query,
      variables
    }),
  }
  await fetch(url_get, option_get).then((x) => x.json()).then((res) => {
    console.log(res, "response of notifications from graphql")
    console.log(res.data.cookieNotification,"cookie array ..")
    console.log(typeof res.data,"type of response.data..",res.data);
    console.log(typeof res.data.cookieNotification,"typeof res.data.cookieNotification...",res.data.cookieNotification)
    console.log(typeof res,"type of res",res);
    context.notifications=res.data.cookieNotification;
    console.log(context.notifications,"these are notifications in context...");  
    //chrome.storage.local.set({notifications: res.data.cookieNotification})
  })
  }
async function getaccesstoken(context,event){
  const url1 = context.userdetails.credentials.client.endpoint;
  const refreshToken =context.userdetails.credentials.signInUserSession.refreshToken.token;
  const clientID = context.userdetails.credentials.pool.clientId;
  const params = {
    AuthFlow: "REFRESH_TOKEN_AUTH",
    ClientId: clientID,
    AuthParameters: {
      REFRESH_TOKEN: refreshToken,
    },
  };
  console.log("sending request to aws cognito to get access token from refresh token")
  const res = await fetch(url1, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-amz-json-1.1",
      "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth",
    },
    body: JSON.stringify(params),
  }).then((x) => x).catch((err) => err)
  const res_1 = await res.json()
   if(res_1){
     console.log("got response from aws cognito")
   }
  if(res_1.message == "Refresh Token has expired"){
    console.log("refresh token expired set webLoggedInStatus: false");
    //chrome.storage.local.set({webLoggedInStatus: false})
    context.loginstatus="false";
  }else{
    console.log("set webLoggedInStatus: true")
    context.loginstatus="true";
    //chrome.storage.local.set({webLoggedInStatus: true})
  }
  context.accesstoken=res_1.AuthenticationResult.AccessToken;
  
}

const serviceWorkerMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5SzAJwG4EsDGYDqA9qgNZoB0qYUmsALmpAMQCSAcgMoAqAggDK8BtAAwBdRKAAOBWJlqYCAO3EgAHogCMATgBsZTQFYhQgOw79mgMzaLx-QBoQATw1CALGVcAOAEybvn12MLQ2NjAF8whxQMHHwiUlQyTAU6AEMAG3SmbgBhTmYANW5OAFFhMSQQKRk5RWU1BFdvYzITG1DXN1t9IIdnBHU3Dx8-AKCQ8MiQaKxcQhJyAFdoiDBaVMx02AB9ADNUAgBbbcXMRm4AVU4ACRLWfJzistFlatl5JUqG406yTyFvCZ1N5vINtK57E4XO4vL5-IFgiZJlE0LM4gtEqlFrQABZgBRybCpeh7A7HVIAd1g2AIUAUsgI21Su3oqCZ6VSqEOtFQmCgMFQ5143AASgBZbacEXMADiMpKIvKr2k7zqXw0FiE6jI6mBnQhzVC3j60OGcLGiNCERRMTm8XIigynMOjAgijASQU6AIpDIM1i8wSZEdHK5CGS3qJtQU5SVlTe0fqGm0mk0f30+k8P3UrmCFisJoGQn0en+mosvm0PQrFmt01RAftiQAjos0I5aNJUWhXe7Pd7ff67RiyK3252Zmhw16CFGPrGXvGVYn1QhQcC9JofN4mhCrNptIXBiWt0Jy5Xq95a1Mh+ig9g8dhiNsaT7MGBGIdYFBO1IJIsJDjSRlw+JM13MEstFzTxPG0Tx1E8fR1AsI8hlhUYEQmOtb0DcgwBUHlUmwWgXwIN8P3YO4ABFthyAB5OiAGlmGeCpgJqUDV18LVWmBfRvHMTwLHg1xDyhIsYRGeFxiRCIpgUAhVngSocKbZUOLVUAGgAWjE-pdNaIwjOM4zkXrW073IShqDoBgIHU1VPi0xAmkLeDhh6BDkMsdRrGwhthyDZI0kySAHJXZyEAsdQSyzKxPB0YwTBMVxUPcTRjEBbQghzUJ2n8izcMSZY0FWdZNh2fYjhOTBws4yKMxLJKs0zQEs2MAI3O1LxPPgiwfL8m8AsszFsTxAkcGJMBSWqylqVpelOyZFk0HZZ0eT5AU6s01REE0IQ0x+IIOtTQIM00LqPNCYtNBzYtAgKtEiuDBQnS5banN2gYvG1GxXAy-QKz8e7Lp6g99DgzLmjPR7GxHMdUA7LsMDQD6wIQywyCvFNXGQnd+M0VLxPcnrrvMO79AeobCqbMgHzAJ9SPItGuNcX4d1zA6AR3LMif6EnELJ27OkB7RYcCvCCNQIiSNfYh3xZyLmlE1ptA56wOaQ0HBaS8mRapm0ntplAFAgOX322JaoGliQcWbdJFa+zVtG6wnfHgqsRj0xABZ6XXheLKw5LCIA */
  id: 'serviceWorker',
  initial: 'registered',
  context:{
    externalMessage:[],
    userdetails:null,
    loginstatus:null,
    accesstoken:null,
    notifications:null,
    cookies:[{jiomartcookie:null,meeshowcookie:null,flipcartcookie:null}],
    flipcartlocalstorage:null,
  },
  states:{
    registered: {
      entry:(context,event)=>{
       console.log("inside registered state.")
      },
       on: {
         INSTALL: 'installed',
       },
       
     },
     installed: {
       on: {
         ACTIVATE:'userdetails_from_ui'
       },
     },
    // waiting: {
    //  entry:(context,event)=>{
    //   console.log("entered at very first state...");
    //   // externalMessageSubject3.subscribe((FlipkartLocalStorage)=>{
    //   //   context.flipcartlocalstorage=FlipkartLocalStorage;
    //   // })
    //  // serviceWorkerService.send("CALL")
    //  },
    //  on: {
    //   CALL: 'userdetails_from_ui',
    // }, 
    // },    
            userdetails_from_ui:{
              entry:(context,event)=>{ 
                console.log("entery in userdetails from ui state")
                externalMessageSubject.subscribe(({ message, sender, sendResponse }) => {
                  console.log("inside hot observable")
                  console.log(`inside entry,checkauth,hot observable:--->${new Date().getMinutes()}:${new Date().getSeconds()}:${new Date().getMilliseconds()}`,message);
                  context.externalMessage.push({message, sender, sendResponse});
                  context.userdetails={
                  credentials: message.userInfo,
                  userDetails: {
                  signInUserSession: message.userInfo.signInUserSession , 
                  username: message.userInfo.username,
                  endpoint: message.userInfo.client.endpoint,
                  clientID: message.userInfo.pool.clientId,
                  clientIDData: JSON.parse(message.userInfo.attributes['custom:clientId'])
                },
                 }
                 sendResponse('Message received by the extension!');
                 serviceWorkerService.send('AUTHENTICATE')
                });
                  
              },
              on:{
                 AUTHENTICATE:'authenticate_from_awscognito_after_alarmtrigger' 
              }
            },
            authenticate_from_awscognito_after_alarmtrigger:{
              entry:(context,event)=>{
                
                 
                  if(context.userdetails.userDetails){
                    var alarmPeriod = context.userdetails.userDetails.clientIDData.alarm;
                    console.log("alarm period is",alarmPeriod);
                    var defaultPeriod = 15*60
                    if (context.userdetails.userDetails && context.userdetails.userDetails.clientIDData && context.userdetails.userDetails.clientIDData.alarm) {
                       console.log(alarmPeriod, 'already what it is(alram time)..');
                       alarmPeriod=1/3;
                       console.log(alarmPeriod,"now what it is(alarm time)...");
                      chrome.alarms.create("cookieAlarm", { periodInMinutes: alarmPeriod }); // alarm period
                    }
                    else{
                      console.log("not got alarm from user details part")
                      chrome.alarms.create("cookieAlarm", { periodInMinutes: 1/2 }); //default period
                    }
                  }
                  //No user details thats why do default period --- confirmed By Mahesh sir
                   else{
                     chrome.alarms.create("cookieAlarm", { periodInMinutes: 2 }); //default period
                   }
                
              },
              on:{
                 ALARM_TRIGGER:{
                  target:'onalarm',
                 }
              }
            },
            onalarm:{
              invoke: {
                src: 'getaccesstoken',
                onDone:{
                   //here add conditions like if not logged in then what to do for now iam assuming login is successfull
                  target:'querytoserver',
                  }
              }
            },
            querytoserver:{
              invoke: {
                src: 'querytographql',
                onDone:{
                   //here add conditions like if not logged in then what to do for now iam assuming login is successfull
                  
                  target:'check_cookie',
                   cond:'checknotifications'
                  }
              }
            },
           check_cookie:{
            entry:(context,event)=>{
              console.log("entry in check cookie state")
              context.notifications.map((x: any) => {
                // if(x.marketplace.includes("JIOMART")){
                //   if(context.cookies[0].jiomartcookie.length!==0){
                //     const mutation = `
                //       mutation MyMutation($data: String) {
                //         cookieNotification(data: $data) {
                //           marketplace
                //           notification
                //         }
                //       }`                                                                                             //{jiomartcookie:[{cookie:[],userinfo:[]}],meeshowcookie:[{cookie:[],userinfo:[]}],flipcartcookie:[{cookie:[],userinfo:[]}]}
                  // const variables = {
                  //   data: JSON.stringify({marketplace: "JIOMART", clientDetails: context.userdetails.userDetails.clientIDData, cookie: context.cookies[0].jiomartcookie[0].cookie, userInfo: context.cookies[0].jiomartcookie[0].userinfo })
                  // }
                //   const token=context.accesstoken
                //   const option = {
                //     method: "POST",
                //     headers: {
                //       "Content-Type": "application/json",
                //       Authorization: `Bearer ${token}`,
                //     },
                //     body: JSON.stringify({
                //       query: mutation,
                //       variables,
                //     }),
                //   }
                //   console.log("sending cookie to graphql")
                  let url_get="https://wrwtydy7y5grriv4a5k3nv46ju.appsync-api.ap-south-1.amazonaws.com/graphql"
                //   fetch(url_get, option).then((x) => x.json()).then(console.log).catch(console.log)
                //   }
                //   else{
                //     serviceWorkerService.send("msgtopopup");
                //   }
                // }
                if(x.marketplace.includes("FLIPKART")){
                    if(context.cookies[2].flipcartcookie!==null){
                        const mutation = `
                            mutation MyMutation($data: String) {
                            cookieNotification(data: $data) {
                                      marketplace
                                      notification
                                    }
                                  }`
                                  
                              const variables = {
                                data: JSON.stringify({ marketplace: "FLIPKART", clientDetails: context.userdetails.userDetails.clientIDData , cookie: context.cookies[2].flipcartcookie.Flipkart_cookie , storage: context.flipcartlocalstorage, userInfo: context.cookies[2].flipcartcookie.Flipkart_userInfo})
                              }
                              const option = {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                  Authorization: `Bearer ${context.accesstoken}`,
                                },
                                body: JSON.stringify({
                                  query: mutation,
                                  variables,
                                }),
                              }
                            fetch(url_get, option).then((x) => x.json()).then(console.log).catch(console.log)
                            }
                }
             })
           },
           on:{
            msgtopopup:{
              target:'extract_cookie',
            }
           }
          },
          extract_cookie:{
            entry:(context,event)=>{
              chrome.tabs.query({}, function(tabs) {
                console.log("chrome.tabs.query");
                tabs.map((x) => {
                  console.log("inside chrome.tabs..")
                  chrome.cookies.getAll({url: x.url}, function(cookie) {
                    console.log("inside chrome.cookies.getall..")
                    chrome.identity.getProfileUserInfo(function (userInfo) {
                      console.log("inside chrome.identity..")
                      if(x.url!.includes("seller.flipkart.com")){
                        console.log("in side cookie extraction logic and storing cookie in local.")
                        // chrome.storage.local.set({
                        //   flipkart_cookies: {
                            // Flipkart_cookie: cookie ,
                            //  Flipkart_userInfo: userInfo 
                        //   }
                        // })
                        const data={
                          Flipkart_cookie: cookie ,
                          Flipkart_userInfo: userInfo 
                        }
                      //  context.cookies[2]=data;
                      context.cookies[2].flipcartcookie={data}
                      serviceWorkerService.send('SEND_COOKIE');
                      }
                      else if(x.url!.includes('jiomart')){
                        chrome.storage.local.set({
                          Jiomart_cookies: {
                            Jiomart_cookie: cookie ,
                            Jiomart_userInfo: userInfo 
                          }
                        })
                      }
                      else if(x.url!.includes("supplier.meesho.com")){
                        chrome.storage.local.set({
                          Meesho_cookies: {
                            Meesho_cookie: cookie ,
                            Meesho_userInfo: userInfo 
                          }
                        })
                      }
                    })
                  });
                })
              });
            },
            on:{
              SEND_COOKIE:{
                target:'sendcookie_to_graphql'
              }
            }                                                                                                     
          },
           sendcookie_to_graphql:{
            entry:(context,event)=>{
              
              context.notifications.map((x: any)=>{
                console.log("inside map..")
                if(x.marketplace.includes("FLIPKART")){
                  console.log("inside flipcart if else block of cookie sending part ",context.cookies[2])
                 
                  if(context.cookies[2]){
                    const mutation = `
                      mutation MyMutation($data: String) {
                        cookieNotification(data: $data) {
                          marketplace
                          notification
                        }
                      }`
                  const variables = {
                   // data: JSON.stringify({ marketplace: "FLIPKART", clientDetails: context.userdetails.userDetails.clientIDData , cookie: context.cookies[2].flipcartcookie , storage: item.Flipkart_storage, userInfo: context.cookies[0].jiomartcookie[0].userinfo})
                  }
                  const option = {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${context.accesstoken}`,
                    },
                    body: JSON.stringify({
                      query: mutation,
                      variables,
                    }),
                  }
                  fetch("https://wrwtydy7y5grriv4a5k3nv46ju.appsync-api.ap-south-1.amazonaws.com/graphql", option).then((x) => x.json()).then(console.log).catch(console.log)
                  }
                }
             
              })
            }
           }
          }  
  },
    {
      services: {        
         getaccesstoken, 
         querytographql,
      },
      guards:{
     checknotifications:(context,event)=>{
      console.log("request processed")
      console.log(context.notifications);
      return context.notifications!==null;
   }
      }
   }
  );
const serviceWorkerService = interpret(serviceWorkerMachine).start();
 serviceWorkerService.onTransition((state) => {
    console.log('Current State from xstate:', state.value);
    if(serviceWorkerService.state.matches('error')){
      console.log("error occured bro for the request.")
    }
   });
fromEvent(self, 'install').subscribe((event) => {
  console.log(`service worker state now:---> ${event.type}`);
  serviceWorkerService.send('INSTALL'); 
});
fromEvent(self, 'activate').subscribe((event) => {
  console.log(`service worker state now:---> ${event.type}`);
  serviceWorkerService.send('ACTIVATE');
});
//------------->
// const externalMessageSubject = new Subject<ExternalMessage>();
// chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
//   serviceWorkerService.send("CALL");
//   console.log(`inside chrome.runtime.onmessageExternal:--->${new Date().getMinutes()}:${new Date().getSeconds()}:${new Date().getMilliseconds()}`,message);
//   externalMessageSubject.next({
//     message,
//     sender,
//     sendResponse,
//   });
// });
//----------------------------------------->
const externalMessageSubject = new Subject<ExternalMessage>();
chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse)=>{
  
    console.log('in .onMessageExternal of subject ', message);
    // if(message.flipkart){
    //   console.log('Received message from front end:', message.flipkart);
    // }
    
      console.log("user info below")
      console.log(message.userInfo)
     console.log("sending message inside observable...")
    //  externalMessageSubject.next({
    //   message,
    //   sender,
    //   sendResponse,
    // });
    
    //   console.log("ok")
    //   externalMessageSubject.subscribe(({ message, sender, sendResponse }) => {
    //     console.log(`inside entry,activated,hot observable:--->${new Date().getMinutes()}:${new Date().getSeconds()}:${new Date().getMilliseconds()}`,message);
    //   }); 
   
    
    externalMessageSubject.next({message, sender, sendResponse });
    
      console.log("ok")
      externalMessageSubject.subscribe(({ message, sender, sendResponse }) => {
        console.log(`inside entry,activated,hot observable:--->${new Date().getMinutes()}:${new Date().getSeconds()}:${new Date().getMilliseconds()}`,message);
      });
    
    
      
     
       // serviceWorkerService.send("CALL");
     
      
    
    // else{
    //   // chrome.storage.local.set({webLoggedInStatus: false})
    //    sendResponse("ok user logged out.");
    // }
});
//---------------------------------------->
chrome.alarms.onAlarm.addListener(function(alarm) {
  if(alarm){
    serviceWorkerService.send("ALARM_TRIGGER");
  }
});
//----------------------------------------
//const externalMessageSubject3 = new Subject<ExternalMessage>();
// chrome.runtime.onMessage.addListener((request: any, sender:any, sendResponse:any) => {
//   console.log(request)
//   if(request.FlipkartLocalStorage){
//    // externalMessageSubject3.next(request.FlipkartLocalStorage)
//     // chrome.storage.local.set({
//     //   Flipkart_storage: JSON.parse(request.FlipkartLocalStorage)      
//     // })
    
//     sendResponse({data: "Received Data for Flipkart"})
//     return true
//   }
//   if(request.MeeshoLocalStorage){
//     chrome.storage.local.set({
//       Meesho_storage: request.MeeshoLocalStorage
//     })
//     sendResponse({data: "Received Data for Meesho"})
//     return true
//   }
// })











