// ================================================================
// DOM elements - Editor panes
// ================================================================
const editor = $("#jedi-editor")[0]
const text = $("#jedi-text")[0]
const preview = $("#jedi-preview")[0]

// ================================================================
// DOM elements - Editor menu buttons
// ================================================================
const bold_btn = $("#bold-btn")[0]
const italic_btn = $("#italic-btn")[0]
const underline_btn = $("#underline-btn")[0]
const code_btn = $("#code-btn")[0]
const heading_btns = $(".heading-btn")
const hr_btn = $("#hr-btn")[0]
const br_btn = $("#br-btn")[0]
const lead_btn = $("#lead-btn")[0]

// ================================================================
// DOM events - Menu button functions
// ================================================================
const bold_fn = function(){ tagger("<strong>", "</strong>") }
const italic_fn = function(){ tagger("<em>", "</em>") }
const underline_fn = function(){ tagger("<u>", "</u>") }

const code_fn = function(){ tagger(
	"<div class='m-3 p-3 bg-dark'><p class='text-light'>",
	"</p></div>") }

const heading_fn = function(event){
	console.log(event)
	tagger(`<${event.target.innerText}>`, `</${event.target.innerText}>`) }

const hr_fn = function(){ tagger("<hr>") }
const br_fn = function(){ tagger("<br>") }
const lead_fn = function(){ tagger("<p class='lead'>", "</p>") }

// ================================================================
// DOM events - Binding functions to events
// ================================================================
bold_btn.onclick = bold_fn
italic_btn.onclick = italic_fn
underline_btn.onclick = underline_fn
code_btn.onclick = code_fn

for (var i = 0; i < heading_btns.length; i++) {
	heading_btns[i].onclick = heading_fn
}

hr_btn.onclick = hr_fn
br_btn.onclick = br_fn
lead_btn.onclick = lead_fn

// ================================================================
// Handle tabspace in textarea
// ================================================================
text.onkeydown =  function(event){
	// key is pressed while focus is on the editor textarea
	if (event.keyCode == 9) {
		// tab key
		start = text.selectionStart
		text.value = text.value.slice(0, start) + "&emsp;" +
					text.value.slice(start, text.value.length)
		text.selectionStart = start + 4
		text.selectionEnd = start + 4
		text.focus()

	}
	if (event.keyCode == 13) {
		start = text.selectionStart
		text.value = text.value.slice(0, start) + "<br>" +
					text.value.slice(start, text.value.length)
	}
}

// ================================================================
// Render HTML preview of textarea content
// ================================================================
const generate_preview = function(){
	// console.log(text.value)
	if (text.value.length) {
		preview.classList.remove("d-flex")
		preview.innerHTML = text.value
	} else {
		preview.classList.add("d-flex")
		preview.innerHTML = '<p class="lead m-auto d-block text-muted">\
							live preview</p>'
	}
}

// ================================================================
// Add tag at cursor/around the selection
// ================================================================
const tagger = (tag_start = "", tag_end = "")=>{
	const sel_start = text.selectionStart
	const sel_end = text.selectionEnd
	console.log("tagger")
	if (tag_end != "" && tag_start!= ""){
		if (sel_start != sel_end) {
			start = text.value.slice(0, sel_start)
			mid = text.value.slice(sel_start, sel_end)
			end = text.value.slice(sel_end, text.value.length)

			// console.log(sel_start, sel_end, text.value)
			if(mid.indexOf(tag_start) != -1 && mid.indexOf(tag_end) != -1){
				mid = tag_start +
					mid.split(tag_start).join("").split(tag_end).join("") +
					tag_end
			}else if(mid.indexOf(tag_start) != -1){
				mid = tag_start + mid.split(tag_start).join("")
			}else if(mid.indexOf(tag_end) != -1){
				mid = mid.split(tag_end).join("") + tag_end
			}else{
				mid = tag_start + mid + tag_end
			}
			text.value = start + mid + end
			console.log(text.value)
			// return text.value
		}
	} else if (tag_start!= "") {
		start = text.value.slice(0, sel_start)
		end = text.value.slice(sel_start, text.value.length)
		text.value = start + tag_start + end
	}
	text.focus()
}

// ================================================================
// Bind multiple events for live rendering based on interactions
// ================================================================
text.onchange = generate_preview
text.keydown = generate_preview
text.focus = generate_preview
text.oninput = generate_preview

// ================================================================
// Run initially when DOM is loaded
// ================================================================
generate_preview()

// Generic banner to debug if script is imported correctly
const __banner__ = "Jedi is a dynamic and embeddable rich text editor."
console.log(__banner__)
