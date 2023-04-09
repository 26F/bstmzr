/**/
const HEIGHT = 480;
const USERINPUTTEXTPROMPT = "name";

var userinterface = undefined;


function dist(x, y, dx, dy)
{

	return Math.sqrt((x - dx) * (x - dx) + (y - dy) * (y - dy));

}


class VisualNode
{

	constructor(x, y, width, height)
	{

		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		this.text = "";
		this.isroot = false;

		this.edgetype = "ADJACENT"; // default

	}

	settext(t)
	{

		this.text = t;

	}

	setroot()
	{

		this.isroot = true;

	}

}


function getcanvas()
{

	var canvas = document.getElementById("canvas");
	return canvas;

}

function getcanvasctx(incanvas)
{

	var canvasctx = incanvas.getContext("2d");
	return canvasctx;

}


class UserInterface
{

	constructor()
	{

		this.canvas = undefined;
		this.canvascontext = undefined;

		this.usertyped = "";

		// -1 for nothing selected.
		this.selectednodeidx = 0; // after first node placed first node selected.
		this.lastnodeselected = -1;

		this.currentdepthroot = undefined;

		this.rootx = undefined;
		this.rooty = undefined;

		this.innotetakingmode = false;

		this.entertextprompt = "your notes (escape to exit and save.)";

		this.nodes = []

		// This is not a real id, just for displaying unnamed nodes.
		this.uselessid = 0;

	}

	ensurenamed()
	{

		if (this.selectednodeidx == -1)
		{

			return;

		}

		if (this.selectednodeidx < this.nodes.length && this.nodes[this.selectednodeidx].text == "")
		{
			
			this.nodes[this.selectednodeidx].text = "unnamed node " + this.uselessid;
			this.currentdepthroot.atthisdepth[this.selectednodeidx].name = "unnamed node " + this.uselessid;
			this.uselessid++;

		}

	}

	setcanvas()
	{

		this.canvas = getcanvas();
		this.canvas.owner = this;

	}

	setcanvasctx()
	{

		if (this.canvas != undefined)
		{

			this.canvascontext = getcanvasctx(this.canvas);
			this.canvascontext.width = window.innerWidth;

		}

	}

	sizecanvas(width)
	{

		if (this.canvas != undefined)
		{

			this.canvas.width = width - 64;
			this.canvas.height = HEIGHT;

		}

	}


	type(event)
	{

		if (this.innotetakingmode)
		{

			return;

		}

		// If not master root but view root is selected - can't rename
		if (this.currentdepthroot.id != 0 && this.selectednodeidx == 0)
		{
			return;

		}

		// A node is selected
		if (this.selectednodeidx != -1)
		{

			this.usertyped += String.fromCharCode(event.keyCode);

			this.nodes[this.selectednodeidx].settext(this.usertyped);

			if (this.currentdepthroot != undefined)
			{

				// Check if this.usertyped is equal to a name used at current depth: causes cycle
				for (var idx = 0; idx < this.currentdepthroot.atthisdepth.length; ++idx)
				{

					if (this.currentdepthroot.atthisdepth[idx].name == this.usertyped)
					{

						this.usertyped += this.currentdepthroot.atthisdepth[0].id;
			
					}

				}

				this.currentdepthroot.atthisdepth[this.selectednodeidx].name = this.usertyped;
				this.nodes[this.selectednodeidx].text = this.usertyped;
			
			}

		}

	}


	clearscr()
	{

		if (this.canvas != undefined)
		{

			this.canvas.clearRect(0, 0, this.canvas.width, this.canvas.height);

		}
		else
		{

			alert("canvas is not defined ")

		}

	}


