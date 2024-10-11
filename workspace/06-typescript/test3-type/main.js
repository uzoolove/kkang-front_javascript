//데이터 타입이 지정되면 그 타입에 맞는 데이터가 대입되어야 한다.
var data = 10;
data = 'hello'; //error...
//any 타입.. 모든 타입의 데이터 대입 가능.. 권장하지는 않는다..
var data1 = 10;
data1 = 'hello';
data1 = true;
data1 = {};
//타입 유추 기법도 제공된다.. 변수 선언시에 타입을 지정하지 않고.. 대입되는
//데이터로 타입이 유추...
//js 와 다르다.. js 처럼 사용하는 것은 any...
//개발자가 타입을 지정하지 않는 것 뿐이지 .. 초기 데이터에 의해 타입이 고정..
var data2 = 10;
data2 = 20;
// data2 = 'hello'//error... 
//void 도 타입임으로 변수 타입으로 지정이 가능하기는 하지만..
//undefined 만 대입이 가능함으로.. 변수 타입으로 사용하는 것은 의미가 없다..
var data3 = undefined;
// data3 = null//error 
// data3 = 10//error
//void 는 함수의 리턴 타입.. 
function f1() {
    //함수 내에서 리턴 타입의 데이터를 리턴시켜야.. 
    return 10;
}
function f2() {
    // return 10//error
}
//npx tsc main.ts 로 컴파일 시켜서 테스트.. 
