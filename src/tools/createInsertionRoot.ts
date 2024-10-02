import Browser from "webextension-polyfill"

async function createInsertionRoot(pathToCSS: string) {

    const insertionRootDiv = document.createElement('div')
    const insertionRoot = insertionRootDiv.attachShadow({ mode: 'open' })
    const style = document.createElement('style')
    style.textContent = await fetch(Browser.runtime.getURL(pathToCSS)).then(response => response.text())
    style.textContent = ".cb-toolbar { margin: 0.5em 0em; display: flex; align-items: end;}*:before,*:after {box-sizing: border-box;}";
    insertionRoot.append(style)
    return { insertionRootDiv, insertionRoot }
}

export default createInsertionRoot
