import firebase from './../FirebaseAPI'
import 'firebase/auth'
import 'firebase/database'
import axios from 'axios'
export const logoutUser = () => {
  firebase.auth().signOut()
}

export const signInUser = async ({ name, email, password }) => {
  try {
    const user = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
    initialUserData(name)
  
    return { user }
  } catch (error) {
    return {
      error: error.message,
    }
  }
}

export const loginUser = async ({ email, password }) => {
  try {
    const user = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
    return { user }
  } catch (error) {
    return {
      error: error.message,
    }
  }
}

export const sendEmailWithPassword = async (email) => {
  try {
    await firebase.auth().sendPasswordResetEmail(email)
    return {}
  } catch (error) {
    return {
      error: error.message,
    }
  }
}

const initialUserData = (Name) => {
  const user = firebase.auth().currentUser
  firebase.auth().currentUser.updateProfile({
    displayName: Name,
  })
  firebase
    .database()
    .ref('user/' + user.uid)
    .set({
      user_data: {
        uid: user.uid,
        name: Name,
        email: user.email,
      },
      class_data: '',
    })
}

export const initialUserFetch = () => {
  try {
    const user = firebase.auth().currentUser
    return firebase
      .database()
      .ref('/users/' + user.uid)
      .once('value')
      .then((snapshot) => {
        return snapshot.val()
      })
  } catch (error) {
    return {
      error: error.message,
    }
  }
}

export const initialUserFetch2 = async () => {
  try {
    const user = firebase.auth().currentUser
    const host = await initialHostFetch()
    return axios
      .get(`http://${host}:5000/getclass?uid=${user.uid}`)
      .then((res) => {
        return res.data
      })
  } catch (error) {
    return {
      error: error.message,
    }
  }
}

export const initialHostFetch = () => {
  try {
    return firebase
      .database()
      .ref('/host/')
      .once('value')
      .then((snapshot) => {
        return snapshot.val()
      })
  } catch (error) {
    return {
      error: error.message,
    }
  }
}
