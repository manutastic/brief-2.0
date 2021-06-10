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

window.onload = function (event) {
    const body = document.querySelector('body');
    body.classList.remove('preload');
};

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
    const genButtons = document.querySelectorAll('.gen-btn');
    const briefSection = document.querySelector('.brief');
    genButtons.forEach((genButton) => {
        genButton.value = loading ? "Generating..." : "Generate";
    });
    if (loading) {
        genButtons.forEach((genButton) => {
            genButton.classList.add("loading");
        });
        briefSection.classList.add("loading");
    } else {
        genButtons.forEach((genButton) => {
            genButton.classList.remove("loading");
        });
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

function hideEmptyState() {
    const briefHeader = document.getElementById("brief-header");
    const briefContent = document.getElementById("brief-content");
    const emptyState = document.getElementById("brief-empty");

    briefHeader.classList.remove('hidden');
    briefContent.classList.remove('hidden');
    emptyState.classList.add('hidden');
}

function generateBrief() {
    setLoading(true);
    hideEmptyState();
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

function showExportOptions() {
    // Not a toggle, we only do this once
    document.querySelector('.export').classList.add('hidden');
    document.querySelector('.export-img').classList.remove('hidden');
    document.querySelector('.export-pdf').classList.remove('hidden');
}

function exportBrief(format) {
    document.querySelector('.export-img').classList.add('hidden');
    document.querySelector('.export-pdf').classList.add('hidden');
    document.querySelector('.export-loading').classList.remove('hidden');
    fetch('/export', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ brief: window.brief, format })
    }).then(response => {
        return response.arrayBuffer()
            .then(res => {
                document.querySelector('.export-img').classList.remove('hidden');
                document.querySelector('.export-pdf').classList.remove('hidden');
                document.querySelector('.export-loading').classList.add('hidden');
                const mimeType = format === 'pdf' ? 'application/pdf' : 'image/png'
                const blob = new Blob([res], { type: mimeType });
                const url = URL.createObjectURL(blob);
                const anchor = document.createElement('a');
                anchor.href = url;
                anchor.download = 'goodbrief';
                const clickHandler = function () {
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