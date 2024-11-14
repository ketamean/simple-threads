const pswInput = document.querySelector('#password');
const pswStrengthBar = document.querySelector('#password-strength-bar')
const cfPswInput = document.querySelector('#cf-password')
const pswMatchBar = document.querySelector('#password-match-bar')

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

pswInput.addEventListener(
    'input',
    () => {
        /*
            password strength:
            - at least 8 characters
            - contains number(s)
            - contains special character(s)
            - contains uppercase letter(s)
            - contains lowercase letter(s)

            the password earns 1 score for each constraint met:
            - score = 0 1 2     weak
            - score = 3 4       average
            - score = 5         strong
        */
        let score = 0
        let str = pswInput.value


        if (str.length === 0) {
            pswStrengthBar.style.display = 'none'
            return
        } else pswStrengthBar.style.display = 'block'
        // remove password matched notation
        checkPswMatch()

        // check password strength
        if (str.length >= 8) score++    
        if ( containsLowsercaseLetter(str) ) score++
        if ( containsUppercaseLetter(str) ) score++
        if ( containsSpecialChar(str) ) score++
        if ( containsNumber(str) ) score++
        if (score <= 2) { // weak password
            pswStrengthBar.style.width = 'var(--password-strength-weak-width)'
            pswStrengthBar.style.backgroundColor = 'var(--password-strength-weak-color)'
        } else if (score <= 4) { // average password
            pswStrengthBar.style.width = 'var(--password-strength-average-width)'
            pswStrengthBar.style.backgroundColor = 'var(--password-strength-average-color)'
        } else { // strong password
            pswStrengthBar.style.width = 'var(--password-strength-strong-width)'
            pswStrengthBar.style.backgroundColor = 'var(--password-strength-strong-color)'
        }
    }
)

function checkPswMatch() {
    if (cfPswInput.value !== pswInput.value) pswMatchBar.style.display = 'none'
    else pswMatchBar.style.display = 'block'
}

cfPswInput.addEventListener(
    'input',
    () => checkPswMatch()
)