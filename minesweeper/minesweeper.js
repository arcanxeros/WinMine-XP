function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function pad (str, max) {
  str = str.toString();
  return str.length < max ? pad("0" + str, max) : str;
}

var minesweeper = document.getElementById("minesweeper");
minesweeper.style.display = "table";
//minesweeper.style.backgroundColor = "rgba(192,192,192,255)";
minesweeper.style.border="29px solid transparent";
minesweeper.style.borderImage="url('minesweeper/border.png') 29";

minesweeper.innerHTML = "<div id=\"ms_window\" style=\"\">"+
							"<div style=\"\">"+
								"<table style=\"width: 100%;\">"+
									"<tbody>"+
										"<tr>"+
											"<td>"+
												"<img src=\"minesweeper/icon.png\"/>"+
											"</td>"+
											"<td>"+
												"<div>"+
													"Minesweeper"+
												"</div>"+
											"</td>"+
											"<td style=\"text-align: right;\">"+
												"<img src=\"minesweeper/decobuttons.png\"/>"+
											"</td>"+
										"</tr>"+
									"</tbody>"+
								"</table>"+
							"</div>"+
							"<div id=\"ms_topbar\" style=\"background-color:rgba(255,255,255,255);\"><table><tbody><tr>"+
							"<td><div>Game</div></td><td><div>Help</div></td></tr></tbody></table></div>"+
							"<div id=\"ms_window_content\" style=\"border-style:outset;padding:6px;background-color:rgba(192,192,192,255);\">"+
							"<div id=\"ms_top_container\" style=\"border-style:inset;\"><table style=\"width: 100%;\">"+
							"<tbody><tr><td style=\"text-align: left;\"><div id=\"ms_mineLeft_container\">"+
							"<img src=\"minesweeper/n_0.png\"/><img src=\"minesweeper/n_0.png\"/><img src=\"minesweeper/n_0.png\"/>"+
							"</div></td><td style=\"text-align: center;\"><img id=\"ms_face\" src=\"minesweeper/f.png\" onclick=\"onFaceClick()\"/>"+
							"</td><td style=\"text-align: right;\"><div id=\"ms_timer_container\"><img src=\"minesweeper/n_0.png\"/>"+
							"<img src=\"minesweeper/n_0.png\"/><img src=\"minesweeper/n_0.png\"/></div></td></tr></tbody></table></div>"+
							"<div id=\"ms_field_container\" style=\"border-style:inset;\"></div></div></div>";

var ms_timer_container = document.getElementById("ms_timer_container");
var ms_mineLeft_container = document.getElementById("ms_mineLeft_container");
var ms_field_container = document.getElementById("ms_field_container");

var time  = 0;
var timer = null;

var field  = null;
var width  = 16;
var height = 30;
var mines  = 99;

var minesLeft = 0;
var flags = 0;
var tilesLeft = 0;

function TimerUpdate()
{
	time++;
	let digits = [...pad(time, 3)+''].map(n=>+n);
	ms_timer_container.innerHTML = "<img src=\"minesweeper/n_"+digits[0]+".png\"/>"+
								   "<img src=\"minesweeper/n_"+digits[1]+".png\"/>"+
								   "<img src=\"minesweeper/n_"+digits[2]+".png\"/>";
}
function MinesLeftUpdate()
{
	let minesNum = minesLeft - flags;
	if(minesNum < 0){minesNum = 0;}
	let digits = [...pad(minesNum, 3)+''].map(n=>+n);
	ms_mineLeft_container.innerHTML = "<img src=\"minesweeper/n_"+digits[0]+".png\"/>"+
									  "<img src=\"minesweeper/n_"+digits[1]+".png\"/>"+
									  "<img src=\"minesweeper/n_"+digits[2]+".png\"/>";
}

