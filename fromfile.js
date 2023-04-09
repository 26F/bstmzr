
// for testing
var testingagainstarray = undefined;

function buildfromdfs(array)
{

	if (instantiatedinstance == undefined)
	{

		alert("graph not instantiated");
		return;
	}

	var current = instantiatedinstance;

	if (current.name == "")
	{

		current.name = array[0][0];
		current.position(array[0][5], array[0][6]);
		current.notetext = array[0][4];

	}

	let visited = new Set();

	var stack = [current];

	var bfinished = false;

	while (!(bfinished))
	{

		if (stack.length == 0)
		{

			bfinished = true;
			break;

		}

		var current = stack[stack.length - 1];

		visited.add(stack.pop().id);

		for (var index = 0; index < array[current.id][7].length; ++index)
		{


			var thisid = array[current.id][7][index];

			if (!(visited.has(thisid)))
			{

				current.addnode(array[thisid][0], array[thisid][3]);
				current.getlastaddednode().note(array[thisid][4]);
				current.getlastaddednode().setidfrombuilddfs(thisid);
				current.getlastaddednode().position(array[thisid][5], array[thisid][6])

				var nextdepth = current.godown(array[thisid][0]);

				if (nextdepth != undefined)
				{

					stack.push(nextdepth);

				}
			}

		}

	}

}

