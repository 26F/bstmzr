
// We will do a dfs
function dumpfile(filedatastr, filename)
{

	const link = document.createElement("a");
	const file = new Blob([filedatastr], {type: 'text/plain'});

	link.href = URL.createObjectURL(file);
	link.download = filename + ".graph";

	link.click();
	URL.revokeObjectURL(link.href);

}