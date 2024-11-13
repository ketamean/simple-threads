const pswInput = document.querySelector('#password')
const cfPswInput = document.querySelector('#cf-password')

const pswStrengthBar = document.querySelector('.password-strength-bar')
const pswMatchSymbol = document.querySelector('.password-match-container')

import { passwordScoring, checkPswMatch } from '../pswcheck.js'

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
        
        let str = pswInput.value


        if (str.length === 0) {
            pswStrengthBar.style.visibility = 'hidden'
            return
        } else pswStrengthBar.style.visibility = 'visible'
        // remove password matched notation
        if ( checkPswMatch(pswInput.value, cfPswInput.value) )
            pswMatchSymbol.style.visibility = 'visible'
        else
            pswMatchSymbol.style.visibility = 'hidden'

        // check password strength
        let score = passwordScoring(str)
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

cfPswInput.addEventListener(
    'input',
    () => {
        if ( checkPswMatch(pswInput.value, cfPswInput.value) )
            pswMatchSymbol.style.visibility = 'visible'
        else
            pswMatchSymbol.style.visibility = 'hidden'
    }
)

document.querySelector('#show-password').addEventListener('change', (e) => {
    console.log(pswInput.type)
    if (pswInput && cfPswInput && pswInput.type == "password") {
        pswInput.type = cfPswInput.type = "text"
    } else {
        pswInput.type = cfPswInput.type = "password"
    }
})