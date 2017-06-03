(function(){
  if (!document.addEventListener) return


    var APP_CONTEXT = "CLOUDFAREEMBED"


  var options = INSTALL_OPTIONS;
  var element = null;

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

      function createAppElement(){
        var customLocation = options.whereToAppend == "ChooseYourOwn";
        var alwaysVisibible = options.alwaysVisibible;
        if(customLocation){

          element = INSTALL.createElement(options.location, element);
          element.style["display"] = "block";
          element.style["background-color"] = options.widgetPlaceholderBackgroundColor;
          return;
        }
        var location =  {selector: "body"};
        if(options.whereToAppend == "BeforeThePage"){
          location.method = "prepend";
        }else{
          location.method = "append";
        }

        element =  INSTALL.createElement(location);
        element.style["background-color"] = options.widgetPlaceholderBackgroundColor;
        if(alwaysVisibible){
          if(location.method == "append"){
            document.body.style["padding-bottom"] = "60px";
            element.style["bottom"] = "0px";
            element.style["box-shadow"] = "0px -9px 20px -5px rgba(0, 0, 0, 0.3)";
          }else{
            document.body.style["padding-top"] = "60px";
            element.style["top"] = "0px";
            element.style["box-shadow"] = "0 8px 20px -9px rgba(0, 0, 0, 0.3)";
          }
          element.style["position"] = "fixed";
          element.style["width"] = "100%";
          element.style["height"] = "60px";
          element.style["z-index"] = "999999998";
        }else{
          if(!customLocation){
            element.style["width"] = "100%";
            element.style["height"] = "60px";
            element.style["display"] = "block";
          }
        }
      }

      var extractTrebbleIdFromUrl = function(urlOrTrebbleId){
        if(urlOrTrebbleId && (urlOrTrebbleId.indexOf("//web.trebble.fm") != -1 || urlOrTrebbleId.indexOf("//s.trebble.fm") != -1)){
          var decodeURL = decodeURIComponent(urlOrTrebbleId);
          return decodeURL.substr(decodeURL.lastIndexOf('/') + 1);
        }else{
          return urlOrTrebbleId;
        }

      }

      var inIframe = function  () {
        try {
          return window.self !== window.top;
        } catch (e) {
          return true;
        }
      }

      var isEmbeddedInCloudflareapps = function(){
        var iframeParentUrl = (window.location != window.parent.location)? document.referrer:null;
        if(iframeParentUrl){
          return iframeParentUrl.indexOf("cloudflare.com") != -1;
        }
        return false;
      }

      var getTrebbleWidgetUrl = function(){
        var trebbleId = getSelectedTrebbleId();
        if(trebbleId){
          var TREBBLE_EMBED_URL_PREFIX = "https://web.trebble.fm/trebble_embedded_optimized.html#p/l/t/";
          return TREBBLE_EMBED_URL_PREFIX + trebbleId +"/r/" + APP_CONTEXT;    
        }else{
          return "https://web.trebble.fm/trebble_embedded_optimized.html#p/l/t/58ebe9a9227fe2000c015dc7/r/" + APP_CONTEXT;
        }
      }

      var isTrebbleWidgetUsingDemoURL = function(){
        var trebbleId = getSelectedTrebbleId();
        if(trebbleId){
          return false;
        }else{
          return true;
        }
      }


      function createAndAddTrebbleWidgetToPage( width, height, trebbleEmbedUrl){
       createAppElement();
       if(element && width && height){
        window.INSTALL_SCOPE.currentTrebbleWidgetUrl =  trebbleEmbedUrl;
        var demoBagdeElement = createDemoBagdeElment();
        var iframe = document.createElement('iframe');
        iframe.style = 'max-width: 100%;'
        iframe.width = width
        iframe.height = height
        iframe.frameBorder = '0'
        iframe.setAttribute('allowTransparency', '')
        iframe.setAttribute('allowfullscreen', '')
        iframe.src = trebbleEmbedUrl;
        element.appendChild(demoBagdeElement);
        element.appendChild(iframe)
        window.INSTALL_SCOPE.trebbleWidgetIframe = element.children.length > 0 ? element.children[0]: null;
        window.INSTALL_SCOPE.demoBagdeElement = demoBagdeElement;
      }
    };

    function getSelectedTrebbleId(){
      debugger;
      return (options.myTrebbleToEmbed && options.myTrebbleToEmbed != "chooseAnotherTrebbleToEmbed")?options.myTrebbleToEmbed : extractTrebbleIdFromUrl(options.trebbleId);
    }

    function isSelectedTrebbleHasEnoughContentToBePlayed(trebbleId){
      var trebbleId = getSelectedTrebbleId();
      if(options.unplayableTrebbleUIDs && options.unplayableTrebbleUIDs.length > 0){
        return options.unplayableTrebbleUIDs.indexOf(trebbleId) > -1;
      }else{
        return false;
      }
    }

    //Function to Update embedded trebble widget if the height, the width or the trebble id changes
    function setOptionsOnTrebbleWidget(nextOptions){
      options = nextOptions;
      var newWidgetWidth = getWidth();
      var newWidgetHeight = getHeight();
      var newTrebbleEmbedUrl = getTrebbleWidgetUrl();
      var isUsingDemoTrebble = isTrebbleWidgetUsingDemoURL();
      if(window.INSTALL_SCOPE.trebbleWidgetIframe){
        if(newWidgetWidth){
          window.INSTALL_SCOPE.trebbleWidgetIframe.width = newWidgetWidth;
        }
        if(newWidgetHeight){
          window.INSTALL_SCOPE.trebbleWidgetIframe.height = newWidgetHeight;
        }
        if(newTrebbleEmbedUrl != window.INSTALL_SCOPE.currentTrebbleWidgetUrl){
          window.INSTALL_SCOPE.trebbleWidgetIframe.src = newTrebbleEmbedUrl;
          window.INSTALL_SCOPE.currentTrebbleWidgetUrl = newTrebbleEmbedUrl;
        }
      }else{
        createAndAddTrebbleWidgetToPage(newWidgetWidth, newWidgetHeight, newTrebbleEmbedUrl);
      }
      if(isUsingDemoTrebble){
        window.INSTALL_SCOPE.demoBagdeElement.setAttribute("badgeState", "trebbledemo");
        window.INSTALL_SCOPE.demoBagdeElement.innerHTML = "Demo Preview";
      }else{
        if(isSelectedTrebbleHasEnoughContentToBePlayed()){
          window.INSTALL_SCOPE.demoBagdeElement.setAttribute("badgeState", "notenoughcontent");
          window.INSTALL_SCOPE.demoBagdeElement.innerHTML = "Not Enough Content To Play";
        }else{
          window.INSTALL_SCOPE.demoBagdeElement.setAttribute("badgeState", "none");
          window.INSTALL_SCOPE.demoBagdeElement.innerHTML = null;
        }
      }

    };

    function createDemoBagdeElment(){
      var badgeElement =  document.createElement("div");
      badgeElement.className =  "demoBadge";
      setupPopupListenerOnDemoBadgeElement(badgeElement)
      return badgeElement;
    }

    function setupPopupListenerOnDemoBadgeElement(badgeElement){
      if(badgeElement){
        var getContentToDisplayInPopup = (function(){
          var state = this.badgeElement.getAttribute("badgeState");
          var popInfoElement =  document.createElement("div");
          popInfoElement.className =  "trebblePopupInfo";
          if(state == "trebbledemo"){
            popInfoElement.innerHTML = "This embedded widget is a demo Trebble. Click on the play button to learn more about Trebble.fm . Login with your Trebble.fm account to get a preview with your own Trebble. You don't have an account yet? <a href='https://web.trebble.fm/#newSignupPage/accessCode/M5LL-UPCB-B4E2'  target='_blank' >Sign-up</a> for one to start a Trebble radio.";
            return popInfoElement;
          }else{
            if(state == "notenoughcontent"){
              popInfoElement.innerHTML = "A Trebble needs to contain a minimum 10 songs to play. Please visit <a href='https://web.trebble.fm' target='_blank'>Trebble.fm</a> to add more songs or capsules to be able to play it.";
              return popInfoElement;
            }else{
              return popInfoElement;
            }
            
          }
        }).bind({"badgeElement": badgeElement});
        var popupPosition = "bottom left";
        if(options.whereToAppend == "AfterThePage"){
          popupPosition =  "top left";
        }
        var dropObj = new Drop({
          target: badgeElement,
          content: getContentToDisplayInPopup,
          position: popupPosition,
          constrainToScrollParent: false,
          classes :"trebble-bagde-info drop-theme-arrows-bounce-dark",
          openOn: 'hover'
        });

        badgeElement.dropInstance = dropObj;
      }
    }


    function addElement() {
      window.INSTALL_SCOPE.trebbleWidgetIframe  = null;
      window.INSTALL_SCOPE.demoBagdeElement = null;
      window.INSTALL_SCOPE.currentTrebbleWidgetUrl = null;
      var trebbleEmbedUrl = getTrebbleWidgetUrl();
      var isUsingDemoTrebble = isTrebbleWidgetUsingDemoURL();
      var widgetWidth = getWidth();
      var widgetHeight = getHeight();
      if(!widgetWidth || !widgetHeight){
        return;
      }

      createAndAddTrebbleWidgetToPage( widgetWidth, widgetHeight, trebbleEmbedUrl);
      window.INSTALL_SCOPE.setOptions  = setOptionsOnTrebbleWidget ;
      if(isUsingDemoTrebble && window.INSTALL_SCOPE.demoBagdeElement){
        window.INSTALL_SCOPE.demoBagdeElement.setAttribute("badgeState", "trebbledemo");
        window.INSTALL_SCOPE.demoBagdeElement.innerHTML = "Demo Preview";
      }else{
        if(isSelectedTrebbleHasEnoughContentToBePlayed()){
          window.INSTALL_SCOPE.demoBagdeElement.setAttribute("badgeState", "notenoughcontent");
          window.INSTALL_SCOPE.demoBagdeElement.innerHTML = "Not Enough Content To Play";
        }else{
          window.INSTALL_SCOPE.demoBagdeElement.setAttribute("badgeState", "none");
          window.INSTALL_SCOPE.demoBagdeElement.innerHTML = null;
        }
      }

    };



    
    if (document.readyState == 'loading'){
      document.addEventListener('DOMContentLoaded', addElement);
    }else{
      addElement();
    }

  })();