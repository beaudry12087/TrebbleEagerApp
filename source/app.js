(function () {
  if (!document.addEventListener) return

  var options = INSTALL_OPTIONS
  var element = null

  function getWidth () {
    if (options.whereToAppend === 'ChooseYourOwn') {
      if (options.widthFitContainer) return '100%'
      if (options.customWidth) return options.customWidth + 'px'

      return null
    }

    return '100%'
  }

  function getHeight () {
    if (options.whereToAppend === 'ChooseYourOwn') {
      if (options.heightFitContainer) return '100%'
      if (options.customHeight) return options.customHeight + 'px'

      return null
    }

    return '60px'
  }

  function createAppElement () {
    var customLocation = options.whereToAppend === 'ChooseYourOwn'
    var alwaysVisible = options.alwaysVisible

    if (customLocation) {
      element = INSTALL.createElement(options.location, element)
      return
    }

    var location = {'selector': 'body'}

    if (options.whereToAppend === 'BeforeThePage') {
      location.method = 'prepend'
    } else {
      location.method = 'append'
    }

    element = INSTALL.createElement(location, element)

    if (alwaysVisible) {
      if (location.method === 'append') {
        document.body.style.paddingBottom = '60px'
        element.style.bottom = '0'
        element.style.boxShadow = '0px -9px 20px -5px rgba(0, 0, 0, 0.3)'
      } else {
        document.body.style.paddingTop = '60px'
        element.style.top = '0'
        element.style.boxShadow = '0 8px 20px -9px rgba(0, 0, 0, 0.3)'
      }
      element.style.position = 'fixed'
      element.style.width = '100%'
      element.style.height = '60px'
      element.style.zIndex = '999999999'
    } else {
      element.style.width = '100%'
      element.style.height = '60px'
      element.style.display = 'block'
    }
  }

  function extractTrebbleIdFromUrl (urlOrTrebbleId) {
    if (urlOrTrebbleId && (urlOrTrebbleId.indexOf('//web.trebble.fm') !== -1 || urlOrTrebbleId.indexOf('//s.trebble.fm') !== -1)) {
      var decodeURL = decodeURIComponent(urlOrTrebbleId)

      return decodeURL.substr(decodeURL.lastIndexOf('/') + 1)
    }

    return urlOrTrebbleId
  }

  function getTrebbleWidgetUrl () {
    var trebbleId = extractTrebbleIdFromUrl(options.trebbleId)
    if (!trebbleId) return 'https://web.trebble.fm/TrebbleWidgetEmptyPlaceholder.html'

    var TREBBLE_EMBED_URL_PREFIX = 'https://web.trebble.fm/trebble_embedded_optimized.html#p/l/t/'
    return TREBBLE_EMBED_URL_PREFIX + trebbleId
  }

  function updateElement () {
    var width = getWidth()
    var height = getHeight()
    if (!width || !height) return

    createAppElement()
    var iframe = document.createElement('iframe')

    iframe.style = 'max-width: 100%;'
    iframe.width = width
    iframe.height = height
    iframe.frameBorder = '0'
    iframe.setAttribute('allowTransparency', '')
    iframe.setAttribute('allowfullscreen', '')
    iframe.src = getTrebbleWidgetUrl()

    element.appendChild(iframe)
  }

  window.INSTALL_SCOPE = {
    setOptions: function setOptions (nextOptions) {
      options = nextOptions

      updateElement()
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateElement)
  } else {
    updateElement()
  }
})()
