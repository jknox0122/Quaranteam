// This is the class object that controls what a page displays in handlebars.

module.exports.Renderer = class Renderer {
	constructor(res, counter, nextPage) {
		this.res = res;					// Display object for rending a page
		this.context = {};				// The handlebar parameters used to display a page
		this.iterations = counter;		// Set up the number of times we'll need to run queries until we can display the page
		this.nextPage = nextPage;		// Which page to display
		this.callBack = 0;				// Track the number of iterations consumed
	}

	// Add a handlebars parameter to display on the results page
	addContext(param, value) {
		this.context[param] = value;
		console.log("PARAM: " + param);
		console.log("VALUE: " + JSON.stringify(value));
	}

	displayPage(error) {

		this.callBack++;
		if (error) {
			this.res.write(JSON.stringify(error));
			this.res.end();
		}
		else {
			if (this.callBack >= this.iterations) {
				this.res.render(this.nextPage, this.context);
			}
		}
	}

};

