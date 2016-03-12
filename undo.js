$(document).ready(function(){
	var undoStack = [];
	var redoStack = [];
	
	var colorPurple = "#cb3594";
	var colorGreen = "#659b41";
	var colorYellow = "#ffcf33";
	var colorBrown = "#986928";
	var curColor = colorPurple;
	

	var drag_duration = 0;
	var canvasDiv = document.getElementById("canvasDiv");
	canvas = document.createElement("canvas");
	canvas.setAttribute("width", 500);
	canvas.setAttribute("height", 500);
	canvas.setAttribute("id", "canvas");
	canvas.setAttribute("style", "border:1px solid #000000;");
	canvasDiv.appendChild(canvas);
	if(typeof G_vmlCanvasManager != 'undefined') {
		canvas = G_vmlCanvasManager.initElement(canvas);
	}
	context = canvas.getContext("2d");

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
	// record length of drag when mousdown
	
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
		console.log(drag_duration);
		undo_action = {drag_duration:drag_duration, color:curColor};
		undoStack.push(undo_action);
		drag_duration = 0;
		console.log("up")
	});

	$('#canvas').mouseleave(function(e){
  		if(paint == true){
  			undo_action = {drag_duration:drag_duration, color:curColor};
  			undoStack.push(undo_action);
  			console.log(drag_duration);
  		}
  		drag_duration = 0;
  		paint = false;
  		console.log("leave")
	});

	var clickX = new Array();
	var clickY = new Array();
	var clickDrag = new Array();
	var clickColor = new Array();
	var paint;

	// for redo
	var r_clickX = new Array();
	var r_clickY = new Array();
	var r_clickDrag = new Array();
	var r_clickColor = new Array();
	function addClick(x, y, dragging){

	  	clickX.push(x);
	  	clickY.push(y);
	  	clickDrag.push(dragging);
	  	clickColor.push(curColor);
	}

	function redraw(){
	  	context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
	  	
	  	// context.strokeStyle = "#df4b26";
	  	context.lineJoin = "round";
	  	context.lineWidth = 5;
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
	     context.strokeStyle = clickColor[i];
	     context.stroke();

	  }
	}


	$("#undo").click(function() {
		
		if (undoStack.length == 0){alert("no undo")}		
		last_click_event = undoStack[undoStack.length-1];
		var redo_element = undoStack.pop();
		
		if(typeof(redo_element) != "undefined" || undefined){
			redoStack.push(redo_element);
		}
		console.log(clickColor)
		// undo the line
		for (var i=0; i < last_click_event.drag_duration; i++){
		
			r_clickX.push(clickX.pop());
			r_clickY.push(clickY.pop());
			r_clickDrag.push(clickDrag.pop());
			r_clickColor.push(clickColor.pop());
		}


		redraw();		
		
	});

	$("#redo").click(function() {

		if (redoStack.length == 0){alert("no redo")}
		redo_event = redoStack[redoStack.length-1];
		var undo_element = redoStack.pop();

		if(typeof(undo_element) != "undefined" || undefined){
			undoStack.push(undo_element);
		}
		// redo the line
		for (var j=0; j < redo_event.drag_duration; j++){

			clickX.push(r_clickX.pop());
			clickY.push(r_clickY.pop());
			clickDrag.push(r_clickDrag.pop());
			clickColor.push(r_clickColor.pop());

		}
		redraw();

	});

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
	});



});
