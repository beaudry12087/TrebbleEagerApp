(function () {
  if (!document.addEventListener) return

    var APP_CONTEXT = 'CLOUDFAREEMBED'

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
      function onTrebbleWebsiteIframeUrlChange () {
        if (document.getElementById('loadedSite')) {
          window.history.pushState({}, null, document.getElementById('loadedSite').contentWindow.location)
        }
      }

      function replaceBodyContentByCurrentWebsiteInAnIframe () {
        var currentWebtsiteUrl = window.location.href
        var pagePlaceholderTopPosition = ''
        if (options.whereToAppend === 'BeforeThePage') {
          pagePlaceholderTopPosition = '60px'
        } else {
          pagePlaceholderTopPosition = '0px'
        }

        var newBodyContentInnerHTML = '<div id="trebbleSiteWrapper" style="width:100%;height:calc(100% - 60px);position: absolute;top:' + pagePlaceholderTopPosition + ';">' +
        '<iframe id="loadedSite" width="100%" height="100%"  frameborder="0"    src="' + currentWebtsiteUrl + '" donotembedtrebblewidget="true" ></iframe>' +
        '</div>'
        document.body.style = 'width: 100%;height: 100%;position: absolute;display: block;'
        window.addEventListener('popstate', function (event) {
          document.getElementById('loadedSite').contentWindow.history.go(-1)
        })
        document.body.innerHTML = newBodyContentInnerHTML
        document.body.querySelector('#loadedSite').onload = function () {
          onTrebbleWebsiteIframeUrlChange()
        }
      }
      function createAppElement () {
        var customLocation = options.whereToAppend === 'ChooseYourOwn'
        var alwaysVisible = options.alwaysVisible
        if (customLocation) {
          element = INSTALL.createElement(options.location, element)
          element.setAttribute('app', 'trebble')
          element.style['display'] = 'block'
          element.style['background-color'] = options.widgetPlaceholderBackgroundColor
          return
        }
        if (alwaysVisible) {
          // replaceBodyContentByCurrentWebsiteInAnIframe()
        }
        var location = {selector: 'body'}
        if (options.whereToAppend === 'BeforeThePage') {
          location.method = 'prepend'
        } else {
          location.method = 'append'
        }

        element = INSTALL.createElement(location)
        element.setAttribute('app', 'trebble')
        element.style['background-color'] = options.widgetPlaceholderBackgroundColor
        if (alwaysVisible) {
          if (location.method === 'append') {
            document.body.style['padding-bottom'] = '60px'
            element.style['bottom'] = '0px'
            element.style['box-shadow'] = '0px -9px 20px -5px rgba(0, 0, 0, 0.3)'
          } else {
            document.body.style['padding-top'] = '60px'
            element.style['top'] = '0px'
            element.style['box-shadow'] = '0 8px 20px -9px rgba(0, 0, 0, 0.3)'
          }
          element.style['position'] = 'fixed'
          element.style['width'] = '100%'
          element.style['height'] = '60px'
          element.style['z-index'] = getMaxZIndex() + 1
        } else {
          if (!customLocation) {
            element.style['width'] = '100%'
            element.style['height'] = '60px'
            element.style['display'] = 'block'
          }
        }
      }

      var extractTrebbleIdFromUrl = function (urlOrTrebbleId) {
        if (urlOrTrebbleId && (urlOrTrebbleId.indexOf('//web.trebble.fm') !== -1 || urlOrTrebbleId.indexOf('//s.trebble.fm') !== -1)) {
          var decodeURL = decodeURIComponent(urlOrTrebbleId)
          return decodeURL.substr(decodeURL.lastIndexOf('/') + 1)
        } else {
          return urlOrTrebbleId
        }
      }

      var getMaxZIndex = function () {
        var max = 0
        var elements = document.getElementsByTagName('*')

        Array.prototype.slice.call(elements).forEach(function (element) {
          var zIndex = parseInt(document.defaultView.getComputedStyle(element).zIndex, 10)

          max = zIndex ? Math.max(max, zIndex) : max
        })

        return max
      }

      var getTrebbleWidgetUrl = function () {
        var loggedInUserId = getLoggedInUserId()
        if (loggedInUserId) {
          var TREBBLE_EMBED_URL_PREFIX = 'https://web.trebble.fm/trebble_embedded_optimized.html/playCapsuleFeed/'
          return TREBBLE_EMBED_URL_PREFIX + loggedInUserId + '/ctk/' + APP_CONTEXT
        } else {
          return 'https://web.trebble.fm/trebble_embedded_optimized.html/playCapsuleFeed/5dcad95d4b817e001dcf4d98/ctk/' + APP_CONTEXT
        }
      }

      var isTrebbleWidgetUsingDemoURL = function () {
        var loggedInUserId = getLoggedInUserId()
        if (loggedInUserId) {
          return false
        } else {
          return true
        }
      }

      function createAndAddTrebbleWidgetToPage (width, height, trebbleEmbedUrl) {
        createAppElement()
        if (element && width && height) {
          window.INSTALL_SCOPE.currentTrebbleWidgetUrl = trebbleEmbedUrl
          var demoBagdeElement = createDemoBagdeElment()
          var iframe = document.createElement('iframe')
          iframe.style = 'max-width: 100%;'
          iframe.width = width
          iframe.height = height
          iframe.frameBorder = '0'
          iframe.setAttribute('allowTransparency', '')
          iframe.setAttribute('allowfullscreen', '')
          iframe.src = trebbleEmbedUrl
          element.appendChild(demoBagdeElement)
          element.appendChild(iframe)
          window.INSTALL_SCOPE.trebbleWidgetIframe = element.querySelector('iframe')
          window.INSTALL_SCOPE.demoBagdeElement = demoBagdeElement
        }
      };


      function getLoggedInUserId () {
        return options.trebbleUserId ?options.userUID: null
      }

      function isSelectedUserHasSubscriptionsToBePlayed () {
        return !(options.numberOfTrebbleFollowed > 0)
      }

      function closeAndOpenBadgePopupIfApplicable(){
        if(window.INSTALL_SCOPE.demoBagdeElement && window.INSTALL_SCOPE.demoBagdeElement.dropInstance){
          window.INSTALL_SCOPE.demoBagdeElement.dropInstance.close()
          if(window.INSTALL_SCOPE.demoBagdeElement.getAttribute('badge-state') && window.INSTALL_SCOPE.demoBagdeElement.getAttribute('badge-state') != 'none'){
            window.INSTALL_SCOPE.demoBagdeElement.dropInstance.open()
            window.scrollBy({
              top: 1,
              left: 0,
              behavior: 'smooth'
            });
          }
        }
      }

      // Function to Update embedded trebble widget if the height, the width or the trebble id changes
      function setOptionsOnTrebbleWidget (nextOptions) {
        options = nextOptions
        var newWidgetWidth = getWidth()
        var newWidgetHeight = getHeight()
        var newTrebbleEmbedUrl = getTrebbleWidgetUrl()
        var isUsingDemoTrebble = isTrebbleWidgetUsingDemoURL()
        if (window.INSTALL_SCOPE.trebbleWidgetIframe) {
          if (newWidgetWidth) {
            window.INSTALL_SCOPE.trebbleWidgetIframe.width = newWidgetWidth
          }
          if (newWidgetHeight) {
            window.INSTALL_SCOPE.trebbleWidgetIframe.height = newWidgetHeight
          }
          if (newTrebbleEmbedUrl !== window.INSTALL_SCOPE.trebbleWidgetIframe.src) {
            window.INSTALL_SCOPE.trebbleWidgetIframe.src = newTrebbleEmbedUrl
            window.INSTALL_SCOPE.currentTrebbleWidgetUrl = newTrebbleEmbedUrl
          }
        } else {
          createAndAddTrebbleWidgetToPage(newWidgetWidth, newWidgetHeight, newTrebbleEmbedUrl)
        }
        if (isEmbeddedInCloudflareAppPreview() && isUsingDemoTrebble) {
          window.INSTALL_SCOPE.demoBagdeElement.setAttribute('badge-state', 'trebbledemo')
          window.INSTALL_SCOPE.demoBagdeElement.innerHTML = 'Demo Preview'
          closeAndOpenBadgePopupIfApplicable()
        } else {
          if (isEmbeddedInCloudflareAppPreview() && isSelectedUserHasSubscriptionsToBePlayed()) {
            window.INSTALL_SCOPE.demoBagdeElement.setAttribute('badge-state', 'nosubscription')
            window.INSTALL_SCOPE.demoBagdeElement.innerHTML = 'No Subscription To Play'
            closeAndOpenBadgePopupIfApplicable()
          } else {
            window.INSTALL_SCOPE.demoBagdeElement.setAttribute('badge-state', 'none')
            window.INSTALL_SCOPE.demoBagdeElement.innerHTML = null
            closeAndOpenBadgePopupIfApplicable()
          }
        }
      };

      function createDemoBagdeElment () {
        var badgeElement = document.createElement('div')
        badgeElement.className = 'demoBadge'
        setupPopupListenerOnDemoBadgeElement(badgeElement)
        return badgeElement
      }

      function setupPopupListenerOnDemoBadgeElement (badgeElement) {
        if (badgeElement) {
          var getContentToDisplayInPopup = function () {
            var state = this.badgeElement.getAttribute('badge-state')
            var popInfoElement = document.createElement('div')
            popInfoElement.className = 'trebblePopupInfo'
            if (state === 'trebbledemo') {
              popInfoElement.innerHTML = "&emsp;Click on the play button to hear an example of audio news feed built with Trebble. You can login with your Trebble FM account to preview your own feed.<br/>&emsp; Don't have an account yet? Click on the \"Login or Register...\" button to sign-up for one and personalize your feed."
              return popInfoElement
            } else {
              if (state === 'nosubscription') {
                popInfoElement.innerHTML = '&emsp;You don\'t have any subscription. Please visit https://web.trebble.fm to build your personalized feed by subscribing to Trebble stations you want to add to your feed.'
                return popInfoElement
              } else {
                return popInfoElement
              }
            }
          }.bind({'badgeElement': badgeElement})
          var popupPosition = 'bottom left'
          if (options.whereToAppend === 'AfterThePage') {
            popupPosition = 'top left'
          }
          var dropObj = new Drop({
            target: badgeElement,
            content: getContentToDisplayInPopup,
            position: popupPosition,
            constrainToScrollParent: false,
            classes: 'trebble-bagde-info drop-theme-arrows-bounce-dark',
            openOn: 'hover'
          })

          dropObj.content.addEventListener("click", function(){
           console.log("DropObj about to be closed");
           dropObj.close()
         })
          badgeElement.dropInstance = dropObj
        }
      }

      function addElement () {
        window.INSTALL_SCOPE.trebbleWidgetIframe = null
        window.INSTALL_SCOPE.demoBagdeElement = null
        window.INSTALL_SCOPE.currentTrebbleWidgetUrl = null
        var trebbleEmbedUrl = getTrebbleWidgetUrl()
        var isUsingDemoTrebble = isTrebbleWidgetUsingDemoURL()
        var widgetWidth = getWidth()
        var widgetHeight = getHeight()
        if (!widgetWidth || !widgetHeight) {
          return
        }

        createAndAddTrebbleWidgetToPage(widgetWidth, widgetHeight, trebbleEmbedUrl)
        window.INSTALL_SCOPE.setOptions = setOptionsOnTrebbleWidget
        if (window.INSTALL_SCOPE.demoBagdeElement) {
          if (isEmbeddedInCloudflareAppPreview() && isUsingDemoTrebble) {
            window.INSTALL_SCOPE.demoBagdeElement.setAttribute('badge-state', 'trebbledemo')
            window.INSTALL_SCOPE.demoBagdeElement.innerHTML = 'Demo Preview'
            closeAndOpenBadgePopupIfApplicable()
          } else {
            if (isEmbeddedInCloudflareAppPreview() && isSelectedUserHasSubscriptionsToBePlayed()) {
              window.INSTALL_SCOPE.demoBagdeElement.setAttribute('badge-state', 'nosubscription')
              window.INSTALL_SCOPE.demoBagdeElement.innerHTML = 'No Subscription To Play'
              closeAndOpenBadgePopupIfApplicable()
            } else {
              window.INSTALL_SCOPE.demoBagdeElement.setAttribute('badge-state', 'none')
              window.INSTALL_SCOPE.demoBagdeElement.innerHTML = null
              closeAndOpenBadgePopupIfApplicable()
            }
          }
        }
      };
      function inIframe () {
        try {
          return window.self !== window.top
        } catch (e) {
          return true
        }
      }

      function isEmbeddedInCloudflareAppPreview () {
        var url = window.location !== window.parent.location ? document.referrer : document.location.href
        return inIframe() && (url.indexOf('cloudflare.com') !== -1 || url.indexOf('cloudflareapps.com') !== -1)
      }




      if ((inIframe() && !isEmbeddedInCloudflareAppPreview()) || (window.frameElement && (window.frameElement.getAttribute('donotembedtrebblewidget') === 'true' || window.frameElement.getAttribute('donotembedtrebblewidget') === true))) {
        // Trebble is already probably already embedded in the container of the iframe so do not do anything

      } else {
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', addElement)
        } else {
          addElement()
        }
      }
    })()