function onTileFlag(x, y)
{
	let id = x+","+y;
	let tile = document.getElementById(id);
	if(!tile.getAttribute("Open"))
	{
		if(!tile.getAttribute("Flagged"))
		{
			tile.setAttribute("Flagged", true);
			tile.src="minesweeper/t_f.png";
			flags++;
		}
		else
		{
			tile.removeAttribute("Flagged");
			tile.src="minesweeper/t.png";
			flags--;
		}
		MinesLeftUpdate()
	}
}

function onFaceClick()
{
	if(timer != null)
	{
		clearInterval(timer);
		time = -1;
		TimerUpdate();
		timer = null;
	}
	let face = document.getElementById("ms_face");
	face.src = "minesweeper/f.png";
	GenerateField();
}

function onTileClick(x, y)
{
	let id = x+","+y;
	let tile = document.getElementById(id);
	if(!tile.getAttribute("Open") && !tile.getAttribute("Flagged"))
	{
		if(timer == null)
		{
			timer = setInterval(TimerUpdate, 1000);
		}
		tilesLeft--;
		if(tilesLeft == mines)
		{
			let face = document.getElementById("ms_face");
			face.src = "minesweeper/f_w.png";
			for(let x = 0; x < width; x++)
			{
				for(let y = 0; y < height; y++)
				{
					let id = x+","+y;
					let tile = document.getElementById(id);
					tile.setAttribute("Open", true);
				}
			}
		}
		tile.setAttribute("Open", true);
		if(field[x][y] == 0)
		{
			for(let xx = -1; xx < 2; xx++)
			{
				if(((x+xx) > -1) && ((x+xx) < width))
				{
					for(let yy = -1; yy < 2; yy++)
					{
						if(((y+yy) > -1) && ((y+yy) < height))
						{
							onTileClick(x+xx, y+yy);
						}
					}
				}
			}
		}
		if(field[x][y] == 9)
		{
			if(timer != null)
			{
				clearInterval(timer);
			}
			let face = document.getElementById("ms_face");
			face.src = "minesweeper/f_l.png";
			for(let x = 0; x < width; x++)
			{
				for(let y = 0; y < height; y++)
				{
					let id = x+","+y;
					let tile = document.getElementById(id);
					tile.setAttribute("Open", true);
					
					if(tile.getAttribute("Flagged") && field[x][y] != 9)
					{
						tile.src = "minesweeper/t_m_e.png";
					}

					if(field[x][y] == 9)
					{
						if(!tile.getAttribute("Flagged"))
						{
							tile.src = "minesweeper/t_m.png";
						}
					}
				}
			}
		}
		tile.src = "minesweeper/t_"+field[x][y]+".png";
	}
}

function GenerateField()
{

	field = new Array(width);
	
	let temp = "";
	for(let x = 0; x < width; x++)
	{
		field[x] = new Array(height);
		for(let y = 0; y < height; y++)
		{
			let id = x+","+y;
			temp += "<img id=\""+id+"\" src=\"minesweeper/t.png\" onclick=\"onTileClick("+id+")\" oncontextmenu=\"onTileFlag("+id+");return false;\"/>";
			field[x][y] = 0;
		}
		temp += "<br>";
	}
	ms_field_container.innerHTML = temp;
	
	
	for(mine = 0; mine < mines; mine++)
	{
		let x = getRandomInt(width);
		let y = getRandomInt(height);
		if(field[x][y] != 9)
		{
			for(let xx = -1; xx < 2; xx++)
			{
				if(((x+xx) > -1) && ((x+xx) < width))
				{
					for(let yy = -1; yy < 2; yy++)
					{
						if(((y+yy) > -1) && ((y+yy) < height))
						{
							if(field[x+xx][y+yy] != 9)
							{
								field[x+xx][y+yy]++;
							}
						}
					}
				}
			}
			field[x][y] = 9;
		}
		else
		{
			mine--;
		}
	}
	
	minesLeft = mines;
	tilesLeft = width * height;
	MinesLeftUpdate()
}

GenerateField();
minesweeper.removeAttribute("hidden");