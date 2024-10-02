import '../style/base.css'
import '../tailwind.min.css'
import { h, render } from 'preact'
import {  getForm, getBody,getTextArea, getRootElement, getSubmitButton, getChatbioControlbar, getEducationDemo } from '../tools/elementFinder'
import Controlbar from '../components/controlbar'
import Footer from '../components/footer'
import { getConfig, Config } from '../tools/configManager'
import createInsertionRoot from '../tools/createInsertionRoot'
import {varCompilePrompt,pubMedCompilePrompt, compilePrompt_primer_design_link, compilePrompt_primer_designer , compilePrompt_primer_designer_education, } from '../tools/promptOrganizer'
let isProcessing = false
let updatingInterface = false
let chatGptFooter: HTMLDivElement | null

let rootEl = getRootElement()
let submitButton: HTMLButtonElement | null | undefined
let textArea: HTMLTextAreaElement | null
let controlbar: HTMLElement | null


export async function onPCR_Designer_Declare() {

  const userConfig = await getConfig();
  var query = (await compilePrompt_primer_designer()).toString()

  textArea = getTextArea()
  submitButton = getSubmitButton()
  

  if (textArea && submitButton) {

      textArea.value = query;
      const inputEvent = new Event("input", { bubbles: true });
      textArea.dispatchEvent(inputEvent);
      submitButton.disabled = false;
      submitButton.click();
  } 
 }

 

 export async function onPCR_Designer_Declare_Education() {

  const userConfig = await getConfig();
  var query = (await compilePrompt_primer_designer_education()).toString();
  textArea = getTextArea();
  submitButton = getSubmitButton();
  
  await handleSubmit(query)

  if (textArea && submitButton) {
      textArea.value = query;
      textArea.style.backgroundColor="light blue"
      const inputEvent = new Event("input", { bubbles: true });
      textArea.dispatchEvent(inputEvent);
      submitButton.disabled = false;
      submitButton.click();
  } 
 } 
 export async function onResearch_Repoter(query) {

  const userConfig = await getConfig();
  let results = await processQuery_medline(query, userConfig);
  let compiledPrompt = await pubMedCompilePrompt(results, query, userConfig.education, userConfig.language);
  var query = (await compilePrompt_primer_designer_education()).toString();
  textArea = getTextArea();
  submitButton = getSubmitButton();
  
  await handleSubmit(query)

  if (textArea && submitButton) {
      textArea.value = query;
      textArea.style.backgroundColor="light blue"
      const inputEvent = new Event("input", { bubbles: true });
      textArea.dispatchEvent(inputEvent);
      submitButton.disabled = false;
      submitButton.click();
  } 
 } 


async function renderControlbar() {
  try {
     
      textArea = getTextArea()
      const textareaParentParent = textArea?.parentElement?.parentElement?.parentElement
      const { insertionRootDiv, insertionRoot } = await createInsertionRoot('tailwind.min.css')//await createInsertionRoot('content-scripts/mainUI.css')
      insertionRootDiv.classList.add('cb-toolbar')
      textareaParentParent?.appendChild(insertionRootDiv)

      render(<Controlbar textarea={textArea} />, insertionRoot)
      //render(<MyComponent />,  insertionRootDiv)
      console.log("renderControlbar() is just triggered")
  } catch (e) 
  {
      if (e instanceof Error) 
      {
          //showErrorMessage(Error(`Error loading ChatbioGPT Controlbar: ${e.message}. Please reload the page (F5).`))
      }
  }
}



async function processQuery_primer(query: string | undefined , userConfig: Config) {

   console.log("in processQuery_primer, query "+query)

    let accession_search_results: SearchResult[]
    let primer_design_link : string ="" ;
    primer_design_link="None";
    const searchRequest: SearchRequest = 
    {
            query:query ||"",
            userConfig
    }
    accession_search_results = await getAccessionNumbersByOrganismAndGene(searchRequest, userConfig);
    if(accession_search_results.length==0) return ["Null", "Zero_accessionSearch"];
    accession_search_results.forEach(result => {
      console.log(result.body); 
  });

    console.log("accessionSearch result in processQuery_primer, number of results :"+accession_search_results[0].url)
    if(accession_search_results.length > 0 || accession_search_results[0].url!="")
    {
            console.log("accession_search_results.length "+accession_search_results.length);
            console.log("accession_search_results body   "+accession_search_results[0].body);
            primer_design_link = await submitPrimerBLAST_link_return(accession_search_results[0].body);
            console.log("in processQuery_primer, primer_design_link :"+primer_design_link);
            if(primer_design_link == "None" )
            {
              alert("primer design link is null")
            }
            return [accession_search_results[0].body, primer_design_link]
    }
    else
    {
      alert("Zero accession number");
      primer_design_link="Zero_accessionSearch";
      console.log("accessionSearch returns no result as indicated on carring out processQuery_primer function");
      return ["Null", "Zero_accessionSearch"]
    }
    
   
}


