
$.fn.extend({
		//---元素拖动插件
    dragging:function(data){   
		var $this = $(this);
		var xPage;
		var yPage;
		var X;//
		var Y;//
		var xRand = 0;//
		var yRand = 0;//
		var father = $this.parent();
		var defaults = {
			move : 'both',
			randomPosition : true ,
			hander:1
		}
		var opt = $.extend({},defaults,data);
		var movePosition = opt.move;
		var random = opt.randomPosition;
		
		var hander = opt.hander;
		
		if(hander == 1){
			hander = $this; 
		}else{
			hander = $this.find(opt.hander);
		}
		
			
		//---初始化
		father.css({"position":"relative","overflow":"hidden"});
		$this.css({"position":"absolute"});
		hander.css({"cursor":"pointer"});//move

		var faWidth = father.width();
		var faHeight = father.height();
		var thisWidth = $this.width()+parseInt($this.css('padding-left'))+parseInt($this.css('padding-right'));
		var thisHeight = $this.height()+parseInt($this.css('padding-top'))+parseInt($this.css('padding-bottom'));
		
		var mDown = false;//
		var positionX;
		var positionY;
		var moveX ;
		var moveY ;
		
		if(random){
			$thisRandom();
		}
		function $thisRandom(){ //随机函数
			$this.each(function(index){
				var randY = parseInt(Math.random()*(faHeight-thisHeight));///
				var randX = parseInt(Math.random()*(faWidth-thisWidth));///
				if(movePosition.toLowerCase() == 'x'){
					$(this).css({
						left:randX
					});
				}else if(movePosition.toLowerCase() == 'y'){
					$(this).css({
						top:randY	
					});
				}else if(movePosition.toLowerCase() == 'both'){
					$(this).css({
						top:randY,
						left:randX
					});
				}
				
			});	
		}
		
		hander.mousedown(function(e){
			father.children().css({"zIndex":"0"});
			$this.css({"zIndex":"1"});
			mDown = true;
			X = e.pageX;
			Y = e.pageY;
			positionX = $this.position().left;
			positionY = $this.position().top;
			return false;
		});
			
		$(document).mouseup(function(e){
			mDown = false;
		});
			
		$(document).mousemove(function(e){
			xPage = e.pageX;//--
			
			//针对X轴
			moveX = positionX+xPage-X;
			let maxLeftMoveWidth=thisWidth-100
			let offsetWidth=(thisWidth-faWidth)/2
			
			let maxRightMoveWidth=thisWidth/2+offsetWidth
			
			if(moveX>0 && moveX>=maxRightMoveWidth){
				moveX=offsetWidth
			}
			
			if(moveX<0 && Math.abs(moveX)>maxLeftMoveWidth){
				moveX=-maxLeftMoveWidth
			}
			
			
			yPage = e.pageY;//--
			moveY = positionY+yPage-Y;
			
			let maxTopMoveHeight=thisHeight-100
			let offsetHeight=(thisHeight-faHeight)/2
			
			let maxBottomMoveWidth=thisHeight/2+offsetHeight
			
			if(moveY>0 && moveY>=maxBottomMoveWidth){
				moveY=offsetHeight
			}
			
			if(moveY<0 && Math.abs(moveY)>maxTopMoveHeight){
				moveY=-maxTopMoveHeight
			}
			
			
			
			if(movePosition.toLowerCase() == "x"){
				thisXMove();
			}else if(movePosition.toLowerCase() == "y"){
				thisYMove();
			}else if(movePosition.toLowerCase() == 'both'){
				thisAllMove();
			}
			
			function thisXMove(){ //x轴移动
				if(mDown == true){
					$this.css({"left":moveX});
				}else{
					return;
				}
				
				/*if(moveX < 0 ){
					$this.css({"left":moveX});
				}
				if(moveX > Math.abs(faWidth-thisWidth)){
					$this.css({"left":faWidth-thisWidth});
				}
				return moveX;*/
			}
			
			function thisYMove(){ //y轴移动
				/*if(mDown == true){
					$this.css({"top":moveY});
				}else{
					return;
				}
				if(moveY < 0){
					$this.css({"top":"0"});
				}
				if(moveY > (faHeight-thisHeight)){
					$this.css({"top":faHeight-thisHeight});
				}
				return moveY;*/
			}

			function thisAllMove(){ //全部移动
				if(mDown == true){
					//$this.css({"left":moveX,"top":moveY});
				}else{
					return;
				}
				
				
				let maxMoveWidth=thisWidth-100
				if(moveX < 0 && Math.abs(moveX)< maxMoveWidth){
					$this.css({"left":moveX});
				}
				
				if(moveX < 0 && Math.abs(moveX)>= maxMoveWidth){
					$this.css({"left":-maxMoveWidth});
				}
				
				
				
				if(0<moveX<faWidth-100){
					$this.css({"left":moveX});
				}
				
				//let offsetWidth=(thisWidth-faWidth)/2
				if(moveX >= faWidth-100){
					$this.css({"left":faWidth-100});
				}
				
				
				
				let maxTopMoveHeight=thisHeight-100
				if(moveY < 0  && Math.abs(moveY)< maxTopMoveHeight){
					$this.css({"top":moveY});
				}
				
				if(moveY < 0 && Math.abs(moveY)>= maxTopMoveHeight){
					$this.css({"left":-maxTopMoveHeight});
				}
				
				
				if(0<moveY<faHeight-100){
					$this.css({"top":moveY});
				}
				
				if(moveY >= faHeight-100){
					$this.css({"top":faHeight-100});
				}
			  }
				
		});
    }
}); 