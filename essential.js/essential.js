//Determine the specific type of any object
function toRawType (value) {
  let _toString = Object.prototype.toString

  let str = _toString.call(value)

  return str.slice(8, -1)
}
//Caching function calculation results
function cached (fn) {
  // Create an object to store the results returned after each function execution.
  const cache = Object.create(null)

  // Returns the wrapped function
  return function cachedFn (str) {
    // If the cache is not hit, the function will be executed
    if (!cache[str]) {
      let result = fn(str)

      // Store the result of the function execution in the cache
      cache[str] = result
    }

    return cache[str]
  }
}
//Implement Array.prototype.map
const selfMap = function (fn, context) {
  let arr = Array.prototype.slice.call(this)
  let mappedArr = Array()
  for (let i = 0; i < arr.length; i++) {
    if (!arr.hasOwnProperty(i)) continue
    mappedArr[i] = fn.call(context, arr[i], i, this)
  }
  return mappedArr
}

Array.prototype.selfMap = selfMap

//Implement Array.prototype.filter
const selfFilter = function (fn, context) {
  let arr = Array.prototype.slice.call(this)
  let filteredArr = []
  for (let i = 0; i < arr.length; i++) {
    if (!arr.hasOwnProperty(i)) continue
    fn.call(context, arr[i], i, this) && filteredArr.push(arr[i])
  }
  return filteredArr
}

Array.prototype.selfFilter = selfFilter

//Implement Array.prototype.some
const selfSome = function (fn, context) {
  let arr = Array.prototype.slice.call(this)
  if (!arr.length) return false
  for (let i = 0; i < arr.length; i++) {
    if (!arr.hasOwnProperty(i)) continue
    let res = fn.call(context, arr[i], i, this)
    if (res) return true
  }
  return false
}

Array.prototype.selfSome = selfSome

//Implement Array.prototype.reduce
const selfReduce = function (fn, initialValue) {
  let arr = Array.prototype.slice.call(this)
  let res
  let startIndex
  if (initialValue === undefined) {
    for (let i = 0; i < arr.length; i++) {
      if (!arr.hasOwnProperty(i)) continue
      startIndex = i
      res = arr[i]
      break
    }
  } else {
    res = initialValue
  }

  for (let i = ++startIndex || 0; i < arr.length; i++) {
    if (!arr.hasOwnProperty(i)) continue
    res = fn.call(null, res, arr[i], i, this)
  }
  return res
}

Array.prototype.selfReduce = selfReduce

//Implement Array.prototype.flat
const selfFlat = function (depth = 1) {
  let arr = Array.prototype.slice.call(this)
  if (depth === 0) return arr
  return arr.reduce((pre, cur) => {
    if (Array.isArray(cur)) {
      return [...pre, ...selfFlat.call(cur, depth - 1)]
    } else {
      return [...pre, cur]
    }
  }, [])
}

Array.prototype.selfFlat = selfFlat

//Curry
// Currying is a technique of evaluating function with multiple arguments, into a sequence of functions with a single argument.
function curry (fn) {
  if (fn.length <= 1) return fn
  const generator = (...args) => {
    if (fn.length === args.length) {
      return fn(...args)
    } else {
      return (...args2) => {
        return generator(...args, ...args2)
      }
    }
  }
  return generator
}
//Debouncing
// Debouncing is nothing but reducing unnecessary time-consuming computations so as
// to increase browser performance. There are some scenarios in which some functionalities
// take more time to execute a certain operation. For instance, take an
// example of a search bar on an e-commerce website.
const debounce = (
  func,
  time = 17,
  options = {
    leading: true,
    context: null
  }
) => {
  let timer
  const _debounce = function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    if (options.leading && !timer) {
      timer = setTimeout(null, time)
      func.apply(options.context, args)
    } else {
      timer = setTimeout(() => {
        func.apply(options.context, args)
        timer = null
      }, time)
    }
  }

  _debounce.cancel = function () {
    clearTimeout(timer)
    timer = null
  }
  return _debounce
}
//Throttling
const throttle = (
  func,
  time = 17,
  options = {
    leading: true,
    trailing: false,
    context: null
  }
) => {
  let previous = new Date(0).getTime()
  let timer
  const _throttle = function (...args) {
    let now = new Date().getTime()

    if (!options.leading) {
      if (timer) return
      timer = setTimeout(() => {
        timer = null
        func.apply(options.context, args)
      }, time)
    } else if (now - previous > time) {
      func.apply(options.context, args)
      previous = now
    } else if (options.trailing) {
      clearTimeout(timer)
      timer = setTimeout(() => {
        func.apply(options.context, args)
      }, time)
    }
  }

  _throttle.cancel = () => {
    previous = 0
    clearTimeout(timer)
    timer = null
  }
  return _throttle
}

//Lazy Load Images
// Lazy loading images means loading images on websites asynchronously — that is,
// after the above-the-fold content is fully loaded,
// or even conditionally, only when they appear in
// the browser’s viewport. This means that if users don’t scroll all the way down, images
// placed at the bottom of the page won’t even be loaded.

// getBoundingClientRect
let imgList1 = [...document.querySelectorAll('.get_bounding_rect')]
let num = imgList1.length

