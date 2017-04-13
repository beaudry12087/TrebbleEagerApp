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
          return;
        }
        var location =  {selector: "body"};
        if(options.whereToAppend == "BeforeThePage"){
          location.method = "prepend";
        }else{
          location.method = "append";
        }

        element =  INSTALL.createElement(location);
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
          element.style["z-index"] = "999999999";
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
        console.error("isEmbeddedInCloudflareapps "+ iframeParentUrl);
        if(iframeParentUrl){
          return iframeParentUrl.indexOf("cloudflare.com") != -1;
        }
        return false;
      }

      var getTrebbleWidgetUrl = function(){
        var trebbleId = extractTrebbleIdFromUrl(options.trebbleId);
        if(trebbleId){
          var TREBBLE_EMBED_URL_PREFIX = "https://web.trebble.fm/trebble_embedded_optimized.html#p/l/t/";
          return TREBBLE_EMBED_URL_PREFIX + trebbleId +"/r/" + APP_CONTEXT;
        }else{
          return "https://web.trebble.fm/TrebbleWidgetEmptyPlaceholder.html";
        }
      }


      function createAndAddTrebbleWidgetToPage( width, height, trebbleEmbedUrl){
       createAppElement();
       if(element && width && height){
        window.INSTALL_SCOPE.currentTrebbleWidgetUrl =  trebbleEmbedUrl;
        var iframe = document.createElement('iframe')
        iframe.style = 'max-width: 100%;'
        iframe.width = width
        iframe.height = height
        iframe.frameBorder = '0'
        iframe.setAttribute('allowTransparency', '')
        iframe.setAttribute('allowfullscreen', '')
        iframe.src = trebbleEmbedUrl;
        element.appendChild(iframe)
        window.INSTALL_SCOPE.trebbleWidgetIframe = element.children.length > 0 ? element.children[0]: null;
      }
    };

    //Function to Update embedded trebble widget if the height, the width or the trebble id changes
    function setOptionsOnTrebbleWidget(nextOptions){
      console.error("Calling setOptionsOnTrebbleWidget");
      options = nextOptions;
      var newWidgetWidth = getWidth();
      var newWidgetHeight = getHeight();
      var newTrebbleEmbedUrl = getTrebbleWidgetUrl();
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

    };


    function addElement() {
      window.INSTALL_SCOPE.trebbleWidgetIframe  = null;
      window.INSTALL_SCOPE.currentTrebbleWidgetUrl = null;
      var trebbleEmbedUrl = getTrebbleWidgetUrl();
      var widgetWidth = getWidth();
      var widgetHeight = getHeight();
      if(!widgetWidth || !widgetHeight){
        return;
      }
        
      createAndAddTrebbleWidgetToPage( widgetWidth, widgetHeight, trebbleEmbedUrl);
      window.INSTALL_SCOPE.setOptions  = setOptionsOnTrebbleWidget ;

    };

  

    if(!inIframe() || isEmbeddedInCloudflareapps()){
      if (document.readyState == 'loading'){
        document.addEventListener('DOMContentLoaded', addElement);
      }else{
        addElement();
      }
    }
  })();