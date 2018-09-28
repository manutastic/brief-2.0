var nameWordBank = require("./data/name_word_bank.json");
var nounArray = require("./data/nouns.json");
var companyDescBank = require("./data/companydesc.json");
var jobDescBank = require("./data/jobdesc.json");



var getName = function(industry) {
    if (industry == 'random') {
        industry = getRandomKey(companyDescBank);
    } 
    var nouns = nounArray;
    // TODO: complete word bank and replace "tech" with industry
    var adjectives = nameWordBank["tech"].adjectives;
    var suffixes = nameWordBank["tech"].suffixes;

    var adjective = adjectives[Math.floor(Math.random()*(adjectives.length))];
    var noun = nouns[Math.floor(Math.random()*(nouns.length))];
    var suffix = suffixes[Math.floor(Math.random()*(suffixes.length))];

    var name = "";

    if (Math.random() > 0.5) name += adjective + " ";
    name += noun;
    if (Math.random() > 0.5) name += " " + suffix;

    return name;
}

var getDesc = function(industry) {
    if (industry == 'random') {
        industry = getRandomKey(companyDescBank);
    } 
    var bank = companyDescBank[industry];
    var desc = bank.template[0];
    let i = 1;
    for (i; i < bank.template.length; i++) {
        if(bank["blank"+i] == "target-audience"){
            let ta = companyDescBank.ta[Math.floor(Math.random()*(companyDescBank.ta.length))];
            desc += ta + bank.template[i];
        } else {
            let blank = bank["blank"+i][Math.floor(Math.random()*(bank["blank"+i].length))];
            desc += blank + bank.template[i];
        }
    }
    return desc;
}

var getJob = function(job) {
    if (job == 'random') {
        job = getRandomKey(jobDescBank);
    } 
    var bank = jobDescBank[job];
    if(!bank.template)
        return bank;
    var job = bank.template[0];
    let i = 1;
    for (i; i < bank.template.length; i++) {
        let blank = bank["blank"+i][Math.floor(Math.random()*(bank["blank"+i].length))];
        job += blank + bank.template[i];
    }
    return job;
}

var getDeadline = function(industry) {
    var days = Math.round(Math.random() * (10 - 2) + 2); // random number between 2 and 10
    return (days == 7) ? "1 week" : days + " days";
}

var getRandomKey = function(obj) {
    let allKeys = Object.keys(obj);
    let randomKey = allKeys[Math.floor(Math.random() * allKeys.length)];
    return randomKey;
}

// module.exports = getBrief;
module.exports.companyName = getName;
module.exports.companyDesc = getDesc;
module.exports.jobDesc = getJob;
module.exports.deadline = getDeadline;