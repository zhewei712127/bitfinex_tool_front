import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Owlting Welfare'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