	showselected(x, y, w, h)
	{

		var extra = 5; // spacing
		var linesize = 10;
		var topleft = [x - ((w / 2) + extra), y - ((h / 2) + extra)];
		var topright = [x + ((w / 2) + extra), y - ((h / 2) + extra)];

		var bottomleft = [x - ((w / 2) + extra), y + ((h / 2) + extra)]
		var bottomright = [x + ((w / 2) + extra), y + ((h / 2) + extra)]

		this.canvascontext.strokeStyle = "black";

		this.canvascontext.moveTo(topleft[0], topleft[1]);
		this.canvascontext.lineTo(topleft[0], topleft[1] - linesize);
		this.canvascontext.moveTo(topleft[0], topleft[1] - linesize);
		this.canvascontext.lineTo(topleft[0] + linesize, topleft[1] - linesize);

		this.canvascontext.moveTo(topright[0], topright[1]);
		this.canvascontext.lineTo(topright[0], topright[1] - linesize);
		this.canvascontext.moveTo(topright[0], topright[1] - linesize);
		this.canvascontext.lineTo(topright[0] - linesize, topright[1] - linesize);

		this.canvascontext.moveTo(bottomleft[0], bottomleft[1]);
		this.canvascontext.lineTo(bottomleft[0], bottomleft[1] + linesize);
		this.canvascontext.moveTo(bottomleft[0], bottomleft[1] + linesize);
		this.canvascontext.lineTo(bottomleft[0] + linesize, bottomleft[1] + linesize);

		this.canvascontext.moveTo(bottomright[0], bottomright[1]);
		this.canvascontext.lineTo(bottomright[0], bottomright[1] + linesize);
		this.canvascontext.moveTo(bottomright[0], bottomright[1] + linesize);
		this.canvascontext.lineTo(bottomright[0] - linesize, bottomright[1] + linesize);

		this.canvascontext.stroke();
	}



	drawedge(edgetype, srcx, srcy, dstx, dsty)
	{

		this.canvascontext.beginPath();
		this.canvascontext.moveTo(srcx, srcy);

		this.canvascontext.lineTo(dstx, dsty);

		this.canvascontext.stroke();


	}


	drawall()
	{

		this.canvascontext.clearRect(0, 0, this.canvas.width, this.canvas.height);

		if (this.nodes.length > 0)
		{

			var rootnode = this.nodes[0];

			for (var nodeidx = 0; nodeidx < this.nodes.length; ++nodeidx)
			{

				var width = 50;
				var height = 20;

				var drawnode = this.nodes[nodeidx];
				var x = drawnode.x;
				var y = drawnode.y;

				var textwidth = this.canvascontext.measureText(drawnode.text).width;

				var drawwidth = 50;

				if (textwidth > 50)
				{

					drawwidth = textwidth;

				}

				this.canvascontext.beginPath();
				this.canvascontext.ellipse(x, y, drawwidth, 20, 0, 0, 2 * Math.PI);

				this.nodes[nodeidx].width = drawwidth;

				this.canvascontext.strokeStyle = "black";
				this.canvascontext.lineWidth = 3;
				this.canvascontext.stroke();

				if (drawnode.text == "")
				{

					this.canvascontext.fillText("Type Name", x - (drawwidth / 2), y + 3.0);

				}
				else
				{

					this.canvascontext.fillText(drawnode.text, x - (drawwidth / 2), y + 3.0);

				}


				if (nodeidx != 0)
				{

					// edges are thought of as with respect to root, so are drawn after
					var dstx = drawnode.x;
					var dsty = drawnode.y - drawnode.height;

					var srcx = rootnode.x;
					var srcy = rootnode.y + rootnode.height;

					// correct node placement function maybe

					this.drawedge("ADJACENT", srcx, srcy, dstx, dsty);

				}

			}


			if (this.selectednodeidx != -1)
			{

				if (this.selectednodeidx < this.nodes.length)
				{

					var currentlyselectednode = this.nodes[this.selectednodeidx];

					if (currentlyselectednode != undefined)
					{

						this.showselected(currentlyselectednode.x, currentlyselectednode.y, currentlyselectednode.width * 2, currentlyselectednode.height * 2);

					}

				}

			}

		}

	}


