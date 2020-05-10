// ================================================================
// DOM elements - Editor panes
// ================================================================
const editor = $("#jedi-editor")[0]
const writer = $("#jedi-writer")[0]

// ================================================================
// DOM elements - Editor menu buttons
// ================================================================
const add_block_btn = $("#add-block-btn")[0]
const remove_block_btn = $("#remove-block-btn")[0]
const formatting_btns = $("#jedi-menu button:not(.dropdown-toggle)")

// ================================================================
// Miscellaneous variables
// ================================================================
// Variable to track current block
let last_block_focussed = -1

// Ignore add and remove block buttons
const formatting_btns_index = 2

// Categories of styles
const block_styles = ["h1", "h2", "h3", "h4", "h5", "h6", "lead", "code"]
const text_styles = ["bold", "italic", "underline", "strikethrough"]

// ================================================================
// DOM functions
// ================================================================

// Appends a block to the writer
const add_block = function (){
	// Clone template to create a new blank block
	let temp = document.querySelector("template")
	temp = temp.content.cloneNode(true)
	temp = temp.querySelector("div.block")

	// Default - No style
	temp.setAttribute("data-style", "")

	temp.children[0].innerText = $("div.block").length
	// Add to writer and re-render all blocks
	writer.append(temp)
	re_render_blocks()
	last_block_focussed = $("div.block").length - 1

	// Highlight newly focussed element
	highlight_focussed()
}

// Removes currently selected block from writer
const remove_block = function (){
	// Get current block
	current_block = $("div.block")[last_block_focussed]
	// Remove
	current_block.remove()
	// Re-render all blocks
	re_render_blocks()
	// Reset last focussed block
	last_block_focussed = $("div.block").length - 1
	// Highlight newly focussed element
	highlight_focussed()
}

// Applies the given style according to the category
const apply_style = function (format_style){
	if (last_block_focussed != -1){
		console.log(`Applying style : ${format_style}`)
		console.log(`To block : ${last_block_focussed}`)
		current_block = $("div.block")[last_block_focussed]
		current_block_style = current_block.getAttribute("data-style") 
		if (block_styles.indexOf(format_style) != -1){
			// If the style is to be applied to the whole block
			if(current_block_style == format_style){
				// If style is already applied remove the style
				current_block.setAttribute("data-style",  "")
			} else {
				// Else remove all formatting and apply the style
			    document.execCommand("removeFormat", false);
				current_block.setAttribute("data-style",  format_style)
			}
		} else if (text_styles.indexOf(format_style) != -1){
			// If the style is to be applied on text
			if (!(format_style == "bold" && current_block_style != "")){
			    document.execCommand(format_style, false);}
		} else if (format_style.indexOf("forecolor") != -1){
			// In case of text color, slice the hex value to get color code
			color = format_style.split("_")[1]
		    document.execCommand("forecolor", false, color);
		} else if (format_style.indexOf("backcolor") != -1){
			// In case of highlight, slice the hex value to get color code
			color = format_style.split("_")[1]
		    document.execCommand("backcolor", false, color);
		} else if (format_style == "ordered-list"){
			// Insert ordered list at current select or pointer
		    document.execCommand("insertOrderedList", false);
		} else if (format_style == "unordered-list"){
			// Insert unordered list at current select or pointer
		    document.execCommand("insertUnorderedList", false);
		}
		re_render_blocks()
	} else {
		console.log('No block selected!')
	}
}

// Re-renders all blocks in the writer pane while:
// - applying block level style according to individual attributes
// - refreshing all event listeners
const re_render_blocks = function(){
	// Get all blocks
	const blocks=document.querySelectorAll("div.block")
	// Loop over them
	for (var i = 0; i < blocks.length; i++) {
		// Set block index
		blocks[i].setAttribute("data-block-index", i)
		// Get block type
		block_type = blocks[i].getAttribute("data-style") 
		// Set block type as class of block's first(only) child
		blocks[i].children[0].classList = [block_type]

		// Event listeners to update last block focussed on click and tabs
		blocks[i].onclick = function(){
			// Clicking focusses on the block
			last_block_focussed = Number(this.getAttribute("data-block-index"))
			// Highlight newly focussed element
			highlight_focussed()
		}

		blocks[i].onkeyup = function(event){
			if (last_block_focussed != -1){
				new_block_index = Number(this.getAttribute("data-block-index"))

				if (event.shiftKey && event.keyCode == 9){
					// Pressing shift + tab focusses on previous block if any
					last_block_focussed = new_block_index
				} else if (event.keyCode == 9 && new_block_index){
					// Pressing tab focusses on next block if any
					last_block_focussed = new_block_index
				}
			}
			// Highlight newly focussed element
			highlight_focussed()
		}

		blocks[i].onpaste = function(e) {
		    // Cancel paste
		    e.preventDefault();
		    // Get text representation of clipboard
			const text = (e.originalEvent || e).clipboardData.getData('text/plain');
		    // Insert text manually
		    document.execCommand("insertHTML", false, text);
		}
	}
}

// Highlights last focussed block
const highlight_focussed = function(){
	// Remove class current from focussed element if any
	if (last_block_focussed != -1){
		prev_block = $("div.block.current")
		if (prev_block.length) {
			prev_block[0].classList.remove("current")}
		current_block = $("div.block")[last_block_focussed]
		current_block.classList.add("current")
	}
}

// ================================================================
// Bind functions to their respective buttons
// ================================================================

add_block_btn.onclick = add_block
remove_block_btn.onclick = remove_block

for (let i = formatting_btns_index; i < formatting_btns.length; i++) {
	formatting_btns[i].onclick = function(){
		apply_style(this.getAttribute("data-style") )
	}
}

// ================================================================
// Generic banner to debug if script is imported correctly
const __banner__ = "Jedi is a dynamic and embeddable rich text editor."
console.log(__banner__)