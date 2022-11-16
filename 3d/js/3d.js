;(function($, window, document, undefined) {
	var CanvasDrag = function(ele, opt) {
		    this.$ele = ele,
			this.defaults = {
				parent: '#dragBox',
				dragMove: function(x, y) {}
			},
			this.options = $.extend({}, this.defaults, opt)
	}


	CanvasDrag.prototype.getPixelRatio = function(context,devicePixelRatio) {
		var backingStore = context.backingStorePixelRatio ||
			context.webkitBackingStorePixelRatio ||
			context.mozBackingStorePixelRatio ||
			context.msBackingStorePixelRatio ||
			context.oBackingStorePixelRatio ||
			context.backingStorePixelRatio || 1;
		return (devicePixelRatio|| 1) / backingStore;
	}
	
	function insertHtml(defaultImg){
		var boxHtml='<div id="dragBox">'
			+'<canvas id="fullview_canvas" style="width:558px;height:558px;">'
			+'</canvas>'
			+'<div id="resizable" class="ui-widget-content">'
				+'<i class="hander"></i>'
				+'<img src="'+defaultImg+'" id="dragImg">'
			+'</div>'
		+'</div>'
		+'<div class="tools">'
			+'<div class="tools-btn ml-80" id="draw-big">'
				+'<span class="iconfont icon-fangda"></span>'
				+'<p>ZOOM</p>'
			+'</div>'
			+'<div class="tools-btn" id="draw-top">'
				+'<span class="iconfont icon-view"></span>'
				+'<p>TOP VIEW</p>'
			+'</div>'
			+'<div class="tools-btn" id="draw-size">'
				+'<span class="iconfont icon-iconfont_chizi" style="color:#000;font-size:40px;margin-top:-6px;margin-bottom:3px"></span>'
				+'<p>DEMISONS</p>'
			+'</div>'
		+'</div>'
		$("#canvas-container").append(boxHtml)
	}
	
	CanvasDrag.prototype.run = function() {
		var $this = this;
		var canvas_element = this.$ele;
		//var canvas=canvas_element[0];
		var canvas=$("#"+this.options.id)[0];
		var canvasOptions=this.options;
		let pixelRatio = this.getPixelRatio(canvas_element,canvasOptions.devicePixelRatio);
		//console.log(pixelRatio)
		// 设置canvas的真实宽高
		canvas.width = pixelRatio * canvasOptions.initWidth;
		canvas.height = pixelRatio * canvasOptions.initHeight;
		
		canvasOptions.width=canvas.width
		canvasOptions.height=canvas.height
		
		for (var i = 0; i < canvasOptions.imageArray.length; i++) {
			canvasOptions.images[i] = new Image();
			canvasOptions.images[i].src = canvasOptions.imageArray[i]
		}
		
		ctx = canvas.getContext("2d");
		
		// mouse event
		canvas.addEventListener("mousedown", doMouseDown, false);
		canvas.addEventListener('mousemove', doMouseMove, false);
		canvas.addEventListener('mouseup', doMouseUp, false);
		canvas.addEventListener('mouseleave', doMouseUp, false);
		
		//frame = 1
		canvasOptions.images[canvasOptions.frame].onload = function() {
			redraw();
		}
		
		
		function doMouseDown(event) {
			var x = event.pageX;
			var y = event.pageY;
			let canvas1 = event.target;
			var loc = getPointOnCanvas(canvas1, x, y);
			//console.log("mouse down at point( x:" + loc.x + ", y:" + loc.y + ")");
			startedX = loc.x;
			canvasOptions.started = true;
		}
		
		var timesPerSecond = 60; // how many times to fire the event per second
		var wait = false;
		
		function doMouseMove(event) {
			if (!wait) {
				var x = event.pageX;
				var y = event.pageY;
				var canvas = event.target;
				var loc = getPointOnCanvas(canvas, x, y);
				if (canvasOptions.started && !canvasOptions.topShow) {
					var count = Math.floor(Math.abs((startedX - loc.x) / 100));
					var frameIndex = Math.floor((startedX - loc.x) / 30);
					while (count > 0 && count <= 1) {
						//console.log("frameIndex = " + frameIndex);
						count--;
						if (frameIndex > 0) {
							frameIndex--;
							canvasOptions.frame--;
						} else if (frameIndex < 0) {
							frameIndex++;
							canvasOptions.frame++;
						} else if (frameIndex == 0) {
							break;
						}
		
						if (canvasOptions.frame > 15) {
							canvasOptions.frame = 0;
						}
						if (canvasOptions.frame < 0) {
							canvasOptions.frame = 15;
						}
						redraw();
					}
				}
				// stop any further events
				wait = true;
				// after a fraction of a second, allow events again
				setTimeout(function() {
					wait = false;
				}, 1000 / timesPerSecond);
			}
		}
		
		function doMouseUp(event) {
			if (event.stopPropagation) event.stopPropagation();
			if (event.preventDefault) event.preventDefault();
			canvasOptions.started = false
			if (canvasOptions.started) {
				//doMouseMove(event);
				startedX = -1;
				canvasOptions.started = false;
			}
		}
		
		function getPointOnCanvas(canvas, x, y) {
			var bbox = canvas.getBoundingClientRect();
			return {
				x: x - bbox.left * (canvas.width / bbox.width),
				y: y - bbox.top * (canvas.height / bbox.height)
			};
		}
		
		$("#draw-top").click(function(){
			drawTop()
		})
		
		$("#draw-size").click(function(){
			drawSize()
		})
		
		$("#draw-big").click(function(){
			drawBig()
		})
		
		function redraw() {
			// var imageObj = document.createElement("img");
			// var imageObj = new Image();
			if (canvasOptions.sizeShow) {
				sizeShow = false
				$(".tools .tools-btn").eq(2).removeClass("active");
			}
			let imageObj = canvasOptions.images[canvasOptions.frame];
			ctx.clearRect(0, 0, canvasOptions.width, canvasOptions.height)
			ctx.beginPath()
			ctx.drawImage(imageObj, 0, 0, canvasOptions.width, canvasOptions.height);
		}
		
		
		function drawTop() {
			if (canvasOptions.topShow) {
				canvasOptions.topShow = false
			} else {
				canvasOptions.topShow = true
			}
			drawTool()
		}
		
		function drawBig() {
			if (canvasOptions.bigShow) {
				canvasOptions.bigShow = false
				canvas.style.display = "block";
			} else {
				canvasOptions.bigShow = true
			}
			drawTool()
		}
		
		function drawSize() {
			if (canvasOptions.sizeShow) {
				canvasOptions.sizeShow = false
			} else {
				canvasOptions.sizeShow = true
			}
			drawTool()
		}
		
		function commonDeal() {
			let imgHalfWidth = $("#dragImg").width() / 2;
			let boxHalfWidth = $("#dragBox").width() / 2;
			let imgHalfHeight = $("#dragImg").height() / 2;
			let boxHalfHeight = $("#dragBox").height() / 2;
			$("#resizable").css("left", -(imgHalfWidth - boxHalfWidth) + 'px');
			$("#resizable").css("top", -(imgHalfHeight - boxHalfHeight) + 'px');
			canvas.style.display = "none";
		}
		
		function drawTool() {
			//1.bigShow=true 放大展示
			if (canvasOptions.bigShow && !canvasOptions.topShow && !canvasOptions.sizeShow) {
				$("#resizable").show();
				$("#dragImg").attr("src", canvasOptions.bigImgArray[0])
				commonDeal()
			}
		
			if (!canvasOptions.bigShow && !canvasOptions.topShow && !canvasOptions.sizeShow) {
				$("#dragImg").attr("src", "");
				$("#resizable").hide();
				redraw()
			}
		
			//2.topShow=true 顶部展示
			if (!canvasOptions.bigShow && canvasOptions.topShow && !canvasOptions.sizeShow) {
				$("#resizable").hide();
				let imageObj = new Image();
				//imageObj.src = "img/shoptop.png";
				imageObj.src = canvasOptions.topImgArray[0];
				imageObj.onload = function() {
					ctx.clearRect(0, 0, canvasOptions.width, canvasOptions.height)
					ctx.save();
					ctx.beginPath()
					ctx.drawImage(imageObj, 0, 0, canvasOptions.width, canvasOptions.height);
					ctx.restore();
				}
			}
		
			//3.sizeShow=true 尺寸展示
			if (!canvasOptions.bigShow && !canvasOptions.topShow && canvasOptions.sizeShow) {
				$("#dragImg").attr("src", "");
				$("#resizable").hide();
				canvas.style.display = "block";
				let imageObj = new Image();
				imageObj.src = canvasOptions.bigImgArray[4]
				imageObj.onload = function() {
					ctx.clearRect(0, 0, canvasOptions.width, canvasOptions.height)
					ctx.beginPath()
					ctx.drawImage(imageObj, 0, 0, canvasOptions.width, canvasOptions.height);
			 }
			}
		
			if (canvasOptions.bigShow && canvasOptions.topShow && !canvasOptions.sizeShow) {
				$("#resizable").show();
				$("#dragImg").attr("src", canvasOptions.bigImgArray[1])
				commonDeal()
			}
		
		
			if (canvasOptions.bigShow && canvasOptions.topShow && canvasOptions.sizeShow) {
				$("#resizable").show();
				$("#dragImg").attr("src", canvasOptions.bigImgArray[3])
				commonDeal()
			}
		
		
			if (canvasOptions.bigShow && !canvasOptions.topShow && canvasOptions.sizeShow) {
				$("#resizable").show();
				$("#dragImg").attr("src", canvasOptions.bigImgArray[2])
				commonDeal()
			}
		
		
			if (!canvasOptions.bigShow && canvasOptions.topShow && canvasOptions.sizeShow) {
				$("#dragImg").attr("src", "");
				$("#resizable").hide();
				canvas.style.display = "block";
				let imageObj = new Image();
				//imageObj.src = "img/shoptopSize.png";
				imageObj.src = canvasOptions.topImgArray[1];
				imageObj.onload = function() {
					ctx.clearRect(0, 0, canvasOptions.width, canvasOptions.height)
					ctx.beginPath()
					ctx.drawImage(imageObj, 0, 0, canvasOptions.width, canvasOptions.height)
				}
			}
		  }
	}
	
	//插件
	$.fn.canvasDrag = function(options) {
	    //创建实体
	    var canvasDrag= new CanvasDrag(this, options);
		var startedX = -1;
		insertHtml(options.defaultImg)
		//jqueryUi的初始化操作
		$("#dragImg").attr("src",options.defaultImg);
		$('#dragBox div').each(function() {
			$(this).dragging({
				move: 'both',
				randomPosition: true,
				hander: '.hander'
			});
		});
		
		$(".tools .tools-btn").click(function() {
			if ($(this).hasClass("active")) {
				$(this).removeClass("active")
			} else {
				//$(".tools .tools-btn").eq($(this).index()).addClass("active").siblings().removeClass("active")
				$(this).addClass("active")
			}
		});
		
		$("#resizable").hide()
	    canvasDrag.run();
	    //调用方法
		return this;
	}
})(jQuery);