let lazyLoad1 = (function () {
  let count = 0
  return function () {
    let deleteIndexList = []
    imgList1.forEach((img, index) => {
      let rect = img.getBoundingClientRect()
      if (rect.top < window.innerHeight) {
        img.src = img.dataset.src
        // Add picture to delete list after loading successfully
        deleteIndexList.push(index)
        count++
        if (count === num) {
          //When all pictures are loaded, unbind scroll event
          document.removeEventListener('scroll', lazyLoad1)
        }
      }
    })
    // Delete loaded pictures
    imgList1 = imgList1.filter((_, index) => !deleteIndexList.includes(index))
  }
})()

//Array random disorder
// Randomly select one of all elements after the current element to exchange with the current element
function shuffle (arr) {
  for (let i = 0; i < arr.length; i++) {
    let randomIndex = i + Math.floor(Math.random() * (arr.length - i))
    ;[arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]]
  }
  return arr
}

// Generate a new array, randomly take an element from the original array and put it into the new array
function shuffle2 (arr) {
  let _arr = []
  while (arr.length) {
    let randomIndex = Math.floor(Math.random() * arr.length)
    _arr.push(arr.splice(randomIndex, 1)[0])
  }
  return _arr
}
//Singleton
//de oddi weiss
function proxy (func) {
  let instance
  let handler = {
    construct (target, args) {
      if (!instance) {
        // Create an instance if there is not exist
        instance = Reflect.construct(func, args)
      }
      return instance
    }
  }
  return new Proxy(func, handler)
}

// example

function Person (name, age) {
  this.name = name
  this.age = age
}

const SingletonPerson = proxy(Person)

let person1 = new SingletonPerson('zhl', 22)

let person2 = new SingletonPerson('cyw', 22)

console.log(person1 === person2) // true

//Implement JSON.stringfy
const isString = value => typeof value === 'string'
const isSymbol = value => typeof value === 'symbol'
const isUndefined = value => typeof value === 'undefined'
const isDate = obj => Object.prototype.toString.call(obj) === '[object Date]'
const isFunction = obj =>
  Object.prototype.toString.call(obj) === '[object Function]'
const isComplexDataType = value =>
  (typeof value === 'object' || typeof value === 'function') && value !== null
const isValidBasicDataType = value => value !== undefined && !isSymbol(value)
const isValidObj = obj =>
  Array.isArray(obj) ||
  Object.prototype.toString.call(obj) === '[object Object]'
const isInfinity = value => value === Infinity || value === -Infinity

// Symbol,undefined,function in array will become null
// Infinity,NaN will also become null
const processSpecialValueInArray = value =>
  isSymbol(value) ||
  isFunction(value) ||
  isUndefined(value) ||
  isInfinity(value) ||
  isNaN(value)
    ? null
    : value

// Handling property values according to JSON specification
const processValue = value => {
  if (isInfinity(value) || isNaN(value)) {
    return null
  }
  if (isString(value)) {
    return `"${value}"`
  }
  return value
}

// obj.loop = obj

const jsonStringify = (function () {
  // Closure + WeakMap prevent circular references
  let wp = new WeakMap()

  //It is the function in the closure that recursively calls jsonstrify, not the jsonstrify function declared by const
  return function jsonStringify (obj) {
    if (wp.get(obj))
      throw new TypeError('Converting circular structure to JSON')
    let res = ''

    if (isComplexDataType(obj)) {
      if (obj.toJSON) return obj.toJSON
      if (!isValidObj(obj)) {
        return
      }
      wp.set(obj, obj)

      if (Array.isArray(obj)) {
        res += '['
        let temp = []
        obj.forEach(value => {
          temp.push(
            isComplexDataType(value) && !isFunction(value)
              ? jsonStringify(value)
              : `${processSpecialValueInArray(value, true)}`
          )
        })
        res += `${temp.join(',')}]`
      } else {
        res += '{'
        let temp = []
        Object.keys(obj).forEach(key => {
          if (isComplexDataType(obj[key])) {
            if (isValidObj(obj[key])) {
              temp.push(`"${key}":${jsonStringify(obj[key])}`)
            } else if (isDate(obj[key])) {
              temp.push(`"${key}":"${obj[key].toISOString()}"`)
            } else if (!isFunction(obj[key])) {
              temp.push(`"${key}":{}`)
            }
          } else if (isValidBasicDataType(obj[key])) {
            temp.push(`"${key}":${processValue(obj[key])}`)
          }
        })
        res += `${temp.join(',')}}`
      }
    } else if (isSymbol(obj)) {
      return
    } else {
      return obj
    }
    return res
  }
})()

// example

let s = Symbol('s')
let obj = {
  str: '123',
  arr: [1, { e: 1 }, s, () => {}, undefined, Infinity, NaN],
  obj: { a: 1 },
  Infinity: -Infinity,
  nan: NaN,
  undef: undefined,
  symbol: s,
  date: new Date(),
  reg: /123/g,
  func: () => {},
  dom: document.querySelector('body')
}

console.log(jsonStringify(obj))
console.log(JSON.stringify(obj))

console.log("very *** 1.10 / 4")

//these 14 is veri good most of them i steal from github.com/bitfishxyz
