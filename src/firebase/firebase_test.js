import { db } from './config.js'

import {
  collection,
  doc,
  getDoc,
  getDocs
} from 'firebase/firestore/lite'


export const getUsers = async (req, res, next) => {
  try{
    // const test = db.collection('users')
    // console.log(db)
    const colRef = collection(db, 'users')
    // console.log(coll)
    const docs = await getDocs(colRef)
    let docArr = []
    for (const doc of docs.docs){
      docArr.push({
        id: doc.id,
        number: doc.data().number,
        name: doc.data().name
      })
    }
    // console.log(doc)
    res.send(docArr)
  }catch(err){
    res.send(`Error arrise on getusers -> ${err}`)
  }
}