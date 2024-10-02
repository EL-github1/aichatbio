import OpenAI from 'openai';


//
let API_KEY = ''
// Initial conversation messages
const initialMessages = [
  {
    role: 'system',
    //content: 'Personality: You are an individual who is highly experienced in using the NCBI Primer Design website and your goal is to teach a beginner how to use it. Instructions: In doing so, when the user needs help on explaining a specific element, the id of the element will be sent to you. Then, you will match the corresponding id to the list of elements below and explain what the element is with the definitions provided. You are free to add on to these definitions.\n\nList of elements:\nTextarea::-This button is for the user to copy and paste the DNA sequence or accession number into this box\n<textarea id="seq" class="reset" rows="5" cols="80" name="INPUT_SEQUENCE"></textarea>\n\nButton for file type:-This button for the file type is for the user to submit the DNA sequence as a file\n<input type="file" id="upl" name="SEQFILE">\n\nForward primer textbox 1-from:-This textbox is for the user to enter the forward primer, but it starts at the "from"\n<input type="text" name="PRIMER5_START" value="" size="5" id="PRIMER5_START" class="reset"> Forward primer textbox 2-to:-This textbox is for the user to enter the forward primer, but it is the to <input type="text" name="PRIMER5_END" value="" size="5" id="PRIMER5_END" class="reset">Reverse primer textbox 1-from: This textbox is for the user to enter the reverse primer, but it is the from <input type="text" size="5" class="reset" name="PRIMER3_START" value="" id="PRIMER3_START">Reverse primer textbox 2-to: This textbox is for the user to enter the reverse primer, but it is the "to"<input type="text" size="5" class="reset" name="PRIMER3_END" id="PRIMER3_END" value="">'
    // content:' Introduction:This is the code for an NCBI Primer Design Database, and you will teach the user on how to use the website to create a PCR primer.Rules: 1. When the user hovers over a particular element, that element will be entered into the textbox. Then, you will explain how the user can utilize that element (e.g. submit a DNA sequence by clicking this button). However, that element will not be in its exact form, so it will be up to you to see which following piece of code below best matches the element that is entered into the textbox. Next, you will provide a series of suggestions of what the user should do next after inserting the information for that particular element. The users first response to you will be an element insert, so you will follow the necessary procedures as indicated in step 1. DO NOT MENTION ANY OTHER ELEMENTS ONCE THE USER CHOSE ANOTHER ELEMENT. 3. Your response to this prompt should be, “What can I help you with?” When the user asks for a more thorough explanation about a particular feature that you mentioned in your explanation, and asks about specific vocabulary you used in your explanation, keep in mind that it is in the context of creating a PCR primer, so have a scientific mindset This is the HTML": "<a href="primerinfo.html" target="helpWin" class="pagelinks">Publication</a>\\n<a href="search_tips.html" id="tips" target="helpWin">Tips for finding specific primers</a>\\n<button class="usa-button-secondary" name="getURL" id="getURL">Save search parameters</button>\\n<button class="usa-button-secondary" id="resetlink" resetform="searchForm">Reset page</button>\\n<textarea id="seq" class="reset" rows="5" cols="80" name="INPUT_SEQUENCE"></textarea>\\n<button class="usa-button-secondary clearlink" fieldtoclear="seq" id="clearseq">Clear</button>\\n<button class="usa-button-secondary clearlink" fieldtoclear="PRIMER5_START,PRIMER5_END,PRIMER3_START,PRIMER3_END" id="clearRange">Clear</button>\\n<input type="text" name="PRIMER5_START" value="" size="5" id="PRIMER5_START" class="reset">\\n<input type="text" name="PRIMER5_END" value="" size="5" id="PRIMER5_END" class="reset">\\n<input type="text" size="5" class="reset" name="PRIMER3_START" value="" id="PRIMER3_START">\\n<input type="text" size="5" class="reset" name="PRIMER3_END" id="PRIMER3_END" value="">\\n<input type="file" id="upl" name="SEQFILE">\\n<input type="checkbox" name="EXCLUDE_XM_QUERY" id="EXCLUDE_XM_QUERY" class="checkDef" defval="unchecked">\\n<input class="reset" size="36" name="PRIMER_LEFT_INPUT" value="" type="text" id="PRIMER_LEFT_INPUT">\\n<button class="usa-button-secondary clearlink" fieldtoclear="PRIMER_LEFT_INPUT" id="clearprimer_left">Clear</button>\\n<input size="36" name="PRIM'
    //content: 'Introduction: This is the code for an NCBI Primer Design Database, and you will teach the user on how to use the website to create a PCR primer.Rules: 1. When the user hovers over a particular element, that element will be entered into the textbox. Then, you will explain how the user can utilize that element (e.g. submit a DNA sequence by clicking this button). However, that element will not be in its exact form, so it will be up to you to see which following piece of code below best matches the element that is entered into the textbox. Next, you will provide a series of suggestions of what the user should do next after inserting the information for that particular element. The users first response to you will be an element insert, so you will follow the necessary procedures as indicated in the steps. Additionally, keep your explanation simple, as possible, so that the user may understand (refrain from using complex terminology. Step 1. DO NOT MENTION ANY OTHER ELEMENTS ONCE THE USER CHOSE ANOTHER ELEMENT.Step 2. Your response to this prompt should be, “What can I help you with” Step 3. Offer suggestions of what to do next after you explain the feature to the user, or if the user doesnt have any questions. When doing so, refer to the particular element with its ID , and not by the features name. This is the HTML":"Publication link",  "Tips for finding specific primers" with "tips", "Save search parameters button" with "getURL", "Reset page button"  with "resetlink","textarea" with "seq","Clear button" with "clearseq","Clear button" with "clearRange","PRIMER5 START box" with "PRIMER5_START","PRIMER5 END box" with "PRIMER5_END" ,"PRIMER3 START box" with "PRIMER3_START","PRIMER3 END box" with "PRIMER3_END" ,"EXCLUDE XM_QUERY" check box with "EXCLUDE_XM_QUERY" ,"PRIMER LEFT INPUT box" "PRIMER_LEFT_INPUT","Clear button" with "clearprimer_left"'
    content: 'Introduction: This is the code for an NCBI ChemInfo protal, and you will teach the user on how to use the website to search info that I am interested.Rules: 1. When the user hovers over a particular element, that element will be entered into the textbox. Then, you will explain how the user can utilize that element (e.g. submit a chemical structure by clicking this button). However, that element will not be in its exact form, so it will be up to you to see which following piece of code below best matches the element that is entered into the textbox. Next, you will provide a series of suggestions of what the user should do next after inserting the information for that particular element. The users first response to you will be an element insert, so you will follow the necessary procedures as indicated in the steps. Additionally, keep your explanation simple, as possible, so that the user may understand (refrain from using complex terminology. Step 1. DO NOT MENTION ANY OTHER ELEMENTS ONCE THE USER CHOSE ANOTHER ELEMENT.Step 2. Your response to this prompt should be, “What can I help you with” Step 3. Offer suggestions of what to do next after you explain the feature to the user, or if the user doesnt have any questions. When doing so, refer to the particular element with its ID , and not by the features name. "OneTargTab","GroupTagrTab","upl","PRIMER5_START","PRIMER5_END","PRIMER3_START","PRIMER3_END","PRIMER_LEFT_INPUT","PRIMER_RIGHT_INPUT","PRIMER_PRODUCT_MIN","PRIMER_PRODUCT_MAX","PRIMER_NUM_RETURN","PRIMER_MIN_TM","PRIMER_OPT_TM","PRIMER_MAX_TM","PRIMER_MAX_DIFF_TM","SPLICE_SITE_OVERLAP_5END","SPLICE_SITE_OVERLAP_3END","SPLICE_SITE_OVERLAP_3END_MAX","SPAN_INTRON","MIN_INTRON_SIZE","MAX_INTRON_SIZE","SEARCH_SPECIFIC_PRIMER","N/A","primerSpecDBID","EXCLUDE_XM","EXCLUDE_ENV","ORGANISM","AddOrg","ALLOW_NO_ORGANISM","numOrg","orgDbs","slctOrg","ENTREZ_QUERY","MAX_TARGET_SIZE","ALLOW_TRANSCRIPT_VARIANTS","N/A","nw1","show_sviewer1","UNGAPPED_BLAST","NUM_TARGETS","NUM_TARGETS_WITH_PRIMERS","MAX_TARGET_PER_TEMPLATE","PRODUCT_MIN_TM","PRODUCT_OPT_TM","PRODUCT_MAX_TM","PRIMER_MIN_SIZE","PRIMER_OPT_SIZE","PRIMER_MAX_SIZE","PRIMER_MIN_GC","PRIMER_MAX_GC","GC_CLAMP","POLYX","PRIMER_MAX_END_STABILITY","PRIMER_MAX_END_GC","TH_OLOGO_ALIGNMENT","TH_TEMPLATE_ALIGNMENT","PRIMER_MAX_TEMPLATE_MISPRIMING_TH","PRIMER_PAIR_MAX_TEMPLATE_MISPRIMING_TH","PRIMER_MAX_SELF_ANY_TH","PRIMER_MAX_SELF_END_TH","PRIMER_PAIR_MAX_COMPL_ANY_TH","PRIMER_PAIR_MAX_COMPL_END_TH","PRIMER_MAX_HAIRPIN_TH","PRIMER_MAX_TEMPLATE_MISPRIMING","PRIMER_PAIR_MAX_TEMPLATE_MISPRIMING","SELF_ANY","SELF_END","PRIMER_PAIR_MAX_COMPL_ANY","PRIMER_PAIR_MAX_COMPL_END","EXCLUDED_REGIONS","OVERLAP","OVERLAP_5END","OVERLAP_3END","MONO_CATIONS","DIVA_CATIONS","CON_DNTPS","CON_ANEAL_OLIGO","NO_SNP","LOW_COMPLEXITY_FILTER","PICK_HYB_PROBE","PRIMER_INTERNAL_OLIGO_MIN_SIZE","PRIMER_INTERNAL_OLIGO_OPT_SIZE","PRIMER_INTERNAL_OLIGO_MAX_SIZE","PRIMER_INTERNAL_OLIGO_MIN_TM","PRIMER_INTERNAL_OLIGO_OPT_TM","PRIMER_INTERNAL_OLIGO_MAX_TM","PRIMER_INTERNAL_OLIGO_MIN_GC","PRIMER_INTERNAL_OLIGO_OPT_GC_PERCENT","PRIMER_INTERNAL_OLIGO_MAX_GC","N/A","nw2","show_sviewer2","LINK_LOC","show_sviewer_input","SVIEWER_DATA_KEY","cmd","NUM_DIFFS","NUM_OPTS_DIFFS","primerBlastSpec"'
    //content: 'Introduction: This is the code for an NCBI ChemInfo protal, and you will teach the user on how to use the website to search info that I am interested.Rules: 1. When the user hovers over a particular element, that element will be entered into the textbox. Then, you will explain how the user can utilize that element (e.g. submit a chemical structure by clicking this button). However, that element will not be in its exact form, so it will be up to you to see which following piece of code below best matches the element that is entered into the textbox. Next, you will provide a series of suggestions of what the user should do next after inserting the information for that particular element. The users first response to you will be an element insert, so you will follow the necessary procedures as indicated in the steps. Additionally, keep your explanation simple, as possible, so that the user may understand (refrain from using complex terminology. Step 1. DO NOT MENTION ANY OTHER ELEMENTS ONCE THE USER CHOSE ANOTHER ELEMENT.Step 2. Your response to this prompt should be, “What can I help you with” Step 3. Offer suggestions of what to do next after you explain the feature to the user, or if the user doesnt have any questions. When doing so, refer to the particular element with its ID , and not by the features name. '
 
  }
  //,
  //{ role: 'user', 
  //  content: 'I am a high schooler and has no idea about the primer design.Please help with the steps/html element on the ncbi primer designe tool that !' 
  //}
];

