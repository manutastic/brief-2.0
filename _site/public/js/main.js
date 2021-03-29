// ====================================================
// Remember selected brief options on page refresh
// ====================================================



function toggleClass(element, toggleClass){
    var currentClass = element.className;
    var newClass;
    if(currentClass.split(" ").indexOf(toggleClass) > -1){
       newClass = currentClass.replace(new RegExp('\\b'+toggleClass+'\\b','g'),"")
    }else{
       newClass = currentClass + " " + toggleClass;
    }
    element.className = newClass.trim();
 }

var UserOptions = [];
var options = document.querySelectorAll('.options input[type="radio"]');
var StoredOptions;

function updateOptionTitleBar() {
    var checkedJob = document.querySelector('.option.job input[type="radio"]:checked ~ p');
    document.querySelector('.option.job .value').innerHTML = checkedJob.innerHTML;
    var checkedIndustry = document.querySelector('.option.industry input[type="radio"]:checked ~ p');
    document.querySelector('.option.industry .value').innerHTML = checkedIndustry.innerHTML;
}

document.addEventListener('DOMContentLoaded',function() {
    
    document.querySelector('.job section').classList.add('collapsed');
    document.querySelector('.industry section').classList.add('collapsed');
    document.querySelector('.brief').classList.add('collapsed');

    options = document.querySelectorAll('.options input[type="radio"]');
    if(localStorage["briefoptions"]){
        StoredOptions = JSON.parse(localStorage["briefoptions"]);
        for(var i=0; i<options.length; i++){
            if (StoredOptions.includes(options[i].value)){
                options[i].setAttribute('checked', 'checked');
            }
        }
    }

    updateOptionTitleBar() 

    window.onload =  function() {
        document.querySelector('.brief').classList.remove("collapsed");
    };

    document.querySelector('.option.job').addEventListener("click", updateOptionTitleBar, false);
    document.querySelector('.option.industry').addEventListener("click", updateOptionTitleBar, false);

    document.querySelector('.job .option-bar').addEventListener("click", function() {
        toggleClass(document.querySelector('.job section'), "collapsed");
    }, false);
    document.querySelector('.industry .option-bar').addEventListener("click", function() {
        toggleClass(document.querySelector('.industry section'), "collapsed");
    }, false);

},false);

function saveOptions() {
    options = document.querySelectorAll('.options input[type="radio"]');
    if (document.querySelectorAll('.options input[type="radio"]:checked').length > 0) {
    	for(var i=0; i<options.length; i++){
			if(options[i].checked){
				choice = options[i].value;
                UserOptions.push(choice);
			}
		}
		localStorage["briefoptions"] = JSON.stringify(UserOptions);
	}else{
		alert("Select Something");
	}
}