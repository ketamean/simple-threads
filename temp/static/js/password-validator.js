import { passwordScoring, checkPswMatch } from '/js/password.js'
const form = document.querySelector('form')
const psw = document.querySelector('#password')
const cfpsw = document.querySelector('#cf-password')
const pswMatchSymbol = document.querySelector('#password-match-symbol')
const pswStrengthBar = document.querySelector('#password-strength-bar')

document.querySelector('#show-password').addEventListener('change', (e) => {
    if (psw && cfpsw && psw.type == "password") {
        psw.type = cfpsw.type = "text"
    } else {
        psw.type = cfpsw.type = "password"
    }
})

psw.addEventListener('copy', (e) => e.preventDefault())
cfpsw.addEventListener('copy', (e) => e.preventDefault())

psw.addEventListener('input', (e) => {
    if (checkPswMatch(psw.value, cfpsw.value)) {
        cfpsw.setCustomValidity('')
        pswMatchSymbol.style.visibility = 'visible'
    } else {
        cfpsw.setCustomValidity('Password must match')
        pswMatchSymbol.style.visibility = 'hidden'
    }
    
    if (psw.value) pswStrengthBar.style.visibility = 'visible'
    else pswStrengthBar.style.visibility = 'hidden'

    let score = passwordScoring(psw.value)
    if (score <= 2) { // weak password
        pswStrengthBar.style.width = 'var(--password-strength-weak-width)'
        pswStrengthBar.style.backgroundColor = 'var(--password-strength-weak-color)'
        psw.setCustomValidity('At least 8 characters, with numbers, speacial characters, uppercase letters, and lowercase letters')
    } else if (score <= 4) { // average password
        pswStrengthBar.style.width = 'var(--password-strength-average-width)'
        pswStrengthBar.style.backgroundColor = 'var(--password-strength-average-color)'
        psw.setCustomValidity('At least 8 characters, with numbers, speacial characters, uppercase letters, and lowercase letters')
    } else { // strong password
        pswStrengthBar.style.width = 'var(--password-strength-strong-width)'
        pswStrengthBar.style.backgroundColor = 'var(--password-strength-strong-color)'
        psw.setCustomValidity('')
    }
})

cfpsw.addEventListener('input', (e) => {
    if (checkPswMatch(psw.value, cfpsw.value)) {
        cfpsw.setCustomValidity('')
        pswMatchSymbol.style.visibility = 'visible'
    } else {
        cfpsw.setCustomValidity('Password must match')
        pswMatchSymbol.style.visibility = 'hidden'
    }
})