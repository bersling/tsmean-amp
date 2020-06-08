const text = `Element Description <button> The HTML <button> element represents a clickable button, used to submit forms or anywhere in a document for accessible, standard button functionality. <datalist> The HTML <datalist> element contains a set of <option> elements that represent the permissible or recommended options available to choose from within other controls. <fieldset> The HTML <fieldset> element is used to group several controls as well as labels (<label>) within a web form. <form> The HTML <form> element represents a document section containing interactive controls for submitting information. <input> The HTML <input> element is used to create interactive controls for web-based forms in order to accept data from the user; a wide variety of types of input data and control widgets are available, depending on the device and user agent. <label> The HTML <label> element represents a caption for an item in a user interface. <legend> The HTML <legend> element represents a caption for the content of its parent <fieldset>. <meter> The HTML <meter> element represents either a scalar value within a known range or a fractional value. <optgroup> The HTML <optgroup> element creates a grouping of options within a <select> element. <option> The HTML <option> element is used to define an item contained in a <select>, an <optgroup>, or a <datalist> element. As such, <option> can represent menu items in popups and other lists of items in an HTML document. <output> The HTML Output element (<output>) is a container element into which a site or app can inject the results of a calculation or the outcome of a user action. <progress> The HTML <progress> element displays an indicator showing the completion progress of a task, typically displayed as a progress bar. <select> The HTML <select> element represents a control that provides a menu of options <textarea> The HTML <textarea> element represents a multi-line plain-text editing control, useful when you want to allow users to enter a sizeable amount of free-form text, for example a comment on a review or feedback form.`


const pattern = /<(.*?)>/g;

const matches = [];

let i = 0;
while ( (match = pattern.exec(text)) != null && i < 100) {
  matches.push(match[1]);
  i++;
}

console.log(Array.from(new Set(matches)).forEach(entry => console.log(`<${entry} formControlName="myFormControl"></${entry}>\n`)));

