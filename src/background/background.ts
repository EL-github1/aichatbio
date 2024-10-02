import Browser from 'webextension-polyfill'
import { getHtmlAccessionNumberSearch, getHtmlPubMedSearch,getHtmlVariantSearch,getHtmlPMCSearch,getHtmlPubMedVarSearch } from '../content-scripts/triggerSearch'

let sender_tab_id="";
let  ncbitabId="";

const manifest_version = Browser.runtime.getManifest().manifest_version

Browser.runtime.onInstalled.addListener(async () => launchChatGPTWebpage())

function launchChatGPTWebpage() {
    Browser.tabs.create({
        url: "https://chatgpt.com/?oai-dm=1",
    })
}






chrome.runtime.onMessage.addListener((message, sender) => {
  // The callback for runtime.onMessage must return falsy if we're not sending a response
  (async () => {
    if (message.type === 'open_side_panel' || message.type === 'open_side_panelUCSD') {
      sender_tab_id=sender.tab.id;
      console.log("this is sender id: "+sender.tab.id);
      // This will open a tab-specific side panel only on the current tab.
      await chrome.sidePanel.open({ tabId: sender.tab.id });
      await chrome.sidePanel.setOptions({
        tabId: sender.tab.id,
        path: 'sidepanel-tab.html',
        enabled: true
      });
    }
  })();
});


async function openTabWithSidePanel(url) {
     
    Browser.tabs.create({ url: url }).then((tab) => {
       
      console.log("open")
      if (typeof tab.id === 'number') 
      {
        Browser.scripting.insertCSS({
          target: { tabId: tab.id },
          files: ['ncbi.css']
        }).then(() => {
          console.log('CSS injected.');
        }).catch((error) => {
          console.error('Error injecting CSS:', error);
        });
        console.log("inject css");
      } 
      else 
      {
        //console.error('Failed to get tab ID');
      }
    })
  }


  


if (manifest_version == 2) {
    Browser.browserAction.onClicked.addListener(launchChatGPTWebpage)
} else {
    Browser.action.onClicked.addListener(launchChatGPTWebpage)
}


Browser.runtime.onMessage.addListener((message) => {
    if (message.type === "getHtmlAccessionNumberSearch") {
        return getHtmlAccessionNumberSearch(message.search)
    }
    if (message.type === "getHtmlPubMedSearch") {
        return getHtmlPubMedSearch(message.search)
    }
    if (message.type === "getHtmlVariantSearch") {
        return getHtmlVariantSearch(message.search)
    }
    if (message.type === "getHtmlPMCSearch") {
        return getHtmlPMCSearch(message.search)
    }
    if (message.type ==="getHtmlPubMedVarSearch") {
        return getHtmlPubMedVarSearch(message.search)
    }
    if (message.type ==="education_demo") 
    {

    }
    if (message.type ==="test") 
    {
        // For the debug purpose to ensure background.js can send the message to side panel, if background receive a message with message.type = test
        sendMessageToSidePanel("Hello from the content script via background");
    }
})

Browser.runtime.onMessage.addListener((request) => 
  {
    if (request === "show_options") 
    {
        Browser.runtime.openOptionsPage()
    }
    if (request === "education_demo") 
    {
        openTabWithSidePanel("https://www.ncbi.nlm.nih.gov/tools/primer-blast/");
    }
    if (request === "education_demoUCSD") 
      {
          openTabWithSidePanel("https://genome.ucsc.edu/cgi-bin/hgPcr");
      }
  })




    // the request.txt is the info foer the imput elements, the info will be sent back to the original chatGPT tab
    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) 
    {
      if (message.message === "input_element_from_ncbi") {
        console.log(" successfully receiving message at bg which is sent from NCBI webpage", message.text);
  
        sendMessageToSidePanel(message.text)
      }
    });




chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "FROM_SIDE_PANEL") {
    console.log("Message from side panel:", message.data);
    sendResponse({ response: "Data receive by background" });
    return true;
  }
});

function sendMessageToSidePanel(message) {
  chrome.storage.local.set({ messageFrom_NCBI_B: message }, () => {
    console.log("Message sent to side panel: x", message);
  });
}





