const nameWordBank = require("./data/name_word_bank.json");
const nounArray = require("./data/nouns.json");
const companyDescBank = require("./data/companydesc.json");
const jobDescBank = require("./data/jobdesc.json");
const optionsData = require("./data/options.json");

var getOptions = function () {
    return optionsData;
}

var getName = function (industry) {
    if (industry == 'randomindustry') {
        industry = getRandomKey(companyDescBank);
    }
    var genericNouns = require("./data/companyNames/generic-nouns.json");
    var genericAdjectives = require("./data/companyNames/generic-adjectives.json");
    var genericSuffixes = require("./data/companyNames/generic-suffixes.json");

    var industryNouns = nameWordBank[industry] ? nameWordBank[industry].nouns : [];
    var industryAdjectives = nameWordBank[industry] ? nameWordBank[industry].adjectives : [];
    var industrySuffixes = nameWordBank[industry] ? nameWordBank[industry].suffixes : [];

    var nouns = genericNouns.concat(industryNouns);
    var adjectives = genericAdjectives.concat(industryAdjectives);
    var suffixes = genericSuffixes.concat(industrySuffixes);

    var adjective = adjectives[Math.floor(Math.random() * (adjectives.length))];
    var noun = nouns[Math.floor(Math.random() * (nouns.length))];
    var suffix = suffixes[Math.floor(Math.random() * (suffixes.length))];

    if (noun === adjective) {
        adjective = "";
    }

    if (noun === suffix) {
        suffix = "";
    }

    var name = "";

    var hasAdjective = Math.random() > 0.5;
    var hasNoun = Math.random() > 0.1;
    var hasSuffix = Math.random() > 0.75;

    if (hasAdjective) name += adjective + " ";
    if (hasNoun || (!hasAdjective && !hasSuffix)) name += noun + " ";
    if (hasSuffix) name += suffix;

    return name.trim();
}

var getDesc = function (industry) {
    if (industry == 'randomindustry') {
        industry = getRandomKey(companyDescBank);
    }
    var bank = companyDescBank[industry];
    var desc = bank.template[0];
    let i = 1;
    for (i; i < bank.template.length; i++) {
        if (bank["blank" + i] == "target-audience") {
            let ta = companyDescBank.ta[Math.floor(Math.random() * (companyDescBank.ta.length))];
            desc += ta + bank.template[i];
        } else {
            let blank = bank["blank" + i][Math.floor(Math.random() * (bank["blank" + i].length))];
            desc += blank + bank.template[i];
        }
    }
    return desc;
}

var getJob = function (job) {
    if (job == 'randomjob') {
        job = getRandomKey(jobDescBank);
    }
    var bank = jobDescBank[job];
    if (!bank.template)
        return bank;
    var job = bank.template[0];
    let i = 1;
    for (i; i < bank.template.length; i++) {
        let blank = bank["blank" + i][Math.floor(Math.random() * (bank["blank" + i].length))];
        job += blank + bank.template[i];
    }
    return job;
}

var getDeadline = function (industry) {
    var days = Math.round(Math.random() * (10 - 2) + 2); // random number between 2 and 10
    return (days == 7) ? "1 week" : days + " days";
}

var getRandomKey = function (obj) {
    let allKeys = Object.keys(obj);
    let randomKey = allKeys[Math.floor(Math.random() * allKeys.length)];
    return randomKey;
}

// module.exports = getBrief;
module.exports.getOptions = getOptions;
module.exports.companyName = getName;
module.exports.companyDesc = getDesc;
module.exports.jobDesc = getJob;
module.exports.deadline = getDeadline;