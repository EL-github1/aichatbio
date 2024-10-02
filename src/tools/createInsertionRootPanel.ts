import Browser from "webextension-polyfill"

async function createInsertionRootPanel() {
    console.log("Eli note: Within createInsertionRoot the style of .cb-toolbar requires a manual change ")
    const insertionRootDiv = document.createElement('div')
    const insertionRoot = insertionRootDiv.attachShadow({ mode: 'open' })
    const style = document.createElement('style')
    style.textContent = ".cb-toolbar { margin: 0.5em 0em; display: flex; align-items: end;}*:before,*:after {box-sizing: border-box;}";

    insertionRoot.append(style)
    return { insertionRootDiv, insertionRoot }
}

export default createInsertionRootPanel
