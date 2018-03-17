class Coords
{
	init(cell,state)
	{
		state.x = Infinity;
		state.y = Infinity;
		state.root = false;
		cell.style.backgroundColor = "black";
		cell.style.color = "white";
		cell.style.fontWeight =  "bold";
	}
	
	step(cell,state,neighbors)
	{
		if(!state.root)
		{
			state.x = Math.min(neighbors["left"].x+1 , neighbors["right"].x-1,neighbors["top"].x , neighbors["bottom"].x);
			state.y = Math.min(neighbors["top"].y+1 , neighbors["bottom"].y-1,neighbors["left"].y,neighbors["right"].y);
		}
		else
		{
			state.root = false;
		}
		
		cell.style.backgroundColor ="rgb("+ 255*2/(Math.abs(state.x)+2) +",0,"+ 255*2/(Math.abs(state.y)+2) +")";
		
		cell.innerText = ((state.x == Infinity) ? "?" : state.x) +","+((state.y == Infinity) ? "?" : state.y);
		if(state.x == Infinity && state.y == Infinity)
			cell.innerText = "";
	}
	
	cloneState(state)
	{
		var newState = {};
		newState.x = state.x;
		newState.y = state.y;
		newState.root = state.root;
		return newState;
	}
	
	disabled(cell,state)
	{
		state.x = Infinity;
		state.y = Infinity;
		state.root = false;
		cell.style.backgroundColor = "grey";
	}
	
	highlight(cell,state)
	{
		state.x = 0;
		state.y = 0;
		state.root = true;
		cell.style.backgroundColor ="rgb("+ 255*2/(Math.abs(state.x)+2) +",0,"+ 255*4/(Math.abs(state.y)+2) +")";
	}
	
}


class BSort
{
	init(cell,state)
	{
		state.val = Math.round(Math.random()*99);
		state.hello = "none";
		cell.style.backgroundColor = "black";
		cell.style.color = "white";
		cell.innerText = state.val;
		
		cell.style.backgroundImage = "url('Z.png')";
		cell.style.backgroundSize = "100%";
		cell.style.width = "100px";
		cell.style.height = "100px";
	}
	
	
	step(cell,state,neighbors)
	{
		if(state.hello == "none" && neighbors["left"].hello == "right")
			state.hello = "left";
		
		cell.style.backgroundImage = "url('Z.png')";
		
		switch(state.hello)
		{
			case "right":
				if(neighbors["right"].val != null && state.val > neighbors["right"].val)
					state.val = neighbors["right"].val;
				
				cell.style.backgroundColor = "green";
				cell.style.backgroundImage = "url('L.png')";
				state.hello = "left";
				break;
				
			case "left":
				if(neighbors["left"].val != null && state.val < neighbors["left"].val)
					state.val = neighbors["left"].val;
					
				cell.style.backgroundColor = "blue";
				cell.style.backgroundImage = "url('R.png')";
				state.hello = "right";
				break;
		}
		
		cell.innerText = state.val;
	}
	
	cloneState(state)
	{
		return {val:state.val,hello:state.hello}
	}
	
	disabled(cell,state)
	{
		state.hello = "right";
		state.val = null;
	}
	
}

class DekuTree
{
	init(cell,state)
	{
		
		//Logic:
		state.val = 0;
		state.burn = false;
		state.d = Infinity;
		state.parent = null;
		state.building = true;
		state.root = false;
		state.broad = false;
		
		//Display:
		cell.table = undefined;
		cell.innerHTML = "";
		cell.style.background = "black";
		cell.table = document.createElement("table");
		cell.table.style.border = "0px";
		cell.table.style.borderCollapse= "collapse"; 
		cell.table.style.borderSpacing = 0;
		for(var i=0;i<3;i++)
		{
			var row = cell.table.insertRow(0);
			for(var j=0;j<3;j++)
			{
				var cl = row.insertCell(0);
				cl.style.width = "16px";
				cl.style.height = "16px";
				cl.style.padding = "0px";
				cl.style.margin = "0px";
				cl.style.border = "none";
			}
		}
		cell.appendChild(cell.table);
		
	}
	