let openai = new OpenAI({
  apiKey: "sk-None-KKpp00S8E9nGi6Xe9ITiT3BlbkFJCZvI0tl478b8FuSLOtl4",
  dangerouslyAllowBrowser: true
});

//A. Submit Button to send message to background.js and put the message on log
document.getElementById('messageForm')?.addEventListener('submit', function (event) {
  event.preventDefault();

  const messageInput = document.getElementById('messageInput') as HTMLInputElement;
  const messageLog = document.getElementById('messageLog');
  const message = messageInput?.value.trim();

  // if (messageLog && message) {
  //     const n = messageLog.children.length;
  //     const messageElement = document.createElement('div');
  //     messageElement.className = 'message';
  //     messageElement.textContent = message;
  //     messageElement.style.width = "auto";
  //     messageElement.style.margin = "auto";
  //     messageElement.style.backgroundColor = n % 2 === 0 ? "#FDEDEC" : "#EAF2F8";
  //     messageLog.appendChild(messageElement);
  //     messageInput.value = ''; // No need for ?. here since you've casted messageInput to HTMLInputElement
  //     messageLog.scrollTop = messageLog.scrollHeight; // No need for ?? 0 here since messageLog is guaranteed to be non-null
  // }

  // let query_2_ChatGPT = message
  // inquiry(query_2_ChatGPT)
  continueConversationF(message);
  messageInput.value = '';

});

