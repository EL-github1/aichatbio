import { h } from 'preact'
import Browser from 'webextension-polyfill'

function Footer() {
  const extension_version = Browser.runtime.getManifest().version

  return (
    <div className="cba-text-center cba-text-xs cba-text-gray-400">
      <a href='https://www.google.com' target='_blank' className='underline wcg-text-gray-400 wcg-underline' rel="noreferrer noopener">
        AIChatBio extension v.{extension_version}
      </a>.
      You may suggest a new feature <a href='https://www.google.com' target='_blank' className='cba-text-gray-400 cba-underline' rel="noreferrer noopener">Here</a>.
    </div>
  )
}

export default Footer
