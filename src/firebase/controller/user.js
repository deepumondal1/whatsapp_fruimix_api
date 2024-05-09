import { db } from '../config.js'

import {
  collection,
  doc,
  setDoc,
  addDoc,
  getDoc,
  getDocs,
} from 'firebase/firestore/lite'

import User from '../model/user.js'

const path = 'users'

export const createUser = async (id, name, mobile) => {
  try{
    const user = new User(id, name, mobile)
    console.log(user.toJson())
    // const colRef = collection(db, path, id)
    // const addUser = await addDoc(colRef, user.toJson())
    const docRef = doc(db, path, id)
    const addUser = await setDoc(docRef, user.toJson())
    return addUser
    // return user.toJson()
  }catch(err){
    return `ERROR_CREATE_USER : ${err}`
  }
}

export const addUserName = async (id, name='') => {
  try{
    if (!name){
      throw `Name not Defined.`
    }
    
    if (typeof name == 'string'){
        const docRef = doc(db, path, id)
        const user = await getDoc(docRef)
        const data = user.data()
        const arr = {
          ...data,
          name: name
        }
        await setDoc(docRef, arr)
        return {"message": "Successfully Updated"}
    }
    
//     const docRef = doc(db, path, id)

//     const user = await setDoc(docRef)
    
//     console.log(user)
//     return user
  }catch(err){
    return `ERROR_ADD_USER_NAME : ${err}`
  }
  return {'error': 'Not Found'}
}

export const getUserAddress = async (id) => {
  id = '7982413102'
  try{    
    if(!id){
      throw `"ID not defined.`
    }
    const docRef = doc(db, path, id)
    // const colRef = collection(db, path, id)
    const user = await getDoc(docRef)
    const address = await getDocs(collection(db, path, user.id, 'address'))
    if (address.empty){
      return []
    }
    let addArr = []
    for (const addr of address.docs){
      addArr.push(addr.data())
    }
    // console.log(addArr)
    return addArr
  }catch(err){
    return `ERROR_ADD_USER_ADDRESS : ${err}`
  }
}

export const addUserAddress = async (id, address=null) => {
  try{
    if (!address){
      throw `Address not Defined.`
    }
    

    if (typeof address == 'object'){
      if (address.hasOwnProperty('latitude') && address.hasOwnProperty('longitude')){
        const docRef = doc(db, path, id)
        const user = await getDoc(docRef)
        const data = user.data()
        const arr = {
          ...data,
          address: {
            ...data?.address,
            geo: address
          }
        }
        console.log(arr)
        await setDoc(docRef, arr)
        return {"message": "Successfully Updated"}
      }
    }
    
    if (typeof address == 'string'){
        const docRef = doc(db, path, id)
        const user = await getDoc(docRef)
        const data = user.data()
        const arr = {
          ...data,
          address: {
            ...data?.address,
            text: address
          }
        }
        await setDoc(docRef, arr)
        return {"message": "Successfully Updated"}
    }
    
//     const docRef = doc(db, path, id)

//     const user = await setDoc(docRef)
    
//     console.log(user)
//     return user
  }catch(err){
    return `ERROR_ADD_USER_ADDRESS : ${err}`
  }
  return {'error': 'Not Found'}
}

export const getUsers = async () => {
  try{ 
    let userArr = []
    const colRef = collection(db, path)
    const users = await getDocs(colRef)
    console.log(users.query)
    if(users.empty){
      return {"error": "empty users"}
    }
    
    for (const user of users.docs){
      const addresses = await getDocs(collection(db, path, user.id, 'address'))
      console.log(addresses.empty)
      if(!addresses.empty){
        for (const address of addresses.docs){
          userArr.push({
            ...user.data(),
            address: address.data()
          })
        }
      }else{
        userArr.push({
          ...user.data()
        })
      }
    }
    return userArr
  }catch(err){
    return `ERROR_GET_USERS : ${err}`
  }
}