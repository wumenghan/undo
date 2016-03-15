$(document).ready(function(){
	var undoStack = [];
	var redoStack = [];
	var actionStack = [];
	var command;
	var colorPurple = "#cb3594";
	var colorGreen = "#659b41";
	var colorYellow = "#ffcf33";
	var colorBrown = "#986928";
	var curColor = colorPurple;
	var curSize = "normal";
	var curTool = "crayon";
	var canvasHeigth = 500;
	var canvasWidth = 500;
	var drag_duration = 0;
	
	// initialize canvas object in html.
	var canvasDiv = document.getElementById("canvasDiv");
	canvas = document.createElement("canvas");
	canvas.setAttribute("width", canvasHeigth);
	canvas.setAttribute("height", canvasWidth);
	canvas.setAttribute("id", "canvas");
	canvas.setAttribute("style", "border:1px solid #000000;");
	canvasDiv.appendChild(canvas);
	
	stackUpdate = function(e){
		// push new action to stack
		var html = "";
		for(var i=0; i<actionStack.length; i++){
			html = html + actionStack[i] + "<br>"
		}
		$("#stack").html(html);
		// scoll to the lastest action if overflow
		var stack = document.getElementById("stack");
		if (stack.scrollHeight > canvasHeigth){
			stack.scrollTop = stack.scrollHeight;
		}
	}

	if(typeof G_vmlCanvasManager != 'undefined') {
		canvas = G_vmlCanvasManager.initElement(canvas);
	}
	context = canvas.getContext("2d");

	// 4 events on canvas, mousedown, mousemove, mouseup, mouseleave.
	$('#canvas').mousedown(function(e){
  		var mouseX = e.pageX - this.offsetLeft;
  		var mouseY = e.pageY - this.offsetTop;
		
  		paint = true;
  		addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
 		redraw();
 		drag_duration = drag_duration + 1
 		//reset redo stack one new insert event trigger
 		redoStack = [];
 		console.log("down")
	});
	
	
	$('#canvas').mousemove(function(e){
  		if(paint){
    		addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
    		redraw();
    		drag_duration = drag_duration + 1
    		console.log("move")
  		}
	});

	$('#canvas').mouseup(function(e){
		paint = false;
		undo_action = {drag_duration:drag_duration, color:curColor};
		undoStack.push(undo_action);
		drag_duration = 0;
		console.log("up")
		if (curTool != "eraser"){
			command = "Use " + rgb_to_color(curColor) +" "+ curTool + " in size " + curSize + " to draw";
		}
		else{
			command = "Erase";
		}
		// action_dict = {curColor:curColor, curSize:curSize, curTool:curTool}
		actionStack.push(command);
		stackUpdate();
	});

	$('#canvas').mouseleave(function(e){
  		if(paint == true){
  			undo_action = {drag_duration:drag_duration, color:curColor};
  			undoStack.push(undo_action);
  			// action_dict = {curColor:curColor, curSize:curSize, curTool:curTool}
  			if (curTool != "eraser"){
				command = "Use " + rgb_to_color(curColor) +" "+ curTool + " in size " + curSize + " to draw";
			}
			else{
				command = "Erase";
			}
			actionStack.push(command);
			stackUpdate();
  			console.log(drag_duration);
  		}
  		drag_duration = 0;
  		paint = false;
  		console.log("leave")
	});
	// Array or undo
	var clickX = new Array();
	var clickY = new Array();
	var clickDrag = new Array();
	var clickColor = new Array();
	var clickSize = new Array();
	var clickTool = new Array();
	var paint;

	// Array for redo
	var r_clickX = new Array();
	var r_clickY = new Array();
	var r_clickDrag = new Array();
	var r_clickColor = new Array();
	var r_clickSize = new Array();
	var r_clickTool = new Array();

	function addClick(x, y, dragging){

	  	clickX.push(x);
	  	clickY.push(y);
	  	clickDrag.push(dragging);
	  	if(curTool == "eraser"){
	  		clickColor.push("white");
	  	}
	  	else{
	  		clickColor.push(curColor);
	  	}
	  	clickSize.push(curSize);
	  	clickTool.push(curTool);


	}


	function redraw(){

	  	context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
	  	context.lineJoin = "round";
	  	for(var i=0; i < clickX.length; i++) {		
	    	context.beginPath();
	    if(clickDrag[i] && i){
	     	 context.moveTo(clickX[i-1], clickY[i-1]);
	     }
	     else{
	     	  context.moveTo(clickX[i]-1, clickY[i]);
	     }
	     context.lineTo(clickX[i], clickY[i]);
	     context.closePath();
	     // context.strokeStyle = clickColor[i];
	  	 if(clickTool[i] == "eraser"){
	  	 	context.strokeStyle = "white";
	  	 }
	  	 else{
	  	 	context.strokeStyle = clickColor[i];	
	  	 }
	  	 
	  	 context.lineWidth = size_to_radius(clickSize[i]);
	     context.stroke();
	  }
	  // different tool
	  if (curTool == "crayon"){
	  	 	context.globalAlpha = 0.4;
	  }
	  else{
	  		context.globalAlpha = 1;
		}

	}
	// translate size to radius
	function size_to_radius(size){
		switch (size) {
				case "small":
					return 2;
					break;
				case "normal":
					return 5;
					break;
				case "large":
					return 10;
					break;
				case "huge":
					return 20;
					break;
				default:
					break;
				}
	}
	// translate rgb to color
	function rgb_to_color(rgb) {
		switch(rgb) {
			case "#cb3594":
				return "Purple";
				break;
			case "#659b41":
				return "Green";
				break;
			case "#ffcf33":
				return "Yellow";
				break;
			case "#986928":
				return "Brown";
				break;
		}

	}
	// button undo
	// pop object in undo stack and push to redo stack
	$("#undo").click(function() {
		
		last_click_event = undoStack[undoStack.length-1];
		var redo_element = undoStack.pop();
		
		if(typeof(redo_element) != "undefined" || undefined){
			redoStack.push(redo_element);
		}
		console.log(clickColor)
		if (undoStack.length == 0){alert("no undo")}	
		else{
		// undo the line
			for (var i=0; i < last_click_event.drag_duration; i++){
			
				r_clickX.push(clickX.pop());
				r_clickY.push(clickY.pop());
				r_clickDrag.push(clickDrag.pop());
				r_clickColor.push(clickColor.pop());
				r_clickSize.push(clickSize.pop());
				r_clickTool.push(clickTool.pop());
			}
		}
		command = "undo";
		actionStack.push(command);
		stackUpdate();
		redraw();		
		
	});
	// button redo
	// pop object in redo stack and push to undo stack
	$("#redo").click(function() {
		
		redo_event = redoStack[redoStack.length-1];
		var undo_element = redoStack.pop();

		if(typeof(undo_element) != "undefined" || undefined){
			undoStack.push(undo_element);
		}
		if (redoStack.length == 0){alert("no redo")}
		else{
		// redo the line
			for (var j=0; j < redo_event.drag_duration; j++){

				clickX.push(r_clickX.pop());
				clickY.push(r_clickY.pop());
				clickDrag.push(r_clickDrag.pop());
				clickColor.push(r_clickColor.pop());
				clickSize.push(r_clickSize.pop());
				clickTool.push(r_clickTool.pop());

			}
		}
		command = "redo";
		actionStack.push(command);
		stackUpdate();
		redraw();

	});

	// button color
	$(".color").click(function(e) {
		var color = $(this).val();
		if(color == "Green"){
			curColor = colorGreen;
		}
		else if (color == "Brown"){
			curColor = colorBrown;
		}
		else if (color == "Yellow"){
			curColor = colorYellow;
		}
		else if (color == "Purple"){
			curColor = colorPurple;
		}
		$("#s_color").val(color);
		command = "Select color " + color;
		actionStack.push(command);
		stackUpdate();
	});

	// button size
	$(".size").click(function(e) {
		var	size = $(this).val();
		curSize = size;
		$("#s_size").val(size);
		command = "Select size " + size;
		actionStack.push(command);
		stackUpdate();
	});
		
	// button tool
	$(".tool").click(function() {
		var tool = $(this).val();
		curTool = tool;
		$("#s_tool").val(tool);
		command = "Select tool " + tool;
		actionStack.push(command);
		stackUpdate();
	});

	// initialize selected color, size, tool
	var initialize_id = {"s_color":rgb_to_color(curColor), "s_size":curSize, "s_tool":curTool};
	$.each(initialize_id, function(key, value){
		$("#"+key).val(value);
	});

});
