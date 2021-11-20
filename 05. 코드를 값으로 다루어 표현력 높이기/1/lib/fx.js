const log = console.log;

const curry = f =>
  // 함수 리턴 - 나머지 인자의 길이가 2개 이상이면 즉시실행
  //  아니면, 추후에 인자 받아 실행하는 내부함수 리턴
  (a, ..._) => _.length ? f(a, ..._) : (..._) => f(a, ..._);

const map = curry((f, iter) => {
  let res = [];
  for (const a of iter) {
    res.push(f(a));
  }
  return res;
});

const filter = curry((f, iter) => {
  let res = [];
  for (const a of iter) {
    if (f(a)) res.push(a);
  }
  return res;
});

const reduce = curry((f, acc, iter) => {
  if (!iter) {
    iter = acc[Symbol.iterator]();
    acc = iter.next().value;
  }
  for (const a of iter) {
    acc = f(acc, a);
  }
  return acc;
});


module.exports = {
  log,
  curry,
  map,
  filter,
  reduce,
}