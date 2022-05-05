chrome.runtime.onInstalled.addListener(()=>{
    let arrUrl = []
    chrome.storage.sync.set({arrUrl})

})
