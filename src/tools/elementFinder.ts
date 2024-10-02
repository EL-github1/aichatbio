export function getBody(): HTMLTextAreaElement {
    return document.querySelector('body')
}
export function getEducationDemo(): HTMLTextAreaElement {
    return document.querySelector('#education_demo')
}

export function getTextArea(): HTMLTextAreaElement {
    return document.querySelector('textarea')
}

export function getFooter(): HTMLDivElement {
    return document.querySelector("div[class*='absolute bottom-0']")
}

export function getRootElement(): HTMLDivElement {
    return document.querySelector('main')
}

export function getChatbioControlbar(): HTMLElement {
    return document.querySelector("div[class*='cb-toolbar']")
}

export function getSubmitButton(): HTMLButtonElement {
    const textarea = getTextArea()
    if (!textarea) {
        return null
    }
    return textarea.parentNode.parentNode.querySelector("button")
}

export function getForm(): HTMLFormElement {
    const textarea = getTextArea()
    if (!textarea) {
        return null
    }
    return document.querySelector("form")
}

export function getHeader(): HTMLHeadElement {
    return document.querySelector('header')
}

export function getTextAreaAboveElement(): null { //

// Get a reference to the header element (replace 'h1' with the appropriate tag)

var  lastChildElement=document.querySelector("div")

const headerElement = document.querySelector("header");

    if (headerElement) {
      
      const parentElement = headerElement.parentElement;

      if (parentElement) {


          if (parentElement.lastElementChild) {

            alert(parentElement.lastElementChild.innerHTML)
          } 
          else {
            alert("Parent element does not have any child elements.");
           }
        } else {
            alert("Parent element not found using the provided selector.");
        }
   }
   
}
export function getJiaButton(): HTMLButtonElement { 
    return  document.getElementById("Jiajia");
}




