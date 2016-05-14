function listFiles() {
	var message = get('message');
	message.style.color = 'orangeRed';
	message.innerHTML = 'Processing files...';
	message.style.display = 'block';
	if(validateFiles()) {
		if(generateList()) {
			message.style.color = 'green';
			message.innerHTML = 'Done.';
			get('list_step').style.display = 'block';
			get('list').style.display = 'block';
			var input_label = get('input_label');
			input_label.style.color = 'gray';
			input_label.style.border = '2px solid gray';
			input_label.style.cursor = 'not-allowed';
			get('input_files').disabled = 'true';
			scrollTo(document.documentElement, input_label.offsetTop - 10);
		}
		else {
			message.style.color = 'red';
			message.innerHTML = 'File validation fail. File(s) could not be read.';
		}
	}
	else {
		message.style.color = 'red';
		message.innerHTML = 'File validation fail. File(s) are not the result data.';
	}

}

function validateFiles() {
	var regCheck = new RegExp('^part\-[0-9]{5}$');
	var inp = get('input_files');
	for (var i = 0; i < inp.files.length; ++i) {
		var name = inp.files.item(i).name;
		if(!regCheck.test(name)) return false;
	}
	return true;
}

function generateList() {
	var errorFlag = false;
	var list = get('list');
	while (list.lastChild) {
    	list.removeChild(list.lastChild);
	}

	var inp = get('input_files');
	for(var i = 0; i < inp.files.length; ++i) {
		var reader = new FileReader();
		reader.readAsText(inp.files[i], 'UTF-8');
		reader.onload = function (evt) {
			var lines = evt.target.result.split('\n');
			for(var j = 0; j < lines.length; ++j) {
				var name = getFilename(lines[j]);
				if(name) {
					var el = document.createElement('label');
					el.innerHTML = name + ' : ' + getTopKeyword(lines[j]);
					el.onclick = function() { generateCloud(this.innerHTML.split(' : ')[0]); };
					list.appendChild(el);
				}
			}
    	};
    	reader.onerror = function(evt) {
    		errorFlag = true;
    	}
	}
	if(errorFlag) return false;
	get('list_header').style.display = 'block';
	return true;
}

function generateCloud(elName) {
	var foundFlag = false;
	var cloud = get('cloud');
	while (cloud.lastChild) {
    	cloud.removeChild(cloud.lastChild);
	}
	var header = get('cloud_header');
	header.innerHTML = '[' + elName+ '] Keyword Cloud:';

	var inp = get('input_files');
	for(var i = 0; i < inp.files.length; ++i) {
		var reader = new FileReader();
		reader.readAsText(inp.files[i], 'UTF-8');
		reader.onload = function (evt) {
			var lines = evt.target.result.split('\n');
			for(var j = 0; j < lines.length; ++j) {
				var name = getFilename(lines[j]);
				if(elName == name) {
					foundFlag = true;
					var keywords = getKeywords(lines[j]);
					var minVal = keywords[keywords.length-1].split(',')[1].replace(')', '');
					var maxVal = keywords[0].split(',')[1].replace(')', '');
					var delta = (maxVal - minVal)/50;
					keywords = shuffle(keywords);
					for(var k = 0; k < keywords.length; ++k) {
						var item = keywords[k].split(',');
						var val = item[1].replace(')', '');
						var size = Math.floor((val - minVal)/delta) + 8;
						var el = document.createElement('p');
						var node = document.createTextNode(item[0].replace('(', ''));
						el.appendChild(node);
						el.onclick = function() { generateListCloud(this.innerHTML)};
						el.style.fontSize = size + 'pt';
						cloud.appendChild(el);
					}
				}
			}
    	};
    	if(foundFlag) break;
	}

	var cloud_step = get('cloud_step');
	cloud_step.innerHTML = '(7) I have generated a keyword cloud for the particular file. The bigger the keyword, the higher its relative ID-IDF score! \
	                       Click on a keyword to see which files have it as a keyword.';
	cloud_step.style.display = 'block';
	cloud.style.display = 'block';
	var cloud_header = get('cloud_header');
	cloud_header.style.display = 'block';
	scrollTo(document.documentElement, cloud_step.offsetTop - 10);
}

function generateListCloud(s) {
	var cloud = get('cloud');
	while (cloud.lastChild) {
    	cloud.removeChild(cloud.lastChild);
	}
	var header = get('cloud_header');
	header.innerHTML = '[' + s + '] File List:';

	var inp = get('input_files');
	for(var i = 0; i < inp.files.length; ++i) {
		var reader = new FileReader();
		reader.onload = function (evt) {
			var lines = evt.target.result.split('\n');
			var fileArr = [];
			for(var j = 0; j < lines.length; ++j) {
				var name = getFilename(lines[j]);
				if(name) {
					var keywords = getKeywords(lines[j]);
					for(var k = 0; k < keywords.length; ++k) {
						var keyword = keywords[k].split(',')[0].replace('(', '');
						if(keyword == s) {
							fileArr.push(name);
						}
					}
				}
			}
			for(var l = 0; l < fileArr.length; ++l) {
				var el = document.createElement('label');
				el.innerHTML = fileArr[l];
				el.onclick = function() { generateCloud(this.innerHTML); };
				cloud.appendChild(el);
			}
    	};
    	reader.readAsText(inp.files[i], 'UTF-8');
	}

	var cloud_step = get('cloud_step');
	cloud_step.innerHTML = '(7) I have generated a file list for the particular keyword. \
								The following files have the keyword scored as one of their top keywords! \
								Click on a file\'s name to see the file\'s entire keyword list.';
	cloud_step.style.display = 'block';
	cloud.style.display = 'block';
	var cloud_header = get('cloud_header');
	cloud_header.style.display = 'block';
	scrollTo(document.documentElement, cloud_step.offsetTop - 10);
}

function getFilename(s) {
	for(var i = 0; i < s.length; ++i) {
		if(s.charAt(i) == ',') {
			return s.substring(1,i);
		}
	}
	return null;
}

function getTopKeyword(s) {
	var tempS = s.split(',')[1];
	return tempS.substring(6, tempS.length);
}

function getKeywords(s) {
	var tempS;
	for(var i = 0; i < s.length; ++i) {
		if(s.charAt(i) === ',') {
			tempS = s.substring(i+7,s.length-2);
			break;
		}
	}
	return tempS.split('), (');
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function scrollTo(element, to) {
	var duration = 1000;
    var start = element.scrollTop,
        change = to - start,
        increment = 20;

    var animateScroll = function(elapsedTime) {        
        elapsedTime += increment;
        var position = easeInOut(elapsedTime, start, change, duration);                        
        element.scrollTop = position; 
        if (elapsedTime < duration) {
            setTimeout(function() {
                animateScroll(elapsedTime);
            }, increment);
        }
    };

    animateScroll(0);
}

function easeInOut(currentTime, start, change, duration) {
    currentTime /= duration / 2;
    if (currentTime < 1) {
        return change / 2 * currentTime * currentTime + start;
    }
    currentTime -= 1;
    return -change / 2 * (currentTime * (currentTime - 2) - 1) + start;
}

function get(s) {
	return document.getElementById(s);
}