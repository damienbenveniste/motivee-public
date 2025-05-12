import { initializeApp } from "firebase/app";
import {
    getAuth,
    onAuthStateChanged,
    applyActionCode,
    browserLocalPersistence,
    setPersistence,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    sendEmailVerification,
    deleteUser,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
    sendSignInLinkToEmail,
    isSignInWithEmailLink,
    signInWithEmailLink,
    verifyPasswordResetCode,
    confirmPasswordReset
} from "firebase/auth"
import URL from "route/url";


const firebaseConfig = (window.location.hostname === 'insight.getmotivee.com') ? (
    {
        apiKey: process.env.REACT_APP_FIREBASE_APIKEY_PROD,
        authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN_PROD,
        projectId: process.env.REACT_APP_FIREBASE_PROJECTID_PROD,
        storageBucket: process.env.REACT_APP_FIREBASE_BUCKET_PROD,
        messagingSenderId: process.env.REACT_APP_FIREBASE_SENDERID_PROD,
        appId: process.env.REACT_APP_FIREBASE_APPID_PROD,
        measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENTID_PROD
    }
) : (
    {
        apiKey: process.env.REACT_APP_FIREBASE_APIKEY_STAGING,
        authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN_STAGING,
        projectId: process.env.REACT_APP_FIREBASE_PROJECTID_STAGING,
        storageBucket: process.env.REACT_APP_FIREBASE_BUCKET_STAGING,
        messagingSenderId: process.env.REACT_APP_FIREBASE_SENDERID_STAGING,
        appId: process.env.REACT_APP_FIREBASE_APPID_STAGING,
        measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENTID_STAGING
    }
)

const app = initializeApp(firebaseConfig)


function getFirebaseErrorMessage(error, onFailure) {
    var message = 'Oops something wrong happened!'
    switch (error.code) {
        case 'auth/email-already-exists':
            message = 'The provided email is already in use by an existing user. Each user must have a unique email.'
            break
        case 'auth/email-already-in-use':
            message = 'The provided email is already in use by an existing user. Each user must have a unique email.'
            break
        case 'auth/invalid-email':
            message = 'The provided value for the email user property is invalid. It must be a string email address.'
            break
        case 'auth/invalid-password':
            message = 'The provided value for the password user property is invalid. It must be a string with at least six characters.'
            break
        case 'auth/wrong-password':
            message = 'The password provided is incorrect.'
            break
        case 'auth/user-not-found':
            message = 'There is no existing user record corresponding to the provided identifier.'
            break
        default:
            message = 'Oops something wrong happened!'
    }
    onFailure(message)
}

let auth = getAuth(app)


class Auth {

    static getAuth() {
        return auth
    }

    static checkEmailVerified({
        onSuccess = () => { return null },
        onFailure = () => { return null }
    }) {
        auth.currentUser.reload().then(
            auth.currentUser.reload().then(() => {
                const user = auth.currentUser
                if (user && user.emailVerified) {
                    onSuccess()
                } else {
                    onFailure("The email has not been verified!")
                }
            })
        )
    }

    static AuthAPICall(callback) {
        onAuthStateChanged(auth, async user => {
            if (user) {
                let token = await user.getIdToken(true)
                callback(token)
            }
        })
    }

    static sendEmailVerification({
        onSuccess = () => { return null },
        onFailure = () => { return null }
    }) {
        onAuthStateChanged(auth, user => {
            if (user) {
                sendEmailVerification(user)
                onSuccess()
            } else {
                onFailure()
            }
        })
    }

    static checkEmailVerifiedLoop() {
        const unsubscribeSetInterval = setInterval(() => {
            auth.currentUser.reload()
            if (auth.currentUser.emailVerified) {
                clearInterval(unsubscribeSetInterval)
                window.location.reload()
            }
        }, 1000)
    }

    static signInWithGoogle({
        onSuccess = () => { return null },
        onFailure = () => { return null }
    }) {
        const provider = new GoogleAuthProvider()
        signInWithPopup(auth, provider)
            .then(() => {
                onSuccess()
            }).catch((error) => {
                getFirebaseErrorMessage(error, onFailure)
            })
    }

    static handleVerifyEmail({
        actionCode,
        onSuccess = () => { return null },
        onFailure = () => { return null }
    }) {

        applyActionCode(auth, actionCode).then((resp) => {
            auth.currentUser.reload().then(() => {
                onSuccess()
            }).catch((error) => {
                onFailure()
            })
        }).catch((error) => {
            console.log(error)
            onFailure()
        })
    }

