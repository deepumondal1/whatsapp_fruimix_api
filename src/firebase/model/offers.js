

export default class Offers{
  constructor({name="", description="", discount="", image="", link="", products=[]}){
    this.name = name
    this.description = description
    this.discount = discount
    this.image = image
    this.link = link
    this.products = products
  }
  
  
  set image(image){
    this.image = image
  }
  
  set link(link){
    this.link = link
  }
  
  set products(products){
    this.products = products
  }
  
  toMap(json){
    return new Offers({
      name: json?.name,
      description: json?.description,
      discount: json?.discount,
      image: json?.image,
      link: json?.link,
      products: json?.products
    })
  }
  
  toJson(){
    return {
      name: this.name,
      description: this.description,
      discount: this.discount,
      image: this.image,
      link: this.link,
      products: this.products
    }
  }
  
}