//B.  Function to update the side panel==============
function updateSidePanel(message: string) {

  const messageLog = document.getElementById('messageLog');
  const messageElement = document.createElement('div');


  if (messageLog && message) {
    let n = messageLog?.children.length;
    messageElement.className = 'message';
    messageElement.textContent = message;
    messageElement.style.width = "auto";
    messageElement.style.margin = "auto";
    messageElement.style.backgroundColor = n % 2 === 0 ? "#FDEDEC" : "#EAF2F8";
    messageLog?.appendChild(messageElement);
    messageLog.scrollTop = messageLog?.scrollHeight;
  }


}

//D.  Listen for storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  //alert("change happen");
  if (changes.messageFrom_NCBI_B) {
    continueConversation(changes.messageFrom_NCBI_B.newValue)
  }

});

async function inquiry(query: string) {
  const completion = await openai.chat.completions.create(
    {
      messages: [{ role: "assistant", content: query }],
      model: "gpt-4-turbo",
    });

  updateSidePanel(completion.choices[0].message.content)
  console.log(completion.choices[0].message.content);
}

async function handleChatCompletion(messages: any) {
  try {
    //alert("asked chatGPT")
    const completion = await openai.chat.completions.create(
      {
        messages: messages,
        model: "gpt-4o-mini"
      });
    console.log(completion);
    return completion.choices[0].message.content;
  }
  catch (error) {
    console.error('Error:', error);
  }
}

