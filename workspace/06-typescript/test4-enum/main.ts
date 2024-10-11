//열거형 상수 선언.. 이 상수로 어떤 변수의 타입 지정.. 
//이렇게 되면 그 변수는 이 상수내에 선언된 값만 가질 수 있다..
enum Direction1 {
  NORTH,
  SOUTH,
  EAST, 
  WEST
}
let c1: Direction1 = Direction1.NORTH
let c2: Direction1 = Direction1.EAST
//열거형 상수로 값이 지정된 변수에 대입된 실제 값은 뭔가?
//열거형 상수는 선언된 순서로 0부터 1씩 증가되는 값을 자동으로 가진다..
console.log(c1, c2)//0 2
//npx tsc main.ts

//원한다면 개발자가 직접 값을 대입시킬 수도 있다..
enum Direction2 {
  NORTH = 10,
  SOUTH = 20,
  EAST = 30, 
  WEST
}
//직접 값을 지정할 수 있고, 어떤 변수에 값 지정이 안되면 그 위 변수 값에 1 더해서..
console.log(Direction2.NORTH, Direction2.WEST)//10 31

//숫자값 이외에.. 문자열등 다양한 타입의 데이터를 열거형 상수 변수에 대입할 수 있나?
//가능하다..
enum Direction3 {
  NORTH = 'north',
  SOUTH = 'south',
  EAST = 'west', 
  WEST = 10
}
console.log(Direction3.NORTH, Direction3.WEST)//north east