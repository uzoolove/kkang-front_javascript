//ts 에서 interface 는 다른 언어 처럼 class 에 어떤 멤버(변수, 함수)가 
//꼭 선언되어 있게 강제하기 위해서 사용
//+
//클래스와 관련없이.. 타입을 지정하는 용도로도 사용이 가능.. 

//타입 지정.. 
interface MyInterface {
  id: number,
  name: string
}
//타입 나열을 , 으로 하지 않고 ; 으로 나열해도 된다..
interface MyInterface2 {
  id: number;
  name: string;
}
let d1: MyInterface2 = {id: 10, name: 'kim'}

//다른 interface 를 상속 받아서 새로운 interface 를 만들 수도 있다..
interface MyInterface3 extends MyInterface2 {
  age: number
}
let d2: MyInterface3 = {id: 10, name: 'kim', age: 10}

//함수 타입.. 
//타입은 데이터 타입이다.. 
//함수에서 데이터는? 매개변수, 리턴값
//함수 타입은 함수의 매개변수와 리턴 타입..
//(arg1: number) : number
//어떤 함수가 매개변수로 함수를 받아야 한다.. 
//아래처럼 선언은 지원하지 않는다..
// function t1(argFun: (arg1: number): number){}
interface MyFunType {
  (arg1: number): number 
}
function t1(argFun: MyFunType){}
t1((no: number) => 10)

//interface 를 클래스에서 사용.... 
//interface 에 멤버를 선언(변수, 함수), 선언만 하는 것이지 구체적인 값, 내용은 없고..
//interface 를 구현한 클래스내에 interface 의 멤버를 꼭 선언하게 강제..
interface MyClassInterface1 {
  data1: number 
  some1(): boolean 
}
interface MyClassInterface2 {
  data2: number 
  some2(): boolean
}
class MyClass implements MyClassInterface1, MyClassInterface2 {
  data1: number = 10
  data2: number = 20
  some1(): boolean {
    return true 
  }
  some2(): boolean {
    return true
  }
}