document.addEventListener('DOMContentLoaded', async (event) => {

  const initialResponse = await handleChatCompletion(initialMessages);

  if (initialResponse != null) {
    updateSidePanel(initialResponse);
  }
  else {
    alert("Please ensure your API key is working");
  }
   

  logEverySecond();
})

async function continueConversation(userMessage) {
  userMessage = "I just hover over this element " + userMessage + "; could you explain to me how to use this element or proceed with other element in order to complete the task";
  initialMessages.push({ role: 'user', content: userMessage });
  //alert(initialMessages[initialMessages.length-1]['userMessage']);
  const response = await handleChatCompletion(initialMessages);
  //alert("got response")
  const indices = findIndicesByIdSubstring(response);
  //alert("got index")
  saveElements(indices);
  initialMessages.push({ role: 'assistant', content: response });
  sini(initialMessages)
  //updateSidePanel(response);
}

async function continueConversationF(userMessage) {

  initialMessages.push({ role: 'user', content: userMessage });
  //alert(initialMessages[initialMessages.length-1]['userMessage']);
  const response = await handleChatCompletion(initialMessages);
  initialMessages.push({ role: 'assistant', content: response });
  sini(initialMessages);
  //updateSidePanel(response);

}

function sini(initialMessages) {
  console.log("sini");
  const messageLog = document.getElementById('messageLog');
  messageLog.innerHTML = '';
  let n = 0;
  //alert("sini")
  for (const message of initialMessages) {
    const messageDiv = document.createElement('div');
    const roleSpan = document.createElement('span');
    const contentParagraph = document.createElement('div');
    roleSpan.textContent = `role: ${n} ${message.role}`;
    contentParagraph.textContent = message.content;
    if (n % 2 === 0) {
      roleSpan.style.backgroundColor = "#FDEDEC";
      contentParagraph.style.backgroundColor = "#FDEDEC";
    }
    else 
    {
      roleSpan.style.backgroundColor = "#EAF2F8";
      contentParagraph.style.backgroundColor = "#EAF2F8";
    }
    let content = message.content;
    contentParagraph.innerHTML = content;
    // Convert 'Click here' text to a button in the div with ID 'contentDiv'
    convertTextToButton(contentParagraph);
    messageDiv.appendChild(roleSpan);
    messageDiv.appendChild(contentParagraph);
    addEventListenersToButtons(contentParagraph);
    // message.Divstyle.width = "auto";
    // message.style.margin = "auto";
    if(n!=0){
      messageLog.appendChild(messageDiv);
      messageLog.scrollTop = messageLog.scrollHeight;
    }

    n++;
  };
}