    static signInWithEmailLink({ onSuccess, onFailure }) {
        if (isSignInWithEmailLink(auth, window.location.href)) {
            var email = window.localStorage.getItem('emailForSignIn');
            if (!email) {
                email = window.prompt('Please provide your email for confirmation')
            }
            setPersistence(auth, browserLocalPersistence)
                .then(() => {
                    signInWithEmailLink(auth, email, window.location.href)
                        .then(() => {
                            window.localStorage.removeItem('emailForSignIn');
                            onSuccess()
                        })
                        .catch(error => onFailure())
                })
        }
    }

    static sendSignInLinkToEmail({
        email,
        onSuccess = () => { return null },
        onFailure = () => { return null }
    }) {

        const actionCodeSettings = {
            url: `${window.location.origin}${URL.HANDLE_VERIFY_EMAIL}`,
            handleCodeInApp: true,
        }

        setPersistence(auth, browserLocalPersistence)
            .then(() => {
                sendSignInLinkToEmail(auth, email, actionCodeSettings)
                    .then(() => {
                        window.localStorage.setItem('emailForSignIn', email)
                        onSuccess()
                    })
                    .catch((error) => {
                        getFirebaseErrorMessage(error, onFailure)
                    })
            })
    }

    static createUserWithEmailAndPassword({
        email,
        password,
        onSuccess = () => { return null },
        onFailure = () => { return null }
    }) {

        setPersistence(auth, browserLocalPersistence)
            .then(() => {
                createUserWithEmailAndPassword(auth, email, password)
                    .then((userCredential) => {
                        const user = userCredential.user
                        sendEmailVerification(user)
                        onSuccess()
                    })
                    .catch((error) => {
                        getFirebaseErrorMessage(error, onFailure)
                    })
            })
    }

    static createUserOrSignin({
        email,
        password,
        onSuccess = () => { return null },
        onFailure = () => { return null }
    }) {
        setPersistence(auth, browserLocalPersistence)
            .then(() => {
                createUserWithEmailAndPassword(auth, email, password)
                    .then((userCredential) => {
                        onSuccess()
                    })
                    .catch((error) => {
                        if (error.code === 'auth/email-already-in-use') {
                            setPersistence(auth, browserLocalPersistence)
                                .then(() => {
                                    signInWithEmailAndPassword(auth, email, password)
                                        .then((userCredential) => {
                                            window.location.reload()
                                        })
                                        .catch((error) => {
                                            getFirebaseErrorMessage(error, onFailure)
                                        })
                                })
                        } else {
                            getFirebaseErrorMessage(error, onFailure)
                        }
                    })
            })

    }

    static signInWithEmailAndPassword({
        email,
        password,
        onSuccess = () => { return null },
        onFailure = () => { return null }
    }) {

        setPersistence(auth, browserLocalPersistence)
            .then(() => {
                signInWithEmailAndPassword(auth, email, password)
                    .then((userCredential) => {
                        // const user = userCredential.user
                        window.location.reload()
                        onSuccess()
                    })
                    .catch((error) => {
                        getFirebaseErrorMessage(error, onFailure)
                    })
            })

    }

    static sendPasswordResetEmail({
        email,
        onSuccess = () => { return null },
        onFailure = () => { return null }
    }) {

        sendPasswordResetEmail(auth, email)
            .then(() => {
                onSuccess()
            })
            .catch((error) => {
                console.log(error)
                getFirebaseErrorMessage(error, onFailure)
            })
    }

    static verifyPasswordResetCode({
        actionCode,
        onSuccess = () => { return null },
        onFailure = () => { return null }
    }) {

        verifyPasswordResetCode(auth, actionCode).then((email) => {
            onSuccess()
        }).catch((error) => {
            onFailure()
        })
    }

    static confirmPasswordReset({
        password,
        actionCode,
        onSuccess = () => { return null },
        onFailure = () => { return null }
    }) {
        confirmPasswordReset(auth, actionCode, password).then((resp) => {
            onSuccess()
        }).catch((error) => {
            getFirebaseErrorMessage(error, onFailure)
        })
    }

    static deleteUser({
        onSuccess = () => { return null },
        onFailure = () => { return null }
    }) {

        const user = auth.currentUser
        deleteUser(user).then(() => {
            onSuccess()
        }).catch((error) => {
            onFailure()
        })
    }

    static async logout() {
        await signOut(auth)
        localStorage.clear()
        sessionStorage.clear()
        window.location.reload()
    }
}

export { Auth }