	leftclick(event)
	{

		var distanceindexpairs = []

		if (this.innotetakingmode)
		{

			return;

		}

		this.usertyped = "";

		// No nodes? Guess we should add one.
		if (this.nodes.length < 1)
		{

			// we get first node for free don't have to do a collision check for mouse over events
			// e.g for overlapping.

			var xpos = this.canvas.width / 2;
			var ypos = 50;

			var newnode = new VisualNode(xpos, ypos, 50, 20);
			newnode.setroot();

			this.nodes.push(newnode);

			// If we just added a node it should be selected.
			this.selectednodeidx = this.nodes.length - 1;

			// First node for free (graph)
			this.currentdepthroot.position(xpos, ypos);
			this.rootx = xpos;
			this.rooty = ypos;
		}
		else
		{
			// Check for if selected a node already placed.
			var nodewasselected = false;

			for (var nodeidx = 0; nodeidx < this.nodes.length; ++nodeidx)
			{

				var deltax = Math.abs(event.clientX - this.nodes[nodeidx].x);
				var deltay = Math.abs(event.clientY - this.nodes[nodeidx].y);

				// for re-selecting a node
				if (deltax < this.nodes[nodeidx].width * 2.5 && deltay < this.nodes[nodeidx].height * 2.5)
				{

					// this.selectednodeidx = nodeidx;

					nodewasselected = true;
					
					var xx = this.nodes[nodeidx].x;
					var yy = this.nodes[nodeidx].y;
					var distance = dist(xx, deltax, yy, deltay);
					
					console.log(distance);

					var distindexpair = [distance, nodeidx];

					distanceindexpairs.push(distindexpair);

				}

			}

			// None were seleceted.
			if (!(nodewasselected))
			{
				// set so that no selected
				if (this.selectednodeidx != -1)
				{
					
					this.ensurenamed();

					// replace last selected with -1 (prevent double click)
					this.selectednodeidx = -1;
					this.lastnodeselected = -1;


				}
				else
				{
					console.log("line 426");
					// Nothing was selected, user wants to add a new node.
					this.usertyped = "";
					var newnode = new VisualNode(event.clientX, event.clientY, 50, 20);
					this.nodes.push(newnode);
					this.selectednodeidx = this.nodes.length - 1;
					console.log(this.currentdepthroot.name);

					// check if any of the other nodes have not be named and name them
					for (var indx = 0; indx < this.currentdepthroot.atthisdepth.length; ++indx)
					{

						if (this.currentdepthroot.atthisdepth[indx].name == "")
						{

							this.currentdepthroot.atthisdepth[indx].name = "name conflict " + this.uselessid;
							this.uselessid++;

						}

					}

					this.currentdepthroot.addnode("", ADJACENT);
					this.currentdepthroot.getlastaddednode().position(event.clientX, event.clientY);

					this.drawall();

				}

			}
			// One was selected
			else
			{

				var distindexpairuse = distanceindexpairs.reduce(function(prev, curr)
				{

					return curr[0] < prev[0] ? curr : prev;

				}, [Infinity]);

				console.log(distanceindexpairs);
				this.selectednodeidx = distindexpairuse[1];
				
				
				// Check for name collisions here
				this.usertyped = this.nodes[this.selectednodeidx].text;

				// This node was already selected, it has been "double clicked"
				if (this.lastnodeselected != -1 && (this.lastnodeselected == this.selectednodeidx) && this.selectednodeidx != 0 && this.lastnodeselected != -1)
				{

					this.ensurenamed();

					var x = this.nodes[0].x;
					var y = this.nodes[0].y;

					this.nodes[this.selectednodeidx].x = x;
					this.nodes[this.selectednodeidx].y = y;

					this.nodes = [this.nodes[this.selectednodeidx]];

					this.selectednodeidx = 0;

					this.usertyped = "";
					
					console.log("Attempt to call godown with argument: " + this.nodes[this.selectednodeidx].text);
					this.currentdepthroot = this.currentdepthroot.godown(this.nodes[this.selectednodeidx].text);
					//console.log(this.currentdepthroot.atthisdepth);

					if (this.currentdepthroot == undefined)
					{

						console.log("this.currentdepthroot == undefined");

					}
					else
					{
						if (this.currentdepthroot.atthisdepth.length > this.nodes.length)
						{

							for (var missingidx = 1; missingidx < this.currentdepthroot.atthisdepth.length; ++missingidx)
							{

								var newvnode = new VisualNode(this.currentdepthroot.atthisdepth[missingidx].x, this.currentdepthroot.atthisdepth[missingidx].y, 50, 20);
								newvnode.text = this.currentdepthroot.atthisdepth[missingidx].name;
								this.nodes.push(newvnode);

							}

						}

					}

				}

				this.lastnodeselected = this.selectednodeidx;

			}

		}

		this.drawall();

	}

	stepbackup()
	{

		if (this.innotetakingmode)
		{

			return;

		}

		var backup = undefined;

		if (this.currentdepthroot != undefined)
		{

			backup = this.currentdepthroot.stepup();

		}
		else
		{

			console.log("this.currentdepthroot has somehow become undefined");

		}

		if (backup != undefined)
		{

			// We have to update the visual node for drawing

			this.nodes = [] // clear the playing field

			this.currentdepthroot = backup;

			for (var index = 0; index < this.currentdepthroot.atthisdepth.length; ++index)
			{
				if (index == 0)
				{

					var visualnode = new VisualNode(this.rootx, this.rooty, 50, 20);

				}
				else
				{
					var visualnode = new VisualNode(this.currentdepthroot.atthisdepth[index].x, this.currentdepthroot.atthisdepth[index].y, 50, 20);
				}


				visualnode.text = this.currentdepthroot.atthisdepth[index].name;
				this.nodes.push(visualnode);
			}

		}

		this.drawall();

	}