async function upDateInterface() {

    if (updatingInterface)  return  

        updatingInterface = true;
       
        const textArea = getTextArea();
        submitButton = getSubmitButton();

            controlbar = getChatbioControlbar();
            if (!textArea) {
                controlbar?.remove();
                return
            }

    if (controlbar) return
    
    if (window.location.href.startsWith("https://chatgpt.com/"))
    {
      await renderControlbar();
      injectProcessingMessage();

    }

    submitButton?.addEventListener("click", onSubmit, { capture: true });

    textArea?.addEventListener("keydown", onSubmit, { capture: true });
    textArea.style.backgroundColor="light blue";
    updatingInterface = false
    
if(textArea)
   {
     textArea.style.backgroundColor="lightblue";

  }
   
}


// monitor any change event from web page
function observeMutations(targetNode: HTMLElement) 
{
 
   textArea = getTextArea()
   
  //textArea.style.background = "#FF5733"
    return new Promise<void>((resolve) => {

      const observer = new MutationObserver(async (mutationsList, observer) => {
        for (const mutation of mutationsList) {
          const targetElement = mutation.target as HTMLElement;
        
          if (targetElement.hasAttribute("data-message-author-role")) {  
            let GPTs_reply = targetElement.firstChild?.textContent?.toString().trim();
            }
          
          if (
            targetElement.textContent?.match(/@[^@]+@/) &&
            targetElement.nodeName.toString() === "DIV" //&&
          ) {
            const text = targetElement.textContent;
            const match1 = text?.match(/@([^@]+)@/);
            const parsedGene = match1 ? match1[1] : undefined;
            const match2 = text?.match(/&([^&]+)&/);
            const parsedOrg = match2 ? match2[1] : undefined;

             let primer_design_link = "";
             let accession_number = "";
            if ( Array.from(targetElement.classList).join("_").toString()=="markdown_prose_w-full_break-words_dark:prose-invert_light"){

             showProcessingMessage();
              try {
                const userConfig = await getConfig();

                [accession_number, primer_design_link] =await processQuery_primer(parsedGene+"[Gene] AND "+parsedOrg+"[Organism]", userConfig);
                console.log("primer_design_link in Mutation Observer "+primer_design_link)
                let compiledPrompt = ""
                if(primer_design_link == null)
                {
                   console.log("primer_design_link is null when used at observeMutations")
                }
                else if(primer_design_link =="Zero_accessionSearch" || primer_design_link.replace(/^\s+|\s+$/g, '') ==""){
                  compiledPrompt =" Sorry, given the gene and organism, within a reasonable range of DNA template size, the corresponding accession number can not be found in NCBI database. Please try a different query to have a different gene or specise!"
                }
                else
                {
                  if (primer_design_link != "Zero_accessionSearch") {
                  compiledPrompt = await compilePrompt_primer_design_link(accession_number,primer_design_link);
                  }
                  else{
                    alert("sorry primer_design_link is an empty string")
                  }
                }

                targetElement.textContent="";
                var link = document.createElement('a');

                if (primer_design_link !== undefined && primer_design_link !== "Zero_accessionSearch") {
                      link.href=primer_design_link;
                      link.textContent = `This organism: ${parsedOrg} and gene: ${parsedGene} are used in the primer design.; The NCBI accession number : ${accession_number} is used for the target sequence. `+compiledPrompt;
                      targetElement.appendChild(link);
                }
                else if (primer_design_link =="Zero_accessionSearch")
                {
                  targetElement.textContent=`This organism: ${parsedOrg} and gene: ${parsedGene} are used in the primer design. However, within the default search scope, there is no suitable sequence available. Please try again.`
                }  
                else {
                   targetElement.textContent="Sorry, I could not find any qualified PCR primers design with the criteria that you provided at this time";
                    console.error("The primer_design_link is undefined.");
                }
                 
              } catch (error) {
                if (error instanceof Error) {
                }
              }finally {
                hideProcessingMessage();
            }
            }
          }

        }
        resolve(); 
      });
  
      const config: MutationObserverInit = {
        attributes: true,
        childList: true,
        subtree: true,
      };
      observer.observe(targetNode, config);



    });
}
  

  window.onload = function () {

    setTimeout(upDateInterface, 2000);

  if (window.location.href.startsWith("https://chatgpt.com/"))
    {

      observeMutations(rootEl)
      .then(() => {
        console.log('Mutation observation completed.');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
      return 
    }


  };



async function handleSubmit(query) {
  if (!textArea) return;

  const userConfig = await getConfig();

  if (userConfig.webAccess == 2 && !userConfig.education_mode) {

      textArea.value = query;
      pressEnter();
  } else {
      try {
          let results;
          let compiledPrompt = "";
          
          if (userConfig.webAccess == 3 && !userConfig.education_mode) {
              results = await processQuery_litvar(query, userConfig);
              compiledPrompt = await varCompilePrompt(results, query, userConfig.education, userConfig.language);
          } else if (userConfig.webAccess == 1 && !userConfig.education_mode) {
              results = await processQuery_medline(query, userConfig);
              compiledPrompt = await pubMedCompilePrompt(results, query, userConfig.education, userConfig.language);
          }

          if (!userConfig.education_mode) {
              textArea.value = compiledPrompt;
          } else {
              textArea.value = query;
          }
          pressEnter();
      } catch (error) {
          if (error instanceof Error) {
              console.error(error);
          }
      }
  }
}

  async function onSubmit(event) {

    
    const isKeyEvent = event instanceof KeyboardEvent
    
    if (!textArea) return

    if (isKeyEvent && event.shiftKey && event.key === 'Enter') return

    if (isKeyEvent && event.key === 'Enter' && event.isComposing) return
    if (isKeyEvent && event.key === 'Enter')
    {
      event.preventDefault();
      event.stopPropagation();
      console.log('blocking');
    }

    if (!isProcessing && (event.type === "click" || (isKeyEvent && event.key === 'Enter')))
       {

        const query = textArea?.value.trim();
        if (!query) return
        
        isProcessing = true
        textArea.readOnly=true
        const userConfig = await getConfig()
        await handleSubmit(query)
        textArea.readOnly=false
        isProcessing = false
    }
  }
  
  
  function pressEnter() {
    console.log("in pressEnter, pressEnter is triggered");

    textArea = getTextArea();
    submitButton = getSubmitButton();
    


    const inputEvent = new Event("input", { bubbles: true });
    textArea.dispatchEvent(inputEvent);



  if (!submitButton) {
      console.log("Submit Button not found.");
      return;
  }
  if (!submitButton.disabled) {
      console.log("Submit Button is enabled.");
  }

    submitButton.click();


    textArea.value = '';

}


async function processQuery_medline(query: string|undefined, userConfig: Config) {

  let results: PubMedSearchResult[]
  
  const searchRequest: SearchRequest = {
      query,
      userConfig
  }

  results = await pubmedSearch(searchRequest, userConfig)

  return results
}


// // Given rs id, return a  PubMedSearchResult json object ( multiple records)
async function processQuery_litvar(query: string|undefined, userConfig: Config) {
  
  let query_varid :string ='';
  let results_for_pubmed: PubMedSearchResult[] | undefined;

  let searchRequest: SearchRequest = {
      query,
      userConfig
  }

      query_varid = await LitVarSearch(searchRequest, userConfig);

      searchRequest = {
        query: query_varid,
        userConfig
      }

  let pmcids=await LitPMCSearch(searchRequest, userConfig);

  results_for_pubmed= await processPmcids(pmcids.slice(0,2), userConfig);
  
  console.log("in processQuery_litvar end,  %%%%%%%%%%%%%%%%%"+results_for_pubmed[0]['url']);

  return results_for_pubmed
}




// // Given an array of pmcids, return a  PubMedSearchResult json object ( multiple records)
async function processPmcids(pmcids: string[], userConfig: any) {

  let result: PubMedSearchResult | undefined;
  let results: PubMedSearchResult[] = [];
  for (let pmcid of pmcids) {

    let searchRequest = {
      query: pmcid,
      userConfig,
    };

    result = await pubmedVarSearch(searchRequest, userConfig);
    results.push(result);
  }

  if (results.length > 0) {
    for (const result of results) {
      console.log("--------------------------------------------------------------------------------------------------");
    }
  }
  return results;
}





function sendMessageToBackground_N(element_id) {

  chrome.runtime.sendMessage({ message: "input_element_from_ncbi", text: element_id }, function(response) {
    console.log("Response from background:", response);
  });

}

function handleMouseOver(event: MouseEvent) {

  const target = event.target as HTMLElement;

    target.classList.add('red-border')
    if (target) { 
      
      addHoverEffect(target);
    }
    



}

let hoverTimer: NodeJS.Timeout | null = null; 
function addHoverEffect(element: HTMLElement): void {
  
  
  element.addEventListener('mouseenter', () => {
    hoverTimer = setTimeout(() => sendMessageToBackground_N(element.id), 10000);
    element.classList.add('red-border');

  });

  element?.addEventListener('mouseout', function() {
    if (hoverTimer) {
      clearTimeout(hoverTimer); // Clear the timeout if it exists
      hoverTimer = null; // Reset hoverTimer after clearing
    }

  });


}



// Function to enable mouseover detection
function enableMouseOverDetection() {
  document.addEventListener('mouseover', handleMouseOver);

}



// Check the current page URL to set the initial state
if ( window.location.href.includes('https://www.ncbi.nlm.nih.gov/tools/primer-blast/' )) {
  enableMouseOverDetection();
}




function getElementsByDataMessageAuthorRole(): HTMLElement[] {
  // Use querySelectorAll to find all elements with the specified attribute
  const elements = document.querySelectorAll('[data-message-author-role]');
  // Convert NodeList to Array
  const elementsArray = Array.from(elements) as HTMLElement[];

  return elementsArray;
}



function getSingleElementsByDataMessageAuthorRole(): string {
  // Use querySelectorAll to find all elements with the specified attribute
  const elements = document.querySelectorAll('[data-message-author-role]');
  // Convert NodeList to Array
  const elementsArray = Array.from(elements) as HTMLElement[];
  if (elementsArray.length >0)
  {
    return elementsArray[0].textContent;
  }
  else{
    return "x";
  }

}



//=======================color elements==========
chrome.storage.onChanged.addListener((changes, namespace) => {

  chrome.storage.local.get('savedIndices', function(result) {
    if (result.savedIndices) {
      removeColorBorders();

    } else {
      console.log('No indices found in storage');
    }

});
})
const color_map = [
  { index: 1, name: "N/A", id: "OneTargTab", color: "#FF0000" }, // Red
  { index: 2, name: "N/A", id: "GroupTagrTab", color: "#00FF00" }, // Green
  { index: 3, name: "SEQFILE", id: "upl", color: "#0000FF" }, // Blue
  { index: 4, name: "PRIMER5_START", id: "PRIMER5_START", color: "#FFFF00" }, // Yellow
  { index: 5, name: "PRIMER5_END", id: "PRIMER5_END", color: "#FF00FF" }, // Magenta
  { index: 6, name: "PRIMER3_START", id: "PRIMER3_START", color: "#00FFFF" }, // Cyan
  { index: 7, name: "PRIMER3_END", id: "PRIMER3_END", color: "#C0C0C0" }, // Silver
  { index: 8, name: "PRIMER_LEFT_INPUT", id: "PRIMER_LEFT_INPUT", color: "#808080" }, // Gray
  { index: 9, name: "PRIMER_RIGHT_INPUT", id: "PRIMER_RIGHT_INPUT", color: "#800000" }, // Maroon
  { index: 10, name: "PRIMER_PRODUCT_MIN", id: "PRIMER_PRODUCT_MIN", color: "#008000" }, // Dark Green
  { index: 11, name: "PRIMER_PRODUCT_MAX", id: "PRIMER_PRODUCT_MAX", color: "#000080" }, // Navy
  { index: 12, name: "PRIMER_NUM_RETURN", id: "PRIMER_NUM_RETURN", color: "#808000" }, // Olive
  { index: 13, name: "PRIMER_MIN_TM", id: "PRIMER_MIN_TM", color: "#800080" }, // Purple
  { index: 14, name: "PRIMER_OPT_TM", id: "PRIMER_OPT_TM", color: "#008080" }, // Teal
  { index: 15, name: "PRIMER_MAX_TM", id: "PRIMER_MAX_TM", color: "#FF6347" }, // Tomato
  { index: 16, name: "PRIMER_MAX_DIFF_TM", id: "PRIMER_MAX_DIFF_TM", color: "#40E0D0" }, // Turquoise
  { index: 17, name: "SPLICE_SITE_OVERLAP_5END", id: "SPLICE_SITE_OVERLAP_5END", color: "#F0E68C" }, // Khaki
  { index: 18, name: "SPLICE_SITE_OVERLAP_3END", id: "SPLICE_SITE_OVERLAP_3END", color: "#E6E6FA" }, // Lavender
  { index: 19, name: "SPLICE_SITE_OVERLAP_3END_MAX", id: "SPLICE_SITE_OVERLAP_3END_MAX", color: "#FFFACD" }, // Lemon Chiffon
  { index: 20, name: "SPAN_INTRON", id: "SPAN_INTRON", color: "#D3D3D3" }, // Light Gray
  { index: 21, name: "MIN_INTRON_SIZE", id: "MIN_INTRON_SIZE", color: "#C71585" }, // Medium Violet Red
  { index: 22, name: "MAX_INTRON_SIZE", id: "MAX_INTRON_SIZE", color: "#DC143C" }, // Crimson
  { index: 23, name: "SEARCH_SPECIFIC_PRIMER", id: "SEARCH_SPECIFIC_PRIMER", color: "#FF1493" }, // Deep Pink
  { index: 24, name: "CUSTOMSEQFILE", id: "N/A", color: "#FF4500" }, // Orange Red
  { index: 25, name: "N/A", id: "primerSpecDBID", color: "#FFD700" }, // Gold
  { index: 26, name: "EXCLUDE_XM", id: "EXCLUDE_XM", color: "#ADFF2F" }, // Green Yellow
  { index: 27, name: "EXCLUDE_ENV", id: "EXCLUDE_ENV", color: "#F5F5DC" }, // Beige
  { index: 28, name: "ORGANISM", id: "ORGANISM", color: "#DCDCDC" }, // Gainsboro
  { index: 29, name: "N/A", id: "AddOrg", color: "#F0F8FF" }, // Alice Blue
  { index: 30, name: "ALLOW_NO_ORGANISM", id: "ALLOW_NO_ORGANISM", color: "#FAEBD7" }, // Antique White
  { index: 31, name: "N/A", id: "numOrg", color: "#D3D3D3" }, // Light Gray
  { index: 32, name: "ORG_DBS", id: "orgDbs", color: "#D8BFD8" }, // Thistle
];


function getColorInfo(inputList) {
  return inputList.map(num => {
    const colorInfo = color_map.find(item => item.index === num);
    return colorInfo ? { id: colorInfo.id, color: colorInfo.color } : null;
  }).filter(item => item !== null);
}

function applyBorderColor(elementsInfo) {
  elementsInfo.forEach(info => {
    const element = document.getElementById(info.id);
    if (element) {
      element.style.setProperty('border', `6px solid ${info.color}`, 'important');
    }
  });
}

function removeColorBorders() {
  color_map.forEach(item => {
      const element = document.getElementById(item.id);
      if (element) {
          element.style.borderColor = 'transparent';
      }
  });
}
//====================makup processing message
// Function to inject processing message into the page
function injectProcessingMessage() {
  const processingMessage = document.createElement('div');
  processingMessage.id = 'processingMessage';
  processingMessage.style.position = 'fixed';
  processingMessage.style.top = '50%';
  processingMessage.style.left = '50%';
  processingMessage.style.transform = 'translate(-50%, -50%)';
  processingMessage.style.backgroundColor = 'rgba(0,0,0,0.8)';
  processingMessage.style.color = 'white';
  processingMessage.style.padding = '10px';
  processingMessage.style.borderRadius = '5px';
  processingMessage.style.zIndex = '10000'; // Ensure it is on top
  processingMessage.style.display = 'none'; // Hidden by default
  processingMessage.textContent = 'Processing, please wait...';
  document.body.appendChild(processingMessage);
}

// Function to show the processing message
function showProcessingMessage() {
  const processingMessage = document.getElementById('processingMessage');
  if (processingMessage) {
      processingMessage.style.display = 'block';
  }
}

// Function to hide the processing message
function hideProcessingMessage() {
  const processingMessage = document.getElementById('processingMessage');
  if (processingMessage) {
      processingMessage.style.display = 'none';
  }
}

// Inject processing message on script load
injectProcessingMessage();
