import { db } from '../config.js'

import {
  collection,
  doc,
  setDoc,
  addDoc,
  getDoc,
  getDocs,
} from 'firebase/firestore/lite'

import Offers from '../model/offers.js'

const path = 'offers'

export const getOffers = async () => {
  try{ 
    let offerArr = []
    const colRef = collection(db, path)
    const offers = await getDocs(colRef)
    // console.log(offers.query)
    if(offers.empty){
      return {"error": "empty offers"}
    }
    
    for (const offer of offers.docs){
      console.log(Offers.toMap(offer.data()))
      offerArr.push({
        ...offer.data()
      })
    }
    return offerArr
  }catch(err){
    return `ERROR_GET_OFFERS : ${err}`
  }
}