function addEventListenersToButtons(contentParagraph) {
  // Get all button elements within the contentParagraph
  const buttons = contentParagraph.querySelectorAll('button');

  // Iterate over each button
  buttons.forEach((button, index) => {
    // Extract the ID from the button
    const buttonId = button.getAttribute('id');
    
    // Ensure we have an ID
    if (buttonId) {
      // Add an event listener to the button
      button.addEventListener('click', function() {
        //alert(`Help button with ID ${buttonId} clicked!`);
        const colorIndex = extractColorIndexFromButtonId(buttonId);
        saveElements([colorIndex]);
      });
      console.log(`Event listener added to button with ID: ${buttonId}`);
    } else {
      console.error('Button with no ID found.');
    }
  });

  console.log('All buttons processed.');
}



function convertTextToButton(div) {
  // Get the HTML content of the div
  let htmlContent = div.innerHTML;

  // Iterate over each colorInfo in color_map
  color_map.forEach(colorInfo => {
    // Counter for occurrences of the same name
    let occurrenceCount = 0;

    // Create a unique button HTML with a placeholder ID
    htmlContent = htmlContent.replace(new RegExp(colorInfo.name, 'g'), (match) => {
      // Generate a unique ID for this occurrence
      const buttonId = `helpButton_${colorInfo.index}_${++occurrenceCount}`;

      // Create the button HTML with the unique ID
      return `<button id="${buttonId}" type="button"  class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded">${colorInfo.name}</button>`;
    });
  });

  // Update the div's content
  div.innerHTML = htmlContent;
}


// Function to extract colorInfo.index from buttonId
function extractColorIndexFromButtonId(buttonId) {
  // Split the buttonId based on the underscore
  const parts = buttonId.split('_');
  
  // Assuming the format is `helpButton_${colorInfo.index}_${occurrenceCount}`
  // The colorInfo.index should be the second part (index 1) of the split array
  if (parts.length >= 3) {
    const colorIndex = parseInt(parts[1], 10); // Convert to integer
    return colorIndex;
  } else {
    console.error('Invalid buttonId format');
    return null;
  }
}






document.getElementById('EnterAPI')?.addEventListener('click', function () {

  var apiKey = document.getElementById('apikey')?.value;
  API_KEY = apiKey;
  openai = new OpenAI({
    apiKey: API_KEY,
    dangerouslyAllowBrowser: true
  });
  alert("API updated successfully!")
});



