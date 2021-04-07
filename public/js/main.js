const brief = {};

function toggleClass(element, toggleClass) {
    var currentClass = element.className;
    var newClass;
    if (currentClass.split(" ").indexOf(toggleClass) > -1) {
        newClass = currentClass.replace(new RegExp('\\b' + toggleClass + '\\b', 'g'), "")
    } else {
        newClass = currentClass + " " + toggleClass;
    }
    element.className = newClass.trim();
}


function updateSelections() {
    var optionElements = document.querySelectorAll('.options input[type="radio"]');
    for (var i = 0; i < optionElements.length; i++) {
        if (optionElements[i].checked) {
            optionElements[i].parentElement.classList.add('selected');
            var optionName = optionElements[i].name;
            var optionLabel = optionElements[i].parentElement.querySelector('label p').innerHTML.trim();
            document.getElementById(optionName + '-value').innerHTML = optionLabel;
        } else {
            optionElements[i].parentElement.classList.remove('selected');
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    var defaultOptions = ["logo", "tech"];
    var optionElements = document.querySelectorAll('.options input[type="radio"]');
    var options = localStorage["briefoptions"] ? JSON.parse(localStorage["briefoptions"]) : defaultOptions;

    for (var i = 0; i < optionElements.length; i++) {
        if (options.includes(optionElements[i].value)) {
            optionElements[i].setAttribute('checked', 'checked');
        }
    }

    updateSelections()

    document.querySelector('.option.job').addEventListener("click", updateSelections, false);
    document.querySelector('.option.industry').addEventListener("click", updateSelections, false);

    document.querySelector('.job .option-bar').addEventListener("click", function () {
        toggleClass(document.querySelector('.job section'), "collapsed");
        document.querySelector('.industry section').classList.add("collapsed");
    }, false);
    document.querySelector('.industry .option-bar').addEventListener("click", function () {
        toggleClass(document.querySelector('.industry section'), "collapsed");
        document.querySelector('.job section').classList.add("collapsed");
    }, false);

    generateBrief();

}, false);

function getOptions() {
    const UserOptions = [];
    const options = document.querySelectorAll('.options input[type="radio"]');
    if (document.querySelectorAll('.options input[type="radio"]:checked').length > 0) {
        for (var i = 0; i < options.length; i++) {
            if (options[i].checked) {
                const choice = options[i].value;
                UserOptions.push(choice);
            }
        }
        return UserOptions;
    } else {
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
    const nameSection = document.getElementById("name-label");
    const briefName = document.getElementById("brief-name");
    const briefDesc = document.getElementById("brief-desc");
    const briefJob = document.getElementById("brief-job");
    const briefDeadline = document.getElementById("brief-deadline");

    if (!brief.name) {
        nameSection.classList.add("hidden");
        briefName.innerHTML = "";
    } else {
        nameSection.classList.remove("hidden");
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
        body: JSON.stringify({ 'job': selectedOptions[0], 'industry': selectedOptions[1] })
    }).then(response => response.json())
        .then(data => {
            setLoading(false);
            window.brief = data;
            renderBrief(data);
        });
}

function changeTheme() {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        localStorage.theme = 'light';
        document.querySelector('html').classList.remove('dark')
    } else {
        localStorage.theme = 'dark';
        document.querySelector('html').classList.add('dark')
    }
}

function exportBrief() {
    document.querySelector('.export-label').classList.add('hidden');
    document.querySelector('.export-loading').classList.remove('hidden');
    fetch('/export', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({brief: window.brief})
    }).then(response => {
        return response.arrayBuffer()
            .then(res => {
                document.querySelector('.export-label').classList.remove('hidden');
                document.querySelector('.export-loading').classList.add('hidden');
                const blob = new Blob([res], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                const anchor = document.createElement('a');
                anchor.href = url;
                anchor.download = 'brief';
                const clickHandler = function() {
                    setTimeout(() => {
                        URL.revokeObjectURL(url);
                        this.removeEventListener('click', clickHandler);
                        this.remove;
                    }, 500)
                }
                anchor.addEventListener('click', clickHandler, false);
                anchor.click()
            })
    })
}