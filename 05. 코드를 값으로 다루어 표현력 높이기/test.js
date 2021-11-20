const { reduce, log} = require('./1/lib/fx');


// 인자를 받음 - args라는 함수가 value인 이터레이터를 받아, 리듀스로 바로 평가 & 값 리턴
// const go = (...args) => reduce((a, f) => f(a), args);
const go = (...args) => reduce((a, f) => {
  // args로 들어오는 함수를 계속 씌워가면서 a값(초기값)을 처리함
  // reduce 로직으로 인해, a = args[0] ~ 얘는 함수이면 안됨!
  console.log(a, f, 'inner go')
  return f(a) // 이 값이 다음 acc로!
}, args);

// 인자를 받음 - args라는 함수가 value인 이터레이터를 받아, 해당 함수들을 차례로 수행하는 축약된 함수 리턴
// const pipe = (f, ...fs) => (...as) => go(f(...as), ...fs);
const pipe = (f, ...fs) => {
  // 처음 실행으로 함수 세팅 & 리턴하는 내장함수로 함수 평가값 받음

  // 복수 인자를 받는 첫번째 함수와 나머지 acc 함수들을 분리
  console.log(f, 'inner pipe1', ...fs);

  return (...as) => {
    // 내부함수 로직
    // 실행에서 복수개의 인자를 받음.
    // 외부함수에서 나머지 연산으로 분리한 첫번째 함수에 첫번째 복수 인자를 넣어서, acc 초기값 세팅
    // 그 후 단일 인자에 대한 함수 적용 (go)
    console.log(...as, 'inner pipe2');
    return go(f(...as), ...fs)
  };
}

go(
  1,
  function add1(a) { return a + 10 },
  function add2(a) { return a + 100 },
  log
);
console.log('go');

const f = pipe(
  (a, b) => a + b,
  a => a + 10,
  a => a + 100
);
const pipeR = f(1,2);
console.log('pipe')

