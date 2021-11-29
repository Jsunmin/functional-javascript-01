const log = console.log;

const curry = f =>
  (a, ..._) => _.length ? f(a, ..._) : (..._) => f(a, ..._);

const isIterable = a => a && a[Symbol.iterator];

const go1 = (a, f) => a instanceof Promise ? a.then(f) : f(a);

const reduceF = (acc, a, f) =>
  a instanceof Promise ?
    // then의 2번째 인자로 reject인자 전달 ~ 인지한 에러시, 해당 원소 건너뛰고 로직 진행 / 아니면 스탑
    a.then(a => f(acc, a), e => e == nop ? acc : Promise.reject(e)) :
    f(acc, a); // 프로미스 아니면 바로 적용

const head = iter => go1(take(1, iter), ([h]) => h);

const reduce = curry((f, acc, iter) => {
  // 첫번째 인자 뽑아주는 작업
  // take가 돌면서 이터러블 .next()를 하기 때문에! iter만 그대로 전달해도 1번째 인자가 이미 돌아간 iter부터 시작됨!
  if (!iter) return reduce(f, head(iter = acc[Symbol.iterator]()), iter);

  iter = iter[Symbol.iterator]();
  return go1(acc, function recur(acc) {
    let cur;
    while (!(cur = iter.next()).done) {
      acc = reduceF(acc, cur.value, f); // 클레이슬리 조합 - 에러시 건너뛰는 처리 추가
      if (acc instanceof Promise) return acc.then(recur);
    }
    return acc;
  });
});

const go = (...args) => reduce((a, f) => f(a), args);

const pipe = (f, ...fs) => (...as) => go(f(...as), ...fs);

const take = curry((l, iter) => {
  let res = [];
  iter = iter[Symbol.iterator]();
  // 프로미스 객체를 리턴하면서 return이 걸림 ~ 이 return에 take가 종료되지 않도록 recur로 감싼다.
  return function recur() {
    let cur;
    while (!(cur = iter.next()).done) {
      const a = cur.value;
      if (a instanceof Promise) {
        return a
          // 들어오는 값이 프로미스 인스턴스이면 resolve후 push & 길이 같으면 res 리턴하며 함수 끝내고. 아니면 recur 돔
          .then(a => (res.push(a), res).length == l ? res : recur())
          // 앞에서 조합된 함수에서 예외상황으로 reject를 보냈다면, nop (인지된 예외)면, 해당 원소 건너뛰고 take | 인지못한 예외면 그대로 err 뱉어내고 과정 stop
          .catch(e => e == nop ? recur() : Promise.reject(e));
      }
      res.push(a);
      if (res.length == l) return res;
    }
    return res;
  }();
});

const takeAll = take(Infinity);

const L = {};

L.range = function* (l) {
  let i = -1;
  while (++i < l) yield i;
};

L.map = curry(function* (f, iter) {
  for (const a of iter) {
    // 들어오는 값이 프로미스면 프로미스 resolve 후 함수 적용 | 아니면 그대로 함수 적용
    yield go1(a, f);
  }
});

const nop = Symbol('nop');

// 클레이슬리 조합 활용 -
L.filter = curry(function* (f, iter) {
  for (const a of iter) {
    const b = go1(a, f); // 함수 적용 결과값 (조건)
    // filter condition이 프로미스면 then 후 처리 / 에러시 Promise.reject로 다음 함수 조합 stop 처리 (평가하는 다음 함수가 catch를 어떻게 받느냐에 따라서 다르다!)
    if (b instanceof Promise) yield b.then(b => b ? a : Promise.reject(nop));
    else if (b) yield a;
  }
});

L.entries = function* (obj) {
  for (const k in obj) yield [k, obj[k]];
};

L.flatten = function* (iter) {
  for (const a of iter) {
    if (isIterable(a)) yield* a;
    else yield a;
  }
};

L.deepFlat = function* f(iter) {
  for (const a of iter) {
    if (isIterable(a)) yield* f(a);
    else yield a;
  }
};

L.flatMap = curry(pipe(L.map, L.flatten));

const map = curry(pipe(L.map, takeAll));

const filter = curry(pipe(L.filter, takeAll));

const find = curry((f, iter) => go(
  iter,
  L.filter(f),
  take(1),
  ([a]) => a));

const flatten = pipe(L.flatten, takeAll);

const flatMap = curry(pipe(L.map, flatten));

var add = (a, b) => a + b;

const range = l => {
  let i = -1;
  let res = [];
  while (++i < l) {
    res.push(i);
  }
  return res;
};
