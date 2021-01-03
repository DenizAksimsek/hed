const
	argparser = require('argparser')
	Editing = require('./editing')

const args = argparser
	.vals('selector')
	.nonvals('begin')
	.nonvals('end')
	.parse()

const editing = new Editing(args.opt('selector'), args.arg())

if (args.opt('begin')) {
	const tempFilePaths = editing.begin()
	console.log(`Edit ${tempFilePaths} then run \`hed --end\` to apply your changes.`)
} else if (args.opt('end')) {
	editing.end()
	console.log(`Edits saved.`)
}