//====== color elements=====
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
  { index: 33, name: "slctOrg", id: "slctOrg", color: "#FFE4C4" }, // Bisque
  { index: 34, name: "ENTREZ_QUERY", id: "ENTREZ_QUERY", color: "#B0E0E6" }, // Powder Blue
  { index: 35, name: "MAX_TARGET_SIZE", id: "MAX_TARGET_SIZE", color: "#C6E2FF" }, // Light Sky Blue
  { index: 36, name: "ALLOW_TRANSCRIPT_VARIANTS", id: "ALLOW_TRANSCRIPT_VARIANTS", color: "#E0FFFF" }, // Light Cyan
  { index: 37, name: "N/A", id: "N/A", color: "#F5FFFA" }, // Mint Cream
  { index: 38, name: "NEWWIN", id: "nw1", color: "#F0FFFF" }, // Azure
  { index: 39, name: "SHOW_SVIEWER", id: "show_sviewer1", color: "#F0F8FF" }, // Alice Blue
  { index: 40, name: "UNGAPPED_BLAST", id: "UNGAPPED_BLAST", color: "#F5F5F5" }, // White Smoke
  { index: 41, name: "NUM_TARGETS", id: "NUM_TARGETS", color: "#FFE4E1" }, // Misty Rose
  { index: 42, name: "NUM_TARGETS_WITH_PRIMERS", id: "NUM_TARGETS_WITH_PRIMERS", color: "#F4A460" }, // Sandy Brown
  { index: 43, name: "MAX_TARGET_PER_TEMPLATE", id: "MAX_TARGET_PER_TEMPLATE", color: "#FAF0E6" }, // Linen
  { index: 44, name: "PRODUCT_MIN_TM", id: "PRODUCT_MIN_TM", color: "#F5DEB3" }, // Wheat
  { index: 45, name: "PRODUCT_OPT_TM", id: "PRODUCT_OPT_TM", color: "#FDF5E6" }, // Old Lace
  { index: 46, name: "PRODUCT_MAX_TM", id: "PRODUCT_MAX_TM", color: "#FFEBCD" }, // Blanched Almond
  { index: 47, name: "PRIMER_MIN_SIZE", id: "PRIMER_MIN_SIZE", color: "#FFF5EE" }, // Seashell
  { index: 48, name: "PRIMER_OPT_SIZE", id: "PRIMER_OPT_SIZE", color: "#F0E68C" }, // Khaki
  { index: 49, name: "PRIMER_MAX_SIZE", id: "PRIMER_MAX_SIZE", color: "#D3D3D3" }, // Light Gray
  { index: 50, name: "PRIMER_MIN_GC", id: "PRIMER_MIN_GC", color: "#F0F8FF" }, // Alice Blue
  { index: 51, name: "PRIMER_MAX_GC", id: "PRIMER_MAX_GC", color: "#D8BFD8" }, // Thistle
  { index: 52, name: "GC_CLAMP", id: "GC_CLAMP", color: "#D3D3D3" }, // Light Gray
  { index: 53, name: "POLYX", id: "POLYX", color: "#F0F8FF" }, // Alice Blue
  { index: 54, name: "PRIMER_MAX_END_STABILITY", id: "PRIMER_MAX_END_STABILITY", color: "#F5F5F5" }, // White Smoke
  { index: 55, name: "PRIMER_MAX_END_GC", id: "PRIMER_MAX_END_GC", color: "#F5FFFA" }, // Mint Cream
  { index: 56, name: "TH_OLOGO_ALIGNMENT", id: "TH_OLOGO_ALIGNMENT", color: "#F0FFFF" }, // Azure
  { index: 57, name: "TH_TEMPLATE_ALIGNMENT", id: "TH_TEMPLATE_ALIGNMENT", color: "#F0F8FF" }, // Alice Blue
  { index: 58, name: "PRIMER_MAX_TEMPLATE_MISPRIMING_TH", id: "PRIMER_MAX_TEMPLATE_MISPRIMING_TH", color: "#F5F5F5" }, // White Smoke
  { index: 59, name: "PRIMER_PAIR_MAX_TEMPLATE_MISPRIMING_TH", id: "PRIMER_PAIR_MAX_TEMPLATE_MISPRIMING_TH", color: "#F5F5F5" }, // White Smoke
  { index: 60, name: "PRIMER_MAX_SELF_ANY_TH", id: "PRIMER_MAX_SELF_ANY_TH", color: "#F5F5F5" }, // White Smoke
  { index: 61, name: "PRIMER_MAX_SELF_END_TH", id: "PRIMER_MAX_SELF_END_TH", color: "#F5F5F5" }, // White Smoke
  { index: 62, name: "PRIMER_PAIR_MAX_COMPL_ANY_TH", id: "PRIMER_PAIR_MAX_COMPL_ANY_TH", color: "#F5F5F5" }, // White Smoke
  { index: 63, name: "PRIMER_PAIR_MAX_COMPL_END_TH", id: "PRIMER_PAIR_MAX_COMPL_END_TH", color: "#F5F5F5" }, // White Smoke
  { index: 64, name: "PRIMER_MAX_HAIRPIN_TH", id: "PRIMER_MAX_HAIRPIN_TH", color: "#F5F5F5" }, // White Smoke
  { index: 65, name: "PRIMER_MAX_TEMPLATE_MISPRIMING", id: "PRIMER_MAX_TEMPLATE_MISPRIMING", color: "#F5F5F5" }, // White Smoke
  { index: 66, name: "PRIMER_PAIR_MAX_TEMPLATE_MISPRIMING", id: "PRIMER_PAIR_MAX_TEMPLATE_MISPRIMING", color: "#F5F5F5" }, // White Smoke
  { index: 67, name: "SELF_ANY", id: "SELF_ANY", color: "#F5F5F5" }, // White Smoke
  { index: 68, name: "SELF_END", id: "SELF_END", color: "#F5F5F5" }, // White Smoke
  { index: 69, name: "PRIMER_PAIR_MAX_COMPL_ANY", id: "PRIMER_PAIR_MAX_COMPL_ANY", color: "#F5F5F5" }, // White Smoke
  { index: 70, name: "PRIMER_PAIR_MAX_COMPL_END", id: "PRIMER_PAIR_MAX_COMPL_END", color: "#F5F5F5" }, // White Smoke
  { index: 71, name: "EXCLUDED_REGIONS", id: "EXCLUDED_REGIONS", color: "#F5F5F5" }, // White Smoke
  { index: 72, name: "OVERLAP", id: "OVERLAP", color: "#F5F5F5" }, // White Smoke
  { index: 73, name: "OVERLAP_5END", id: "OVERLAP_5END", color: "#F5F5F5" }, // White Smoke
  { index: 74, name: "OVERLAP_3END", id: "OVERLAP_3END", color: "#F5F5F5" }, // White Smoke
  { index: 75, name: "MONO_CATIONS", id: "MONO_CATIONS", color: "#F5F5F5" }, // White Smoke
  { index: 76, name: "DIVA_CATIONS", id: "DIVA_CATIONS", color: "#F5F5F5" }, // White Smoke
  { index: 77, name: "CON_DNTPS", id: "CON_DNTPS", color: "#F5F5F5" }, // White Smoke
  { index: 78, name: "CON_ANEAL_OLIGO", id: "CON_ANEAL_OLIGO", color: "#F5F5F5" }, // White Smoke
  { index: 79, name: "NO_SNP", id: "NO_SNP", color: "#F5F5F5" }, // White Smoke
  { index: 80, name: "LOW_COMPLEXITY_FILTER", id: "LOW_COMPLEXITY_FILTER", color: "#F5F5F5" }, // White Smoke
  { index: 81, name: "PICK_HYB_PROBE", id: "PICK_HYB_PROBE", color: "#F5F5F5" }, // White Smoke
  { index: 82, name: "PRIMER_INTERNAL_OLIGO_MIN_SIZE", id: "PRIMER_INTERNAL_OLIGO_MIN_SIZE", color: "#F5F5F5" }, // White Smoke
  { index: 83, name: "PRIMER_INTERNAL_OLIGO_OPT_SIZE", id: "PRIMER_INTERNAL_OLIGO_OPT_SIZE", color: "#F5F5F5" }, // White Smoke
  { index: 84, name: "PRIMER_INTERNAL_OLIGO_MAX_SIZE", id: "PRIMER_INTERNAL_OLIGO_MAX_SIZE", color: "#F5F5F5" }, // White Smoke
  { index: 85, name: "PRIMER_INTERNAL_OLIGO_MIN_TM", id: "PRIMER_INTERNAL_OLIGO_MIN_TM", color: "#F5F5F5" }, // White Smoke
  { index: 86, name: "PRIMER_INTERNAL_OLIGO_OPT_TM", id: "PRIMER_INTERNAL_OLIGO_OPT_TM", color: "#F5F5F5" }, // White Smoke
  { index: 87, name: "PRIMER_INTERNAL_OLIGO_MAX_TM", id: "PRIMER_INTERNAL_OLIGO_MAX_TM", color: "#F5F5F5" }, // White Smoke
  { index: 88, name: "PRIMER_INTERNAL_OLIGO_MIN_GC", id: "PRIMER_INTERNAL_OLIGO_MIN_GC", color: "#F5F5F5" }, // White Smoke
  { index: 89, name: "PRIMER_INTERNAL_OLIGO_OPT_GC_PERCENT", id: "PRIMER_INTERNAL_OLIGO_OPT_GC_PERCENT", color: "#F5F5F5" }, // White Smoke
  { index: 90, name: "PRIMER_INTERNAL_OLIGO_MAX_GC", id: "PRIMER_INTERNAL_OLIGO_MAX_GC", color: "#F5F5F5" }, // White Smoke
  { index: 91, name: "N/A", id: "N/A", color: "#F5F5F5" }, // White Smoke
  { index: 92, name: "NEWWIN", id: "nw2", color: "#F5F5F5" }, // White Smoke
  { index: 93, name: "SHOW_SVIEWER", id: "show_sviewer2", color: "#F5F5F5" }, // White Smoke
  { index: 94, name: "LINK_LOC", id: "LINK_LOC", color: "#F5F5F5" }, // White Smoke
  { index: 95, name: "N/A", id: "show_sviewer_input", color: "#F5F5F5" }, // White Smoke
  { index: 96, name: "SVIEWER_DATA_KEY", id: "SVIEWER_DATA_KEY", color: "#F5F5F5" }, // White Smoke
  { index: 97, name: "CMD", id: "cmd", color: "#F5F5F5" }, // White Smoke
  { index: 98, name: "NUM_DIFFS", id: "NUM_DIFFS", color: "#F5F5F5" }, // White Smoke
  { index: 99, name: "NUM_OPTS_DIFFS", id: "NUM_OPTS_DIFFS", color: "#F5F5F5" }, // White Smoke
  { index: 100, name: "N/A", id: "primerBlastSpec", color: "#F5F5F5" }, // White Smoke
];