	step(cell,state,neighbors)
	{
		var dirs = {left:"left",right:"right",top:"top",bottom:"bottom"};
		var opDirs = {left:"right",right:"left",top:"bottom",bottom:"top"};
		var dirCell =
		{
			left:cell.table.rows[1].cells[0],
			right:cell.table.rows[1].cells[2],
			top:cell.table.rows[2].cells[1],
			bottom:cell.table.rows[0].cells[1],
			center:cell.table.rows[1].cells[1]
		};
		
		var parent = null;
		var dmin = Infinity;
		
		state.burn = false;
		
		if(false && state.burn)
		{
			state.burn = false;
			for(var c in dirCell)
				dirCell[c].style.backgroundColor = "transparent";
		}
		else if(state.parent != null && neighbors[state.parent].burn)
		{
			state.parent = null;
			state.d = Infinity;
			state.burn = true;
			for(var c in dirCell)
				dirCell[c].style.backgroundColor = "red";
		}
		else
		{
		
			if(state.root)
			{
				dmin = 0;
			
				if(state.broad)
				{
					state.val += 1;
					if(state.val > 4)
						state.val = 0;
				}
			
			}
			
			dirCell.center.style.backgroundColor = "transparent";
			
			//Compute new distance:
			for(var n in dirs)
			{
				var nbState = neighbors[n];
				
				if(nbState.d < dmin || (dmin != Infinity && nbState.d == dmin && Math.random() < 0.5))
				{
					dmin = nbState.d;
					parent = n;
				}
				
				dirCell[n].style.backgroundColor = "transparent";
			}
			
			//Update parent if distance change:
			if((parent != null) && (dmin != Infinity) && (state.parent == null || (neighbors[parent].d < neighbors[state.parent].d)))
				state.parent = parent;
			
			if(state.parent != null)
				state.d = neighbors[state.parent].d+1;
			
			
			//If parent is lost, fall to Infinity.... and beyond!
			if(state.parent != null && neighbors[state.parent].d == Infinity)
			{
				state.parent = null;
				state.d = Infinity;
			}
			
			//Display parent and distance:
			if(state.parent != null)
			{
				dirCell[state.parent].style.backgroundColor = "rgb(0,200,200)";
				dirCell.center.style.backgroundColor = "rgb(0,255,64)";
				//dirCell.center.innerText = state.d;
			}
			
			//Display children:
			for(var n in dirs)
			{
				var nbState = neighbors[n];
				if(nbState.parent == opDirs[n])
					dirCell[n].style.backgroundColor =  "rgb(0,255,64)";
			}
			
			if((state.root && state.broad) || (state.parent != null && neighbors[state.parent].broad))
			{
				if(!state.root)
				{
					state.broad = true;
					state.val = neighbors[state.parent].val;
				}
				
				dirCell["center"].style.backgroundColor =  "rgb(0,0,"+(128+32*state.val)+")";
				
				for(var n in dirs)
				{
					var nbState = neighbors[n];
					if(nbState.parent == opDirs[n] || n == state.parent)
						dirCell[n].style.backgroundColor =  "rgb(0,0,"+(127+32*state.val)+")";
					
				}
				
				dirCell["center"].innerText = state.val;
				
			}
			else
			{
				state.broad = false;
			}

			
		}
	}
	
	cloneState(state)
	{
		var newState = {};
		
		newState.d = 		state.d;
		newState.val = 		state.val;
		newState.parent = 	state.parent;
		newState.building = state.building;
		newState.root = 	state.root;
		newState.burn = 	state.burn;
		newState.broad = 	state.broad;
		
		return newState;
	}
	
	disabled(cell,state)
	{
		state.d = Infinity;
		state.burn = true;
		state.parent = null;
		state.building = true;
		state.root = false;
		cell.style.backgroundColor = "grey";
		state.broad = false;

	}
	
	highlight(cell,state)
	{
		state.d = 0;
		state.root = true;
		cell.style.background = "rgb(0,255,64)"; 
	}
	
}

class GameOfLife
{
	init(cell,state)
	{
		state.val = Math.round(Math.random());
		
		cell.style.background = (state.val == 1) ? "black" : "white";
	}
	
	step(cell,state,neighbors)
	{
		var sum = 0;
		
		for(var n in neighbors)
		{
			if(neighbors[n].val > 0) sum++;
		}
		
		if(sum == 3)
			state.val = 1;
		else if(sum < 2 || sum > 3)
			state.val = 0;
			
		cell.style.background = (state.val == 1) ? "black" : "white";
	}
	
	cloneState(state)
	{
		return { val: state.val };
	}
	
	disabled(cell,state)
	{
		state.val= 0;
		cell.style.background = "grey";
	}
}


