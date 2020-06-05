let panel;

function create() {
  const html = `
<style>
	label.row {
		display: flex;
		flex-direction: column;
		position: relative;
	}
	label {
		position: relative;
	}
    label > span {
		cursor: pointer;
        color: #8E8E8E;
        text-align: center;
		width: 90%;
        font-size: 9px;
		display: block;
		border: 2px solid #8E8E8E;
		padding: 4px;
		border-radius: 4px;
    }
	label input[type=checkbox] {
		display: inline-block;
		position: absolute;
		top: 2px;
		left: 8px;
	}
	label input[type=checkbox]:checked + span {
		background-color: #8E8E8E;
		color: white;
	}
    form {
        width:100%;
        padding: 0 10px 0 0;
    }
	.subhead {
		font-weight: 700;
	}
	.extlink { width: 10%; position: relative; }
	.extlink:after {
		content: '';
		width: 16px;
		height: 16px;
		position: absolute;
		top: -2px;
		background-image: url(images/external-link.png);
		opacity: 0.5;
	}
	.extlink:hover:after {
		opacity: 1;
	}
    .show {
        display: block;
    }
    .hide {
        display: none;
    }
</style>

<form method="dialog" id="main">
	<div class="row">
		<p class="subhead">Display Ads</p>
	</div>
    <div class="row">
        <label>
            <input type="checkbox" uxp-quiet="true" id="superbanner" name="banner" value="superbanner" />
			<span>Superbanner</span>
        </label>
		<a class="extlink" href="https://www.iqm.de/fileadmin/user_upload/Medien/Online/Werbeformate/Technische_Spezifikationen_d.pdf#page=25&zoom=auto,-16,540"></a>
    </div>
	<div class="row">
        <label>
            <input type="checkbox" uxp-quiet="true" id="skyscraper" name="banner" value="skyscraper" />
			<span>Skyscraper</span>
        </label>
		<a class="extlink" href="https://www.iqm.de/fileadmin/user_upload/Medien/Online/Werbeformate/Technische_Spezifikationen_d.pdf#page=25&zoom=auto,-16,540"></a>
    </div>
	<div class="row">
        <label>
            <input type="checkbox" uxp-quiet="true" id="mediumrectangle" name="banner" value="mediumrectangle" />
			<span>Medium Rectangle</span>
        </label>
		<a class="extlink" href="https://www.iqm.de/fileadmin/user_upload/Medien/Online/Werbeformate/Technische_Spezifikationen_d.pdf#page=25&zoom=auto,-16,540"></a>
    </div>
	<div class="row">
        <label>
            <input type="checkbox" uxp-quiet="true" id="mediumrectangle" name="banner" value="mediumrectangle" />
			<span>Medium Rectangle</span>
        </label>
		<a class="extlink" href="https://www.iqm.de/fileadmin/user_upload/Medien/Online/Werbeformate/Technische_Spezifikationen_d.pdf#page=20&zoom=auto,-16,540"></a>
    </div>
	<hr>
    <footer><button id="ok" type="submit" uxp-variant="cta">Zeichenflächen erstellen</button></footer>
</form>

<p id="warning">This plugin requires you to select a rectangle in the document. Please select a rectangle.</p>
`;

  function increaseRectangleSize() {
	  	const { editDocument } = require("application");
		const { selection, Artboard, Color, Text } = require("scenegraph");
		const { alert, error } = require("./lib/dialogs.js");

		editDocument({ editLabel: "Increase rectangle size" }, function(selection) {
			
		// create artboard instances
		let yVal = 0;
		const superbanner = new Artboard();
		const superbannerText = "Superbanner";
		specifyArtboard(superbanner, superbannerText, 728, 90);
			
		const skyscraper = new Artboard();
		const skyscraperText = "Skyscraper";
		specifyArtboard(skyscraper, skyscraperText, 120, 600);
			
		const mediumrectangle = new Artboard();
		const mediumrectangleText = "Medium Rectangle";
		specifyArtboard(mediumrectangle, mediumrectangleText, 300, 250);


		// create array
		let artboards = {superbanner, skyscraper, mediumrectangle};
		let checkboxesChecked = [];

		// Pass the checkbox name to the function
		function getCheckedBoxes(chkboxName) {
			var checkboxes = document.getElementsByTagName(chkboxName);
			
			// loop over them all
			for (let i=0; i<checkboxes.length; i++) {
				// And stick the checked ones onto an array...
				if (checkboxes[i].checked) {
					checkboxesChecked.push(artboards[checkboxes[i].value]);
				}
			}
			// Return the array if it is non-empty, or null
			return checkboxesChecked.length > 0 ? checkboxesChecked : null;
		}

		// Better Call Saul
		const checkedBoxes = getCheckedBoxes("input");
			
		if (selection.items[0] == undefined) {

			// clear all elements from stage
			selection.insertionParent.removeAllChildren();

			// build artboards
			for (const artboard of checkboxesChecked) {

				selection.insertionParent.addChild(artboard);
				artboard.moveInParentCoordinates(0, yVal);
				
				yVal += artboard.height + 60;
				
				if (artboard.name == superbannerText || artboard.name == skyscraperText || artboard.name == mediumrectangleText ){
					specifyText("Max. 200 KiloByte", artboard);
				}
				
			}

		} else { error("Fehler beim ausführen des Plugins", "Bitte achte darauf, dass du kein Element in deiner Datei ausgewählt hast."); }


		function specifyArtboard(el, name, elWidth, elHeight) {
			el.width = elWidth;
			el.height = elHeight;
			el.name = name;
			el.fill = new Color("#e8edee");
		}
		function specifyText(txt, board) {
			const node = new Text();
			node.text = txt;
			node.fill = new Color("#e61849");
			node.fontSize = 12;
			board.addChild(node);
			node.moveInParentCoordinates(10, 20);
		}
			
		});
  }

  panel = document.createElement("div"); // [9]
  panel.innerHTML = html; // [10]
  panel.querySelector("form").addEventListener("submit", increaseRectangleSize); // [11]

  return panel;
}

function show(event) { // [1]
  if (!panel) event.node.appendChild(create()); // [2]
}

function update(selection) {
	//console.log('Silence')
}

module.exports = {
  panels: {
    createBanners: {
      show,
      update
    }
  }
};
