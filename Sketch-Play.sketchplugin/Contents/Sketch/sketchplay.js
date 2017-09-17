var expString = "";
var debugMode = true;

var onRun = function( context )
{

	// Get page context
	doc = context.document;
	pages = doc.pages();
	page = doc.currentPage();
	artboard = page.currentArtboard();
	current = artboard || page;


	this.scriptPath = context.scriptPath;
    this.scriptPathRoot = this.scriptPath.stringByDeletingLastPathComponent();
    this.scriptResourcesPath = this.scriptPathRoot.stringByDeletingLastPathComponent() + '/Resources';
    var icon = NSImage.alloc().initByReferencingFile(this.scriptResourcesPath + '/' + "icon.png");


	// Check selected items
	var selection = context.selection;

	var doc = context.document;
    var currentArtboard = doc.currentPage().currentArtboard();

    function openURL(url){
	  var nsurl = NSURL.URLWithString(url);
	  NSWorkspace.sharedWorkspace().openURL(nsurl)
	}

	function tutorials(){
		//var sendString = "http://localhost/~sureskumar/sketchplay/index_play.php?gid=" + expString;
		var sendString = "http://sureskumar.com/sketchplay/create.php?gid=" + expString;
	  	openURL(sendString);
	}

	var showDialog = function(title, informativeText) {
      var alert = [[NSAlert alloc] init]
      [alert setMessageText: title]
      [alert setInformativeText: informativeText]
      [alert addButtonWithTitle: "OK"] // 1000
      alert.setIcon(icon);
      var responseCode = [alert runModal]
    }

    var sketchplay = function(layers) {

        var arect = artboard.absoluteRect();
        superDebug("arect.width()", arect.width());
        superDebug("arect.height()", arect.height());
        expString = expString + Math.round(arect.width()) + ",";
        expString = expString + Math.round(arect.height()) + ",";
				expString = expString + (artboard.backgroundColor().red() * 255).toFixed(0) + ",";
				expString = expString + (artboard.backgroundColor().blue() * 255).toFixed(0) + ",";
				expString = expString + (artboard.backgroundColor().green() * 255).toFixed(0) + ",";
				//expString = expString + (artboard.backgroundColor().alpha().toFixed(2)) + ",";

    	var la = layers;

    	expString = expString + [la count] + ",";

		for (var ia=0; ia < [la count]; ia++) {
			var lay = [la objectAtIndex:ia]

			superDebug("X", lay.frame().x());
			superDebug("Y", lay.frame().y());
			superDebug("W", lay.frame().width());
			superDebug("H", lay.frame().height());

			expString = expString + Math.round(lay.frame().x()) + ",";
			expString = expString + Math.round(lay.frame().y()) + ",";
			expString = expString + Math.round(lay.frame().width()) + ",";
			expString = expString + Math.round(lay.frame().height()) + ",";

			var fill = firstVisibleFill(lay);
			//var border = firstVisibleBorder(lay);


			if(fill) {
				var colour = fill.color();
				superDebug("R", (colour.red() * 255).toFixed(0));
				superDebug("B", (colour.blue() * 255).toFixed(0));
				superDebug("G", (colour.green() * 255).toFixed(0));
				//superDebug("A", (colour.alpha().toFixed(2) * 100).toFixed(0));

				expString = expString + "1" + ",";
				expString = expString + (colour.red() * 255).toFixed(0) + ",";
				expString = expString + (colour.blue() * 255).toFixed(0) + ",";
				expString = expString + (colour.green() * 255).toFixed(0) + ",";
				//expString = expString + (colour.alpha().toFixed(2) * 100).toFixed(0) + ",";

			} else {
				expString = expString + "0" + ",";
				expString = expString + "255" + ",";
				expString = expString + "255" + ",";
				expString = expString + "255" + ",";
				//expString = expString + "0" + ",";
			}

			/*
			if(border) {
				var borderColour = fill.color();
				superDebug("R", (borderColour.red() * 255).toFixed(0));
				superDebug("B", (borderColour.blue() * 255).toFixed(0));
				superDebug("G", (borderColour.green() * 255).toFixed(0));
				superDebug("A", (borderColour.alpha().toFixed(2) * 100).toFixed(0));

				expString = expString + "1" + ",";
				expString = expString + (borderColour.red() * 255).toFixed(0) + ",";
				expString = expString + (borderColour.blue() * 255).toFixed(0) + ",";
				expString = expString + (borderColour.green() * 255).toFixed(0) + ",";
				expString = expString + (borderColour.alpha().toFixed(2) * 100).toFixed(0) + ",";
			} else {
				expString = expString + "0" + ",";
				expString = expString + "0" + ",";
				expString = expString + "0" + ",";
				expString = expString + "0" + ",";
				expString = expString + "0" + ",";
			}
			*/

			//if(ia == [la count] - 1) {
				//expString = expString + Math.round(lay.frame().height());
			//} else {
				expString = expString + Math.round(lay.frame().height()) + ",";
			//}
		}

		var str = artboard.name();
		var sendArtboardName = str.replace(/ /g, "?");
		expString = expString + sendArtboardName;

		superDebug("expString", expString);

		tutorials();
    }

	if (selection.count() <= 0 || selection.count() > 1) {
    	showDialog("Sketch Play", "Please select an artboard. Cheers!");
    } else {
          var layer = selection[0];
          if (layer == artboard) {

							var artboard_spec = artboard.absoluteRect();
							if(artboard_spec.width() < 300 || artboard_spec.height() < 300) {
									showDialog("Sketch Play", "Artboard's width and height should be greater than 300px. Cheers!");
							} else {
									var layers = current.layers()
									if ([layers count] > 0) {
										sketchplay(layers);
									} else {
										showDialog("Sketch Play", "Please add at least one rectangle in the artbord. Cheers!");
									}
							}


          } else {
          	showDialog("Sketch Play", "Please select an artboard. Cheers!");
          }
    }



}

var firstVisibleFill = function(layer)
{
	for(var i = 0; i < layer.style().fills().count(); i++)
	{
		var fill = layer.style().fills().objectAtIndex(i);
		if(fill.isEnabled())
		{
			return fill;
		}
	}

	return false;
}

var firstVisibleBorder = function(layer)
{
	for(var i = 0; i < layer.style().borders().count(); i++)
	{
		var border = layer.style().borders().objectAtIndex(i);
		if(border.isEnabled())
		{
			return border;
		}
	}

	return false;
}

var superDebug = function( lbl, val )
{
  if(debugMode) {
	log("SKETCH PLAY DEBUG // " + lbl + ": " + val);
  }
}
