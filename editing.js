const
	fs = require('fs/promises'),
	parse5 = require('parse5'),
	querySelector = require('./query-selector')

class SourceLocation {
	constructor(file, start, end) {
		/** @type {String} */
		this.filepath = file
		/** @type {Number} */
		this.start = start
		/** @type {Number} */
		this.end = end
	}
}

class Partial {
	constructor(text, locs) {
		/** @type {String} */
		this.text = text
		/** @type {SourceLocation[]} */
		this.locations = locs
	}
}

module.exports = class Editing {
	constructor(selector, filepaths) {
		/** @type {String} */
		this.selector = selector
		/** @type {String[]} */
		this.filepaths = filepaths
	}

	begin() {
		/** @type {Partial[]} */
		const foundPartials = []

		const fileProcessPromises = this.filepaths.map(async filepath => {
			const fileContents = await fs.readFile(filepath, 'utf-8')
			const ast = parse5.parse(fileContents)
			const partialLoc = this.findPartial(ast)
			if (!partialLoc) return
			
			const partialContents = trimIndent(fileContents.substring(partialLoc.start, partialLoc.end))
			const alreadyFoundPartial = foundPartials.find(foundPartial => foundPartial.text = partialContents)

			if (alreadyFoundPartial) {
				alreadyFoundPartial.locations.push(partialLoc)
			} else {
				foundPartials.push(new Partial(text, [partialLoc]))
			}
		})

		await Promise.all(fileProcessPromises)

		const partialCompareByFileCountDescending = (a, b) => a.locations.length - b.locations.length
		foundPartials.sort(partialCompareByFileCountDescending).forEach((partial, idx) => {
			const tempFileName = `HED___${slugify(this.selector)}___${idx}.html`
			const tempFileHandle = await fs.open(tempFileName, 'a')
			await tempFileHandle.appendFile(this.makeHeaderComment(partial));
			await tempFileHandle.appendFile(partial.text);
			await tempFileHandle.close()
		})
	}

	makeHeaderComment(partial) {
		return `
<!----- __ _________ ----------------------- - -  -   -
 !---- / // / __/ _ \ -- H -- T -- M -- L -- - -  -   -
 !--- / _  / _// // / ---------------------- - -  -   -
 !-- /_//_/___/____/ --- E  d  i  t  o  r -- - -  -   -
 !--++====================================== = =  =   =
 !--|| Partial: ${this.selector}
 !--|| in files: ${partial.locations.flatMap(p=>p.locations).map(loc.filepath).join('\n !--||  ')}
 !--|| See \`hed --help\` for more details.
 !--++====================================== = =  =   =
 !------------------------------------------ - -  -   -
 !-->
 
 `
	}

	/**
	 * 
	 * @param {parse5.Document} ast 
	 * @param {String} filepath 
	 */
	findPartial(ast, filepath) {
		const el = querySelector(this.selector, ast)
		return new SourceLocation(filepath, start, end)
	}

	end() {
		throw 'TODO:'
	}
}