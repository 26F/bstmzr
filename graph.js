
const ROOT = 0;
const TO = 1;
const FROM = 2;
const ADJACENT = 3;
const ISOLATED = 4; 

var idcount = 0;

var instantiatedinstance = undefined;

class Graph
{

	constructor(name)
	{

		this.name = name;
		this.atthisdepth = [this]

		this.masterroot = this;

		this.relation = ROOT;

		this.x = 0;
		this.y = 0;

		// before going down we set previous so we can step back up
		this.previous = undefined;

		// node we are curently viewing from
		this.current = this;

		// note text
		this.notetext = undefined;

		const setid = () => {
			this.id = idcount;
			idcount++;
		}

		setid();

		// id of parent for reconstruction from file.
		this.parentid = -1;

		const setinstance = () => {

			if (instantiatedinstance == undefined)
			{

				instantiatedinstance = this;

			}

		}

		setinstance();


	}

	position(x, y)
	{

		this.x = x;
		this.y = y;

	}

	setidfrombuilddfs(newid)
	{


		this.id = newid;
	}

	set_relation(edgetype)
	{

		this.relation = edgetype;

	}

	note(text)
	{

		this.notetext = text;

	}


	setparentid(idnum)
	{

		this.parentid = idnum;

	}


	addnode(name, relationtype=ROOT)
	{

		var node = new Graph(name);

		node.setparentid(this.id);

		node.relation = relationtype;

		this.atthisdepth.push(node);

	}


	getlastaddednode()
	{

		if (this.atthisdepth.length > 0)
		{

			return this.atthisdepth[this.atthisdepth.length - 1];

		}

	}


	view()
	{

		var nodes = []

		for (var index = 0; index < this.atthisdepth.length; ++index)
		{

			var name_t = this.atthisdepth[index].name;
			var relation_t = this.atthisdepth[index].relation

			if (index == 0)
			{

				relation_t = ROOT;

			}

			nodes.push([name_t, relation_t]);

		}

		return nodes;

	}

	// going down in abstraction (more concrete)
	godown(nameofnode)
	{

		for (var index = 0; index < this.atthisdepth.length; ++index)
		{

			let node = this.atthisdepth[index];

			if (node.name == nameofnode)
			{

				this.current = node;
				node.previous = this;
				return node;

			}

		}

		console.log("Here: " + nameofnode);

		return undefined;

	}


	// going up (more abstract)
	stepup()
	{

		if (this.previous != undefined)
		{

			this.current = this.previous;
			return this.previous;

		}

		return undefined;

	}


	// find node by name, returns undefined if not found
	depth_first_search(name, dumping=false)
	{

		var result = []

		if (this.name == name && dumping == false)
		{

			return this;

		}

		let visited = new Set();

		var stack = [this.masterroot];

		var bsearch_finished = false;

		while (!bsearch_finished)
		{

			if (stack.length == 0)
			{

				bsearch_finished = true;
				break;

			}

			var currentn = stack[stack.length - 1];

			if (dumping)
			{
				// relation is with respect to it's parent.
				//result.push([currentn.name, currentn.id, currentn.parentid, currentn.relation, currentn.notetext])
				var toadd = [currentn.name, currentn.id, currentn.parentid, currentn.relation, currentn.notetext, currentn.x, currentn.y];

			}

			var connected = []

			// console.log(currentn.name, currentn.id, currentn.parentid);

			if (currentn.name == name && dumping == false)
			{

				return currentn;

			}


			visited.add(stack.pop());
			

			for (var index = 1; index < currentn.atthisdepth.length; ++index)
			{

				var has = currentn.atthisdepth[index];

				if (!(visited.has(has)))
				{

					stack.push(has);
					connected.push(has.id);

				}

			}

			toadd.push(connected);
			result.push(toadd);

		}

		// searching for a specific item
		if (dumping == false)
		{

			return undefined;

		}
		else
		{

			result.sort((a, b) => a[1] - b[1]);
			return result;

		}

	}

	// node ids might get confused and it causes problems loading in data
	fixnodeids(array)
	{

		var refactor = {};
		
		var last = -1

		for (var idx = 0; idx < array.length; ++idx)
		{

			if (array[idx][1] != last + 1)
			{

				refactor[array[idx][1]] = last + 1;

			}
			last += 1;

		}

		last = -1;

		for (var idx = 0; idx < array.length; ++idx)
		{

			if (array[idx][1] != last + 1)
			{

				array[idx][1] = last + 1;

			}

			if (array[idx][2] != -1 && refactor[array[idx][2]] != undefined)
			{

				array[idx][2] = refactor[array[idx][2]];

			}

			for (var cidx = 0; cidx < array[idx][7].length; ++cidx)
			{

				if (refactor[array[idx][7][cidx]] != undefined)
				{

					array[idx][7][cidx] = refactor[array[idx][7][cidx]];

				}

			}

			last += 1;

		}

		return array;

	}

	dump()
	{
		if (instantiatedinstance != undefined)
		{	

			var dataarray = this.depth_first_search("", true);

			var fixapt = this.fixnodeids(dataarray);

			console.log(dataarray);
			console.log(fixapt);

			var filename = fixapt[0][0];
			var datastr = JSON.stringify(fixapt); 

			dumpfile(datastr, filename);

		} 

	}

}



