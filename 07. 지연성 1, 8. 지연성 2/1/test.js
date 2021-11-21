/**
 * 지연 평가의 퍼포먼스 
 *  https://edykim.com/ko/post/introduction-to-lodashs-delay-evaluation-by-filip-zawada/
 *  값 리턴 전에 배열을 온전히 만들어내는 평가와 달리, 지연 평가는 조건이 만족되는 순간에 배열 생성을 멈출 수 있다.
 *  -> 더 확장하면, 여러 함수들로 전처리를 처리할 경우 (map, filter, reduce) 지연 평가로 인해, 한 원소에 대한 평가를 수행 & 배열 생성의 과정이 가능해진다!
 * 
 *  기존의 평가 방식이었다면, 일반 배열 (배열 생성) -> map (배열 생성) -> filter (배열 생성) ...
 *   -> 지연 평가 (lazy evaluation) ~ a 에 대한 map filter .. b, c, .. 조건 만족시 스탑
 *    함수 파악시, 제일 끝단의 함수부터 첫 함수로 타고 올라가 지연된 iterator next() 하나씩 돌리면서 수행!
 * 
 *  당장에 값이 필요한 경우에만, 해당 부분을 평가하여 값을 수행 - 그 이후 값은 또 필요할 때 평가해서 활용한다!
 */
