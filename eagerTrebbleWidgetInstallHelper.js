(function(){
  if (!document.addEventListener || !window.JSON) return;

  var fullRe = /(?:https?:\/\/)?(?:www\.)?youtube.com\/(watch|playlist)\?(v|list)=([a-zA-Z0-9]+)/i;
  var shortRe = /(?:https?:\/\/)?youtu.be\/([a-zA-Z0-9]+)(?:\?list=([a-zA-Z0-9]+))?/i;

  var parseURL = function(url) {
    var match = fullRe.exec(url);

    var type = 'watch';
    var id;
    if (match) {
      type = match[1];
      id = match[3];
    } else {
      match = shortRe.exec(url);

      if (!match)
        return null;

      if (match[2]) {
        type = 'playlist';
        id = match[2];
      } else {
        id = match[1];
      }
    }

    return {type: type, id: id};
  };

  var options = INSTALL_OPTIONS;

  var getWidth = function(options){
    if(options.whereToAppend == "ChooseYourOwn"){
      if(options.widthFitContainer){
        return "100%";
      }else{
        if(options.customWidth){
            return options.customWidth +"px";
        }
      }
      return null;
    }else{
      return "100%";
    }
    
  }

  var getHeight = function(options){
    if(options.whereToAppend == "ChooseYourOwn"){
      if(options.heightFitContainer){
        return "100%";
      }else{
        if(options.customHeight){
            return options.customHeight +"px";
        }
      }
      return null;
    }else{
      return "60px";
    }
  }

  var getLocation = function(options){
      var customLocation = options.whereToAppend == "ChooseYourOwn";
      if(customLocation){
        return Eager.createElement(options.location);
      }else{
        var l =  {"selector": "body"};
        if(options.whereToAppend == "BeforeThePage"){
          l.method = "prepend";
        }else{
          l.method = "append";
        }
        return Eager.createElement(l);
      }
      return customLocation?Eager.createElement(options.location): document.body;
  }

  var extractTrebbleIdFromUrl = function(urlOrTrebbleId){
    if(urlOrTrebbleId && urlOrTrebbleId.indexOf("//web.trebble.fm") != -1){
        var decodeURL = decodeURIComponent(urlOrTrebbleId);
        return decodeURL.substr(decodeURL.lastIndexOf('/') + 1);
    }else{
      return urlOrTrebbleId;
    }

  }

  var getTrebbleWidgetUrl = function(options){
    var trebbleId = extractTrebbleIdFromUrl(options.trebbleId);
    if(trebbleId){
      var TREBBLE_EMBED_URL_PREFIX = "https://web.trebble.fm/trebble_embedded_optimized.html#p/l/t/";
      return TREBBLE_EMBED_URL_PREFIX + trebbleId;
    }else{
      return "https://web.trebble.fm/TrebbleWidgetEmptyPlaceholder.html";
    }
  }

  var add = function() {
      var options = INSTALL_OPTIONS;
      
      window.EagerAddTrebbleWiget = {};
      window.EagerAddTrebbleWiget.trebbleWidgetIframe  = null;
      window.EagerAddTrebbleWiget.currentTrebbleWidgetUrl = null;


      var trebbleEmbedUrl = getTrebbleWidgetUrl(options);

      
      var el = getLocation(options)
      if(!el){
        return;
      }

      var widgetWidth = getWidth(options);
      var widgetHeight = getHeight(options);

      if(!widgetWidth || !widgetHeight){
        return;
      }
      var initializeAndAddTrebbleWidget = function(newOptions, newWidgetWidth, newWidgetHeight, newTrebbleEmbedUrl){
        var el = getLocation(options);
        if(el && newOptions && newWidgetWidth && newWidgetHeight){
          window.EagerAddTrebbleWiget.currentTrebbleWidgetUrl =  trebbleEmbedUrl;
          el.innerHTML = '<iframe type="text/html" style="max-width: 100%;" width="'+ newWidgetWidth +'" height="'+ newWidgetHeight +'" src="' + newTrebbleEmbedUrl + '" frameborder="0" allowtransparency="true"/>';
          window.EagerAddTrebbleWiget.trebbleWidgetIframe = el.children.length > 0 ? el.children[0]: null;
        }
      };

      initializeAndAddTrebbleWidget(options, widgetWidth, widgetHeight, trebbleEmbedUrl);
      //Function to Update embedded trebble widget if the height, the width or the trebble id changes
      var setOptionsOnTrebbleWidget = function(newOptions){
         var newWidgetWidth = getWidth(newOptions);
          var newWidgetHeight = getHeight(newOptions);
          var newTrebbleEmbedUrl = getTrebbleWidgetUrl(newOptions);
        if(window.EagerAddTrebbleWiget.trebbleWidgetIframe){
          if(newWidgetWidth){
            window.EagerAddTrebbleWiget.trebbleWidgetIframe.width = newWidgetWidth;
          }
          if(newWidgetHeight){
            window.EagerAddTrebbleWiget.trebbleWidgetIframe.height = newWidgetHeight;
          }
          if(newTrebbleEmbedUrl != window.EagerAddTrebbleWiget.currentTrebbleWidgetUrl){
            window.EagerAddTrebbleWiget.trebbleWidgetIframe.src = newTrebbleEmbedUrl;
            window.EagerAddTrebbleWiget.currentTrebbleWidgetUrl = newTrebbleEmbedUrl;
          }
        }else{
          initializeAndAddTrebbleWidget(newOptions, newWidgetWidth, newWidgetHeight, newTrebbleEmbedUrl);
        }

      };
      window.EagerAddTrebbleWiget.setOptions  = setOptionsOnTrebbleWidget ;

  };

  if (document.readyState == 'loading')
    document.addEventListener('DOMContentLoaded', add);
  else
    add();
})();