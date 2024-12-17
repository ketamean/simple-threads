function containsSpecialChar(str) {
    return str.match(/[!"#$%&'()*+,\-./:;<=>?@\[\\\]^_`{|}~]/) !== null
}

function containsUppercaseLetter(str) {
    return str.match(/[A-Z]/)
}

function containsLowsercaseLetter(str) {
    return str.match(/[a-z]/)
}

function containsNumber(str) {
    return str.match(/[0-9]/)
}

export function passwordScoring(psw) {
    let score = 0
    if (psw.length >= 8) score++    
    if ( containsLowsercaseLetter(psw) ) score++
    if ( containsUppercaseLetter(psw) ) score++
    if ( containsSpecialChar(psw) ) score++
    if ( containsNumber(psw) ) score++
    return score
}

export function checkPswMatch(psw1, psw2) {
    return psw1 && psw2 && psw1 === psw2
}