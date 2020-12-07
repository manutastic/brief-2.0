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

 
 function updateOptionTitleBar() {
     var checkedJob = document.querySelector('.option.job input[type="radio"]:checked ~ p');
     document.querySelector('.option.job .value').innerHTML = checkedJob.innerHTML;
     var checkedIndustry = document.querySelector('.option.industry input[type="radio"]:checked ~ p');
     document.querySelector('.option.industry .value').innerHTML = checkedIndustry.innerHTML;
    }
    
document.addEventListener('DOMContentLoaded',function() {
    var defaultOptions = ["logo", "tech"];
    var optionElements = document.querySelectorAll('.options input[type="radio"]');
    var options = localStorage["briefoptions"] ? JSON.parse(localStorage["briefoptions"]) : defaultOptions;

    for(var i=0; i<optionElements.length; i++){
        if (options.includes(optionElements[i].value)){
            optionElements[i].setAttribute('checked', 'checked');
        }
    }

    updateOptionTitleBar() 

    document.querySelector('.option.job').addEventListener("click", updateOptionTitleBar, false);
    document.querySelector('.option.industry').addEventListener("click", updateOptionTitleBar, false);

    document.querySelector('.job .option-bar').addEventListener("click", function() {
        toggleClass(document.querySelector('.job section'), "collapsed");
    }, false);
    document.querySelector('.industry .option-bar').addEventListener("click", function() {
        toggleClass(document.querySelector('.industry section'), "collapsed");
    }, false);

    generateBrief();

},false);

function getOptions() {
    const UserOptions = [];
    const options = document.querySelectorAll('.options input[type="radio"]');
    if (document.querySelectorAll('.options input[type="radio"]:checked').length > 0) {
    	for(var i=0; i<options.length; i++){
			if(options[i].checked){
				const choice = options[i].value;
                UserOptions.push(choice);
			}
        }
        return UserOptions;
	}else{
		alert("Select Something");
	}
}

function setLoading(loading) {
    const genButton = document.getElementById("gen-btn");
    const briefSection = document.querySelector('.brief');
    genButton.value = loading ? "Generating..." : "Generate";
    if (loading) {
        genButton.classList.add("loading");
        briefSection.classList.add("loading");
    } else {
        genButton.classList.remove("loading");
        briefSection.classList.remove("loading");
    }
}

function renderBrief(brief) {
    const nameSection = document.getElementById("name-section");
    const briefName = document.getElementById("brief-name");
    const briefDesc = document.getElementById("brief-desc");
    const briefJob = document.getElementById("brief-job");
    const briefDeadline = document.getElementById("brief-deadline");

    if (!brief.name) {
        nameSection.classList.add("hide");
    } else {
        nameSection.classList.remove("hide");
        briefName.innerHTML = brief.name;
    }
    briefDesc.innerHTML = brief.desc;
    briefJob.innerHTML = brief.job;
    briefDeadline.innerHTML = brief.deadline;
}

function generateBrief() {
    setLoading(true);
    const selectedOptions = getOptions();
    localStorage["briefoptions"] = JSON.stringify(selectedOptions);
    fetch('/brief', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'job': selectedOptions[0], 'industry': selectedOptions[1]})
    }).then(response => response.json())
    .then(data => {
        setLoading(false);
        renderBrief(data);
    });
}