	rightclick(event)
	{

		if (this.owner.innotetakingmode)
		{

			return;

		}

		event.preventDefault();

		if (userinterface != undefined)
		{
			this.owner.ensurenamed();
			this.owner.stepbackup();

		}

	}

	// add notes to a node (press enter on a node)
	usernote()
	{
		// Remember that a node must be selected for us to reach here: it's fine.
		// hide canvas
		this.canvas.hidden = true;
		document.getElementById("parse").hidden = true;
		document.getElementById("submit").hidden = true;

		document.getElementById("currentnote").hidden = false;

		if (this.currentdepthroot.atthisdepth[this.selectednodeidx].notetext == undefined)
		{

			document.getElementById("currentnote").value = this.entertextprompt;	

		}
		else
		{

			document.getElementById("currentnote").value = this.currentdepthroot.atthisdepth[this.selectednodeidx].notetext;			

		}

		
		document.getElementById("currentnote").focus();

		this.innotetakingmode = true;

		this.lastnodeselected = this.selectednodeidx;
	}

	exitandsavenote(event)
	{

		if (userinterface.innotetakingmode)
		{

			if (userinterface.selectednodeidx == -1)
			{

				userinterface.selectednodeidx = userinterface.lastnodeselected;

			}

			if (event.key == "Escape")
			{

				userinterface.shiftheld = false; 

				console.log(userinterface.selectednodeidx, userinterface.currentdepthroot.atthisdepth.length);

				var gottext = document.getElementById("currentnote").value;

				if (gottext == userinterface.entertextprompt)
				{

					gottext = undefined;

				}

				userinterface.currentdepthroot.atthisdepth[userinterface.selectednodeidx].note(gottext);
				
				// un-hide canvas
				userinterface.canvas.hidden = false;
				document.getElementById("parse").hidden = false;
				document.getElementById("submit").hidden = false;
				document.getElementById("mathjaxdsp").hidden = true;
				document.getElementById("currentnote").hidden = true;

				userinterface.innotetakingmode = false;
				userinterface.shiftheld = false;

			}

			this.selectednodeidx = 0;

		}

		this.lastnodeselected = -1;

	}

	returntograph()
	{

		// un-hide canvas
		this.canvas.hidden = false;
		document.getElementById("parse").hidden = false;
		document.getElementById("submit").hidden = false;
		document.getElementById("mathjaxdsp").hidden = true;
		document.getElementById("currentnote").hidden = true;

		this.innotetakingmode = false;
		this.drawall();

		this.lastnodeselected = -1;

	}

}


function handleclick(event)
{
	if (userinterface != undefined)
	{

		if (event.button == 0)
		{

			userinterface.leftclick(event);

		}
		else if (event.button == 1)
		{

			console.log("here");

		}

	}

}


function usertyping(event)
{

	if (userinterface != undefined)
	{

		if (event.key != "Enter" && event.key != "Delete" && event.key != "Backspace")
		{

			userinterface.type(event);

			userinterface.drawall();

		}

	}

}



