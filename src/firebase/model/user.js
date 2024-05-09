export default class User{
  constructor(id, name, mobile, address=null){
    this.id = id
    this.name = name
    this.mobile = mobile
    this.address = address
  }
  
  set address(address){
    this.address = address
  }
  
  set name(name){
    this.name = name
  }
  
  toJson(){
    return {
      name: this.name,
      mobile: this.mobile,
      address: this.address
    }
  }
}