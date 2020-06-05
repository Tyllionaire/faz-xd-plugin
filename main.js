let panel;

function create() {
  const html = `
<style>
	label.row {
		display: flex;
		flex-direction: column;
	}
	label {
		
	}
    label > span {
		cursor: pointer;
        color: #8E8E8E;
        text-align: center;
		width: 100%;
        font-size: 9px;
		display: block;
		border: 2px solid #8E8E8E;
		padding: 4px;
		border-radius: 4px;
    }
	label input[type=checkbox] {
		display: none;
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
    .show {
        display: block;
    }
    .hide {
        display: none;
    }
</style>

<form method="dialog" id="main">
	<div class="row"><p class="subhead">Standardwerbeformen - <a href="https://www.iqm.de/fileadmin/user_upload/Medien/Online/Werbeformate/Technische_Spezifikationen_d.pdf#page=24&zoom=auto,-16,540">Mehr</a></p></div>
    <div class="row">
        <label>
            <input type="checkbox" uxp-quiet="true" id="superbanner" name="banner" value="superbanner" />
			<span>Superbanner</span>
        </label>
    </div>
    <div class="row">
        <label>
            <input type="checkbox" uxp-quiet="true" id="newArtboard2" name="banner" value="newArtboard2" />
			<span>Banner 2</span>
        </label>
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
		let yVal = -60;
		const superbanner = new Artboard();
		const newArtboard2 = new Artboard();
			
		const superbannerText = "Superbanner";
		const mobileHighImpact = "Mobile High Impact";

		// specify artboard dimensions
		specifyArtboard(superbanner, superbannerText, 728, 90);
		specifyArtboard(newArtboard2, "Blabla", 400, 80);

		// create array
		let artboards = {superbanner, newArtboard2};
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
				yVal += artboard.height + 60;

				selection.insertionParent.addChild(artboard);
				artboard.moveInParentCoordinates(0, yVal);
				
				if (artboard.name == superbannerText) {
					specifyText("Text", artboard);
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
			node.fill = new Color("#FF0000");
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