function commandkey(event)
{

	if (userinterface != undefined)
	{

		if (event.key === "Backspace" && (!(userinterface.innotetakingmode)))
		{

			if (userinterface.currentdepthroot.id != 0 && userinterface.selectednodeidx == 0)
			{

				return;

			}

			if (userinterface.usertyped.length >= 1)
			{

				userinterface.usertyped = userinterface.usertyped.slice(0, -1);

				// Check if this.usertyped is equal to a name used at current depth: causes cycle
				for (var idx = 0; idx < userinterface.currentdepthroot.atthisdepth.length; ++idx)
				{

					if (userinterface.currentdepthroot.atthisdepth[idx].name == userinterface.usertyped)
					{

						userinterface.usertyped += "(copy)" + this.currentdepthroot.atthisdepth[0].id;
						

					}

				}

				if (userinterface.selectednodeidx != -1)
				{

					userinterface.nodes[userinterface.selectednodeidx].settext(userinterface.usertyped);
					userinterface.currentdepthroot.atthisdepth[userinterface.selectednodeidx].name = userinterface.usertyped;

				}

				userinterface.drawall();


			}

			userinterface.drawall();

		}
		else if (event.key === "Escape")
		{

			console.log("escape");

			if (!(userinterface.innotetakingmode))
			{

				userinterface.selectednodeidx = -1;
				userinterface.drawall();

				userinterface.returntograph();

			}
			else 
			{

				

			}

		}
		else if (event.key === "Delete" && (!(userinterface.innotetakingmode)))
		{

			// E.G a node is selected
			if (userinterface.selectednodeidx != -1)
			{

				if (userinterface.selectednodeidx == 0 && (userinterface.currentdepthroot.atthisdepth.length <= 1) && userinterface.currentdepthroot.id == 0)
				{

					userinterface.nodes = [];
					userinterface.selectednodeidx = -1;
					userinterface.lastnodeselected = -1;
					userinterface.usertyped = "";

					userinterface.drawall();
				}
				else if (userinterface.selectednodeidx != 0)
				{
					userinterface.currentdepthroot.atthisdepth.splice(userinterface.selectednodeidx, 1);
					userinterface.nodes.splice(userinterface.selectednodeidx, 1);
					userinterface.selectednodeidx = -1;
					userinterface.lastnodeselected = -1;
					userinterface.usertyped = "";
					userinterface.drawall();

				}

			}

		}

		else if (event.key == "Enter")
		{

			if (userinterface.selectednodeidx != -1 && (!(userinterface.innotetakingmode)))
			{
				userinterface.ensurenamed();
				userinterface.usernote();

			}

		}

	}

}





function bindfromfile()
{
	let parser = document.getElementById("parse");

	parser.addEventListener("change", () => {

		idcount = 0;

		if (instantiatedinstance != undefined)
		{

			instantiatedinstance = undefined;

		}

		let filereader = new FileReader();
		filereader.readAsText(parser.files[0]);

		filereader.onload = function()
		{

			console.log("filereader.onload");
			var asarray = JSON.parse(filereader.result);

			// console.log(asarray);

			if (asarray.length < 1)
			{

				alert("You uploaded an empty file");

			} 
			else
			{


				instantiatedinstance = undefined;
				instantiatedinstance = new Graph("");

				buildfromdfs(asarray);

				userinterface.currentdepthroot = instantiatedinstance;
				userinterface.nodes = []

				userinterface.rootx = userinterface.currentdepthroot.atthisdepth[0].x;
				userinterface.rooty = userinterface.currentdepthroot.atthisdepth[0].y;

				for (var idx = 0; idx < userinterface.currentdepthroot.atthisdepth.length; ++idx)
				{

					var vnode = new VisualNode(userinterface.currentdepthroot.atthisdepth[idx].x, userinterface.currentdepthroot.atthisdepth[idx].y, 50, 20);
					vnode.text = userinterface.currentdepthroot.atthisdepth[idx].name;
					userinterface.nodes.push(vnode);

				}


				if (userinterface.nodes.length < 1)
				{

					console.log("nodes empty!");

				}

				userinterface.drawall();

			}

		}

	})

}




function init()
{


	userinterface = new UserInterface();

	userinterface.setcanvas();
	userinterface.setcanvasctx();
	userinterface.sizecanvas(window.innerWidth);

	bindfromfile();

	if (instantiatedinstance == undefined)
	{

		console.log("creating graph instance");
		instantiatedinstance = new Graph("");

		userinterface.currentdepthroot = instantiatedinstance;
		//console.log(userinterface.currentdepthroot)

	}

	userinterface.canvas.onclick = handleclick;
	//userinterface.canvas.addEventListener("contextmenu", userinterface.rightclick);
	userinterface.canvas.oncontextmenu = userinterface.rightclick;

	document.getElementById("currentnote").style.width = (window.innerWidth - 32) + 'px';

	window.onkeypress = usertyping;
	window.onkeydown = commandkey;

	window.onresize = function() {
		canvas.width = window.innerWidth;
		canvas.height = HEIGHT;

		userinterface.drawall();
	};

	window.onbeforeunload = function() {

		return "Your data will be lost if you refresh, would you like to continue?";

	};

	document.getElementById("currentnote").onkeydown = userinterface.exitandsavenote;

}



function writefile()
{

	if (instantiatedinstance != undefined)
	{

		instantiatedinstance.dump();

	}

}



window.onload = init;