function findIndicesByIdSubstring(inputString) {
  const indices = [];
  //alert(inputString);
  for (let i = 0; i < color_map.length; i++) {
    // if (inputString.includes(color_map[i].id)) {
    //   indices.push(color_map[i].index);
    //   alert(color_map[i].name);

    // }

    if (exactMatch(color_map[i].id, inputString)) {
      indices.push(color_map[i].index);
      //alert(color_map[i].name);
    }
  }
  return indices;
}

function logEverySecond() {
  // Set up an interval to log a message to the console every second
  setInterval(() => {
    sini(initialMessages);
  }, 2000); // 1000 milliseconds = 1 second
}
function saveElements(indices) {

  //indices.forEach(index => {
  //alert(index)
  //});
  chrome.storage.local.set({ savedIndices: indices }, function () {
    console.log('Indices saved to chrome.storage');
  });
}

function exactMatch(substring, string) {
  const index = string.indexOf(substring);

  if (index === -1) {
    return false;
  }

  const beforeChar = index === 0 ? '' : string.charAt(index - 1);
  const afterChar = index + substring.length === string.length ? '' : string.charAt(index + substring.length);

  const isBeforeValid = beforeChar === '' || !isAlphanumeric(beforeChar);
  const isAfterValid = afterChar === '' || !isAlphanumeric(afterChar);

  return isBeforeValid && isAfterValid;
}

function isAlphanumeric(char) {
  return /^[a-z0-9]+$/i.test(char);
}