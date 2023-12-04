/**
 * @description
 * Chrome extensions don't support modules in content scripts.
*/
import("./components/Demo");
console.log("content loadeddddddddd");
console.log("hello from contentScripts");
window.postMessage({message: "extensionInstalled"}, "*")
if (window.location.href.includes("seller.flipkart.com")){
  // Access the localStorage of the website
  var localStorageValue = window.localStorage.getItem('__appData');
  console.log(localStorageValue, "from contentscript")
  chrome.runtime.sendMessage({ FlipkartLocalStorage: localStorageValue}, function(response){
    console.log(response)
  })
}
if(window.location.href.includes("supplier.meesho.com")){
    var localStorageMeesho = window.localStorage.getItem("WZRK_L")
    console.log(localStorageMeesho, "from contentscript")
    chrome.runtime.sendMessage({ MeeshoLocalStorage: localStorageMeesho }, function(response){
      console.log(response,"from content script")
    })
}
