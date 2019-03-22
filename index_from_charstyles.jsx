//DESCRIPTION: Add index markers to text formatted with selected character styles
// Peter Kahrel -- www.kahrel.plus.com

/*
	To have the script swap items on a space character and insert a comma (John Keats > Keats, John),
	add @@ to the character style's name.
	To get multiple levels of topic from a condition's name, use %% as a separator.
	If the found string contains two or more spaces, by default it will be split on the first space.
	To designate another space, add a non-joiner before it.
*/

(function () {
	
	var errors = false;

	function errorM (m) {
		alert (m, 'Error', true);
		exit();
	}


	function getCondition (doc) {
		var condition = doc.conditions.item('index_from_charstyles_error');
		if (!condition.isValid) {
			condition = doc.conditions.add ({name: 'index_from_charstyles_error'});
		}
		return condition;
	}

//~ 	function progress () {
//~ 		var w = new Window ('palette {text: "Index character styles", alignChildren:  ["left", "top"]}');
//~ 		w.fname = w.add ('statictext {characters: 40}');
//~ 		return w;
//~ 	}

	function scriptPath () {
		try {
			return app.activeScript;
		} catch (e) {
			return File (e.fileName);
		}
	}

	function saveData (obj) {
		var f = File (scriptPath().fullName.replace (/\.jsx?(bin)?$/, '.txt'));
		f.open ('w');
		f.write (obj.toSource());
		f.close ();
	}

	function getPrevious () {
		var f = File (scriptPath().fullName.replace (/\.jsx?(bin)?$/, '.txt'));
		var obj = {};
		if (f.exists) {
			obj = $.evalFile (f);
		}
		return obj;
	}

	//------------------------------------------------------------------------------------------------------------------------------------------------------------

	function addPageReference (topic, found) {
		var ip = found.insertionPoints[0].index;
		var pRef = topic.pageReferences.add (found.insertionPoints[0], PageReferenceType.CURRENT_PAGE);
		if (Math.abs (pRef.sourceText.index - ip) > 0) {
			try {
				found.parentStory.characters[pRef.sourceText.index].move (LocationOptions.AFTER, found.insertionPoints[0]);
			} catch (_) {
				// . . .
			}
		}
	}

	function index_documents (data) {
		var i, j, k;
		var new_topic;
		var found;
		var doc;
		var prompt;
		var swap;
		var target;
		//var displ = progress();
		//displ.show();
		
		function addTopic (index, path, found, swap) {
			var name = found.contents;
			var space;
			var n;
			var t = index;
			
			if (data.prefix_stylename == 'Style names nest topics') {
				var parts = path.split('%%');
				for (var i = 0; i < parts.length; i++) {
					t = t.topics.add (parts[i].replace(/@@/g,''));
				}
			}
		
			try {
				if (!swap || !/\s/.test(name)) {
					n = name.replace(/@@/g,'');
				} else if (name.indexOf('\u200C ') < 0) {
					space = name.indexOf(' ')
					n = name.slice(space+1) + ', ' + name.slice(0,space);
				} else {
					space = name.indexOf('\u200C ');
					n = name.slice(space+2) + ', ' + name.slice(0,space);
				}
				if (data.prefix_stylename == 'Style names are prefixes') {
					n = path + '##' + n;
				}
				return  t.topics.add (n);
			} catch (_) {
				found.appliedConditions = [getCondition(doc)];
				errors = true;
			}
		}
			
		
		for (i = app.documents.length-1; i >= 0; i--) {
			doc = app.documents[i];
			//displ.fname.text = app.documents[i].name;
			if (data.replace_index == true && doc.indexes.length > 0) {
				doc.indexes[0].topics.everyItem().remove();
			}
			if (doc.indexes.length == 0) {
				doc.indexes.add();
			}
			for (j = 0; j < data.styles.length; j++) {
				//prompt = app.documents[i].name + ': ' + data.styles[j];
				//displ.fname.text = prompt;
				try {
					if (data.styleType == 'Character styles') {
						app.findGrepPreferences.appliedCharacterStyle = doc.characterStyles.itemByID (data.styles[j]);
						swap = /@@$/.test(doc.characterStyles.itemByID (data.styles[j]).name);
					} else {
						app.findGrepPreferences.appliedConditions = [doc.conditions.itemByID (data.styles[j])];
						swap = /@@$/.test(doc.conditions.itemByID (data.styles[j]).name);
					}
					found = doc.findGrep();
					for (k = found.length-1; k > -1; k--) {
						//displ.fname.text = prompt + ' ' + k;
						new_topic = addTopic (doc.indexes[0], data.paths[j], found[k], swap)
						addPageReference (new_topic, found[k]);
					}
				} catch (_) {
					//$.bp();
					// The requested character style/condition is not in the document
				}
			}
		}
//~ 		try {
//~ 			displ.close();
//~ 		} catch (_) {
//~ 			// 
//~ 		}
	}

	//------------------------------------------------------------------------------------------------------------------------------------------------------------

	function getData () {
		var temp, styles;
		
		function buildListCharacterStyles (scope, list, str, path) {
			styles = scope.characterStyles.everyItem().getElements();
			for (var i = 0; i < styles.length; i++) {
				if (styles[i] != app.documents[0].characterStyles[0]) {
					temp = list.add ('item', styles[i].name + (str == '' ? '' : ' ('+str+')'));
					temp.id = styles[i].id; // Add property so we can easily get a handle on the style later
					temp.path = path + styles[i].name;
				}
			}
			for (var j = 0; j < scope.characterStyleGroups.length; j++) {
				buildListCharacterStyles (scope.characterStyleGroups[j], list, str + (str == '' ? '' : ':') + scope.characterStyleGroups[j].name, path + scope.characterStyleGroups[j].name +'%%');
			}
		}

		function buildListConditions (list) {
			var c = app.documents[0].conditions.everyItem().getElements();
			for (var i = 0; i < c.length; i++) {
				temp = list.add ('item', c[i].name);
				temp.id = c[i].id;
				temp.path = c[i].name;
			}
		}

		function getSelected (list) {
			var o = {IDs: [], names: [], paths: []};
			for (var i = list.selection.length-1; i >= 0; i--) {
				o.IDs.push (list.selection[i].id);
				o.paths.push (list.selection[i].path);
				o.names.push (list.selection[i].text);
			}
			return o;
		}


		var w = new Window ('dialog', 'Style content to index', undefined, {closeButton: false});
		w.alignChildren = ['fill','fill'];
		w.dummy = w.add ('group');
		w.dummy.alignChildren = ['fill','fill'];
		
		w.styleList = w.dummy.add ('listbox {properties: {multiselect: true}}');
		w.styleList.preferredSize.height = 200;
		
		w.styleType = w.add ('dropdownlist', undefined, ['Character styles', 'Conditions']);
		w.styleType.title = 'Target:';
		w.styleType.titleLayout = {characters: 5};

		w.prefix = w.add ('dropdownlist', undefined, ['Content only', 'Style names nest topics', 'Style names are prefixes']);
		w.prefix.title = 'Mode:';
		w.prefix.titleLayout = {characters: 5};
		
		w.replace = w.add ('checkbox {text: "Replace existing index"}');
		
		w.buttons = w.add ('group {orientation: "row", alignChildren: ["right", "bottom"]}');
			w.buttons.add ('button {text: "OK"}');
			w.buttons.add ('button {text: "Cancel"}');

		w.styleList.onChange = function () {
			if (w.styleList.selection == null) {
				w.styleList.selection = 0;
			}
		}

		w.styleType.onChange = function () {
			w.styleList.removeAll();
			switch (w.styleType.selection.text) {
				case 'Character styles': buildListCharacterStyles (app.activeDocument, w.styleList, '', ''); break;
				case 'Conditions': buildListConditions (w.styleList);
			}
			if (w.styleList.selection == null) {
				w.styleList.selection = 0;
			}
		}

		w.onShow = function () {
			var previous = getPrevious();
			w.replace.value = previous.replace_index;
			w.prefix.selection = w.prefix.find (previous.prefix_stylename) || 0;
			w.styleType.selection = w.styleType.find (previous.styleType) || 0;
			if (w.styleList.children.length) {
				w.styleList.selection[0].selected = false;
			}
			if (previous.names) {
				for (var i = 0; i < previous.names.length; i++) {
					if (w.styleList.find (previous.names[i]) !== null) {
						w.styleList.find (previous.names[i]).selected = true;
					}
				}
			} else {
				w.styleList.selection = 0;
			}
		}

		if (w.show () == 1) {
			if (w.styleList.selection ==  null) {
				alert ('Nothing selected made.'); exit();
			}
			var selectedStyles = getSelected (w.styleList)
			var obj = {
				styleType: w.styleType.selection.text,
				styles: selectedStyles.IDs, 
				names: selectedStyles.names,
				paths: selectedStyles.paths,
				replace_index: w.replace.value,
				prefix_stylename: w.prefix.selection.text
			};
			saveData (obj);
			w.close();
			return obj;
		}
		exit ();
	}

	if (!app.documents.length) exit();
	var data = getData ();
	app.findGrepPreferences = app.changeGrepPreferences = app.findChangeGrepOptions = null;
	index_documents (data);
	
	if (errors) {
		alert ('One or more errors encountered. Look for instances of the condition "index_from_charstyles_error", fix the problems, and run the script again.')
	} else {
		alert ('Done.');
	}

}());