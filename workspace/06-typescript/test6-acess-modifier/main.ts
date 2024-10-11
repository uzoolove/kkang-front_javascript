class SuperClass {
  //매개변수는 로컬 variable
  //생성자에 한해서만.. 
  //매개변수에 접근제한자를 추가하면 곧 멤버 변수가 된다..
  //원래 로컬 변수에는 접근제한자 추가 못한다..
  constructor(public id: string, public age: number, private address: string){
  }

  email = 'a@a.com'
  private phone = '1111'
  protected url = 'http://www.google.com'

  some(){
    console.log(this.id, this.age, this.address)
  }
}

let superObj = new SuperClass('kim', 10, 'seoul')
superObj.some()
superObj.age = 20
// superObj.address = 'pusan'//error
// superObj.url = '~~~'//error

class SubClass extends SuperClass {
  some(){
    this.age = 30
    this.url = '~~'
    // this.address = 'aaa'//error
  }
}