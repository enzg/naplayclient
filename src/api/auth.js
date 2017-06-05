import {CognitoUserPool, AuthenticationDetails, CognitoUser} from 'amazon-cognito-identity-js'
import config from '../config/cognito-config'
const Bluebird = require('bluebird')
const getUserPool = () => {
  return new CognitoUserPool({UserPoolId: config.cognito.USER_POOL_ID, ClientId: config.cognito.APP_CLIENT_ID})
}

export const loginUser = async(payload) => {
  const userPool = getUserPool()
  const authenticationData = {
    Username: payload.username,
    Password: payload.password
  }
  const user = new CognitoUser({Username: payload.username, Pool: userPool})
  const authenticationDetails = new AuthenticationDetails(authenticationData)

  return new Bluebird((resolve, reject) => {
    user.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        user.getUserAttributes((err, r) => {
          if (err) {
            return reject(err)
          }
          let role = '-1'
          for (var i = 0; i < r.length; i++) {
            if (r[i].getName() == 'custom:role') {
              role = r[i].getValue()
              break
            }
          }
          return resolve([0, result.getIdToken().getJwtToken(), role])
        })

      },
      onFailure: (err) => reject(err)
    })
  })
}
export const getCurrentUser = () => {
  return !!getUserPool().getCurrentUser()
}
export const logout = async() => {
  return new Bluebird((resolve, reject) => {
    const currentUser = getUserPool().getCurrentUser()
    if (!currentUser) {
      return reject(new Error('cant get currentUser'))
    }
    currentUser.signOut()
    resolve([0, 'signout'])
  })

}
export const getCurrentRole = async() => {
  return new Bluebird((resolve, reject) => {
    const currentUser = getUserPool().getCurrentUser()
    if (!currentUser) {
      return resolve([0, "-1"])
    }
    currentUser.getUserAttributes((err, result) => {
      if (err) {
        return reject(err)
      }
      let role = '-1'
      for (var i = 0; i < reusult.length; i++) {
        if (result[i].getName() == 'custom:role') {
          role = reusult[i].getValue()
          break
        }
      }
      return resolve([0, role])
    })

  })
}
export const getCurrentToken = async() => {
  return new Bluebird((resolve, reject) => {
    const currentUser = getUserPool().getCurrentUser()
    if (!currentUser) {
      return reject(new Error('CurrentUser is null'))
    }
    currentUser.getSession((err, session) => {
      if (err) {
        return reject(err)
      }
      currentUser.getUserAttributes((err, r) => {
        if (err) {
          return reject(err)
        }
        let role = '-1'
        for (var i = 0; i < r.length; i++) {
          if (r[i].getName() == 'custom:role') {
            role = r[i].getValue()
            break
          }
        }
        return resolve([0, session.getIdToken().getJwtToken(), role, currentUser.getUsername()])
      })
    })
  })
}
export const changePassword = async(payload) => {
  return new Bluebird((resolve, reject) => {
    const currentUser = getUserPool().getCurrentUser()
    if (!currentUser) {
      return reject(new Error('currentUser is null'))
    }
    currentUser.getSession((err,session) =>{
      if (err) {
        return reject(err)
      }
      currentUser.changePassword(payload.oldPassword, payload.newPassword, (err, result) => {
        if (err) {
          return reject(err)
        }
        return resolve([0, result])
      })
    })

  })
}