class Automcell
{
	constructor(containerId,width,height,algo)
	{
		this.container = document.getElementById(containerId);
		this.algo = algo;
		this.width = width;
		this.height = height;
		this.widthB = width+2;
		this.heightB = height+2;
		
		//Construct topology table:
		this.table = document.createElement("table");
		this.table.class = "automcell";
		
		for(var i=0;i<this.heightB;i++)
		{
			var row = this.table.insertRow(0);
		
			for(var j=0;j<this.widthB;j++)
				row.insertCell(0);
		}
		
		this.states = new Array(this.heightB);
		this.prevStates = new Array(this.heightB);
		
		for (var j = 0; j < this.heightB; j++)
		{
			this.states[j] = new Array(this.widthB);
			this.prevStates[j] = new Array(this.widthB);
			
			for(var i=0;i<this.widthB;i++)
			{
				this.states[j][i] = {};
				this.prevStates[j][i] = {};
			}
		}
		
		this.enableAll();
		this.init();
		
		//Add to container:
		this.container.appendChild(this.table);
	}
	
	getCell(x,y) {	return this.table.rows[y+1].cells[x+1]; }
	getState(x,y) { return this.states[y+1][x+1]; }
	getPrevState(x,y) { return this.prevStates[y+1][x+1]; }
	setPrevState(x,y,state){ this.prevStates[y+1][x+1] = state};
	
	enableCell(x,y)
	{
		var cell = this.getCell(x,y);
		cell.enabled = true;
		cell.style.fontSize = "12px";
		cell.style.margin = "0px";
		cell.style.padding = "0px";
		cell.style.border = "solid darkgrey 1px";
		cell.style.width = "50px";
		cell.style.height = "50px";
		cell.style.verticalAlign = "middle";
		cell.style.textAlign = "center";
		cell.innerHTML = "";
		this.algo.init(this.getCell(x,y),this.getState(x,y));
		console.log("ENABLE!");
	};
	
	disableCell(x,y)
	{
		console.log("DISABLE");
		var cell = this.getCell(x,y);
		cell.enabled = false;
		cell.style.padding = "0px";
		cell.style.margin = "0px";
		cell.style.width = "0px";
		cell.style.height = "0px";
		cell.innerHTML = "";
		this.algo.disabled(this.getCell(x,y),this.getState(x,y));
	};
	
	toggleCell(x,y)
	{
		if(this.getCell(x,y).enabled)
			this.disableCell(x,y);
		else
			this.enableCell(x,y);
	}
	
	getNeighbors(x,y)
	{
		return {
				left: 			this.getPrevState(x-1,y),
				right: 			this.getPrevState(x+1,y),
				top: 			this.getPrevState(x,y+1),
				bottom: 		this.getPrevState(x,y-1),
				topLeft: 		this.getPrevState(x-1,y+1),
				topRight: 		this.getPrevState(x+1,y+1),
				bottomLeft: 	this.getPrevState(x-1,y-1),
				bottomRight: 	this.getPrevState(x+1,y-1)
			};
	}
	
	enableAll()
	{
		for(var y = -1;y<this.height+1;y++)
			for(var x=-1;x<this.width+1;x++)
				this.disableCell(x,y);
				
		for(var y=0;y<this.height;y++)
			for(var x=0;x<this.width;x++)
				this.enableCell(x,y);
	}
	
	init()
	{
		for(var y = -1;y<this.height+1;y++)
			for(var x=-1;x<this.width+1;x++)
			{
				if(this.getCell(x,y).enabled)
					this.algo.init(this.getCell(x,y),this.getState(x,y));
				else
					this.algo.disabled(this.getCell(x,y),this.getState(x,y));
			}
			
		this.mapClickEvents();
	}
	
	step()
	{
		for(var y=-1;y<this.height+1;y++)
			for(var x=-1;x<this.width+1;x++)
			{
				this.setPrevState(x,y,this.algo.cloneState(this.getState(x,y)));
			}
		
		for(var y=-1;y<this.height+1;y++)
			for(var x=-1;x<this.width+1;x++)
			{
				if(this.getCell(x,y).enabled)
					this.algo.step(this.getCell(x,y),this.getState(x,y),this.getNeighbors(x,y));
				else
					this.algo.disabled(this.getCell(x,y),this.getState(x,y));
			}
	}
	
	
	run()
	{
		this.interval = setInterval(this.step.bind(this),400);
	}
	
	
	stop()
	{
		clearInterval(this.interval);
	}
	
	
	highlight(x,y)
	{
		this.algo.highlight(this.getCell(x,y),this.getState(x,y));
	}
	
	mapClickEvents()
	{
		for(var y=-1;y<this.height+1;y++)
			for(var x=-1;x<this.width+1;x++)
			{
				this.getCell(x,y).onclick = this.toggleCell.bind(this,x,y);
			}
	}
	
}
