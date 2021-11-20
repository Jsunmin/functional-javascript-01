const log = console.log;

function* gengen() {
  log('11 resume')
  yield 1; // (next 1) 이 부분 만나면, 이 함수에 대한 실행 포인터가 여기서 끝남
  log('22 resume') // 재개될 때 (next 2) 이 부분부터 수행됨!
  yield 2;
  log('33 resume')
  yield 3;
  log('last resume')
  yield 4; // 여기까지가 실질적 마지막
  return 100; // 얘는 값 반환 X!
}
const genIter = gengen();
log('1번 콜')
log( genIter.next() );
log('suspend')
log('2번 콜')
log( genIter.next() );
log('suspend')
log('3번 콜')
log( genIter.next() );
log('suspend')
log('4번 콜')
log( genIter.next() );
log('5번 콜?')
log( genIter.next() );
log('6번 콜?')
log( genIter.next() );

log(...genIter, '@@')
log(...gengen(), '@@')
log('\n\n\n')
// 문장으로 표현한 무한 수열 + 1;
function* infinity(i = 0) {
  console.log(i ,'!!')
  while(1) {
      log(i ,'!!!')
      yield i++;
  }

  // https://ko.javascript.info/generators
  // 여기서 while 이 없다면? - 한번 만난 yield에서 0 찍고 그대로 undefined만 노출!
  // 한번 수행한 yield는 이미 컨텍스트에 잡히고 다시 수행되지 않으니까 (다른 이터러블 생성하지 않는 이상!)
}
// 문장으로 표현한 특정 수까지만 동작하는 이터레이터;
function* limit(l, iter) {
  for (const a of iter) {
    yield a;
    if (a == l) return;
  }
}

function* odds(l) {
  // l 만큼 작동하는 이터레이터 실행 > 넘겨준 이터레이터는 1부터 시작하는 무한 수열 이터레이터
  for (const a of limit(l, infinity(1))) {
    // 이터레이터 value 홀수시 log & next
    if (a % 2) yield a;
  }
}

let iter2 = odds(10);
log(iter2.next());
log(iter2.next());
log(iter2.next());
log(iter2.next());
log(iter2.next());
log(iter2.next());
log(iter2.next());


  /**
   * https://velog.io/@rohkorea86/Generator-%ED%95%A8%EC%88%98%EB%A5%BC-%EC%9D%B4%ED%95%B4%ED%95%B4%EB%B3%B4%EC%9E%90-%EC%9D%B4%EB%A1%A0%ED%8E%B8-%EC%99%9C-%EC%A0%9C%EB%84%A4%EB%A0%88%EC%9D%B4%ED%84%B0-%ED%95%A8%EC%88%98%EB%A5%BC-%EC%8D%A8%EC%95%BC-%ED%95%98%EB%8A%94%EA%B0%80
   * 
   * 코루틴: 종료된 함수를 재실행 할 때, 단순히 처음부터 재실행X / 특정 위치에서 수행 
   *  제너레이터는 생성될 때의 컨텍스트를 클로저로 담고 있으면서, 재실행할 떄에 이를 반영한 위치에서 실행됨
   *   <-> 단순 콜스택에서 실행되고 사라지는 일반 함수X
   *
   *  외부에서 next()를 호출 -> 콜스택 올라감 -> 이터러블 (created by generator)에서 yield 만남 & 리턴
   *   -> 콜스택에서 사라짐 & 재실행까지 suspend -> 다시 next() 수행되면, 저장되어있던 context와 같이 콜스택에 올라가 실행 (resume)
   * 
   *  정지 - 실행 - 정지 - 실행 루프 형식. 이를 통해 협력적, 동시성 프로그래밍 가능 co-routine
   *   스케줄링, 스위칭 오버헤드, 공유자원 상태 등의 문제에서 자유로움!
   *   
   *  한번에 필요한 한 값 이상을 수행하는 함수와 달리, 원하는 부분의 yield를 통해 필요한 부분만 그 시간에 맞춰 평가 할 수 있음
   *   나중에 그 다음 값이 필요할 때, next()를 통해 지연된 작업, 값을 얻음 -> 메모리 효율상 굳!
   */
  