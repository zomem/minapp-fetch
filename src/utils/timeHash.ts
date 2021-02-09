
const word1 = [
  'a', 'b', 'c', 'd', 'e',
  'f', 'g', 'h', 'i', 'j'
]

const word2 = [
  'k', 'l', 'm', 'n', 'o',
  'p', 'q', 'r', 's', 't'
]


// 以hrTime为随机的hash
export default function timeHash(){

  let hrTime = process.hrtime()
  let sec = hrTime[0]
  let nano = hrTime[1]
  let hash = ''

  for(let i = 0; i < 5; i++){
    let n = ((sec % (10 * (10 ** i))) / (10 ** i)) >>> 0
    hash = hash + word1[n]
  }

  for(let i = 0; i < 9; i++){
    let n = ((nano % (10 * (10 ** i))) / (10 ** i)) >>> 0
    hash = hash + word2[n]
  }
  
  return hash
}