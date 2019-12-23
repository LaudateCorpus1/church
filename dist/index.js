'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// Check out my [combinators-js](https://github.com/benji6/combinators-js) library if you are interested in combinatory logic.
// A [combinator](https://en.wikipedia.org/wiki/Combinatory_logic) is just a higher order function that uses only function application and earlier defined combinators to define a result from its arguments. Most of the functions declared here can be defined very simply in terms of combinators.

// ## General

// `True` takes 2 arguments and returns the first. This is the K combinator
// ```javascript
// True('first')('second') // => 'first'`
// ```
var True = function True(a) {
  return function (_) {
    return a;
  };
};

// `False` takes 2 arguments and returns the second. This is the KI combinator
// ```javascript
// False('first')('second') // => 'second'
// ```
var False = function False(_) {
  return function (a) {
    return a;
  };
};

// `If` takes a predicate and two values, returning the first value if the predicate is True and the second if the predicate is False. This is the I** combinator
// ```javascript
// If(True)('then')('else') // => 'then'
// If(False)('then')('else') // => 'else'
// ```
var If = function If(a) {
  return function (b) {
    return function (c) {
      return a(b)(c);
    };
  };
};

// `and`
// ```javascript
// and(True)(True) // => True
// and(True)(False) // => False
// ```
var and = function and(a) {
  return function (b) {
    return a(b)(a);
  };
};

// `or`
// ```javascript
// or(True)(False) // => True
// or(False)(False) // => False
// ```
var or = function or(a) {
  return function (b) {
    return a(a)(b);
  };
};

// `not` (this is the C combinator)
// ```javascript
// not(False) // => True
// not(True) // => False
// ```
var not = function not(a) {
  return function (b) {
    return function (c) {
      return a(c)(b);
    };
  };
};

// `xor`
// ```javascript
// xor(True)(False) // => True
// xor(True)(True) // => False
// ```
var xor = function xor(a) {
  return function (b) {
    return function (c) {
      return function (d) {
        return a(b(d)(c))(b(c)(d));
      };
    };
  };
};

// ## Encoding & decoding

// `encodeBoolean` takes a JS value and returns `True` if it is truthy
// and `False` otherwise
// ```javascript
// encodeBoolean(true) // => True
// encodeBoolean(false) // => False
// ```
var encodeBoolean = function encodeBoolean(a) {
  return a ? True : False;
};

// `decodeBoolean` takes a Church encoded boolean and returns the corresponding JS boolean
// ```javascript
// decodeBoolean(True) // => true
// decodeBoolean(False) // => false
// ```
var decodeBoolean = function decodeBoolean(a) {
  return a(true)(false);
};

// This is how numerals are encoded. They take a function and a value then apply that function to the value or the previous result of application n times where n is the number being encoded.

// ## General

// zero is the KI combinator just like False - not very type safe!
var zero = function zero(_) {
  return function (x) {
    return x;
  };
};
// and one is the I* combinator
var one = function one(f) {
  return function (x) {
    return f(x);
  };
};
var two = function two(f) {
  return function (x) {
    return f(f(x));
  };
};
var three = function three(f) {
  return function (x) {
    return f(f(f(x)));
  };
};
var four = function four(f) {
  return function (x) {
    return f(f(f(f(x))));
  };
};
var five = function five(f) {
  return function (x) {
    return f(f(f(f(f(x)))));
  };
};
var six = function six(f) {
  return function (x) {
    return f(f(f(f(f(f(x))))));
  };
};
var seven = function seven(f) {
  return function (x) {
    return f(f(f(f(f(f(f(x)))))));
  };
};
var eight = function eight(f) {
  return function (x) {
    return f(f(f(f(f(f(f(f(x))))))));
  };
};
var nine = function nine(f) {
  return function (x) {
    return f(f(f(f(f(f(f(f(f(x)))))))));
  };
};
var ten = function ten(f) {
  return function (x) {
    return f(f(f(f(f(f(f(f(f(f(x))))))))));
  };
};

// `succ` takes a numeral and returns its successor
// ```javascript
// succ(three) // => four
// succ(four) // => five
// ```
var succ = function succ(a) {
  return function (b) {
    return function (c) {
      return a(b)(b(c));
    };
  };
};

// `pred` takes a numeral and returns its predecessor. There is a catch here, if the number supplied is zero then zero will be returned
// ```javascript
// pred(five) // => four
// pred(four) // => three
// pred(zero) // => zero
// ```
var pred = function pred(a) {
  return function (b) {
    return function (c) {
      return a(function (d) {
        return function (e) {
          return e(d(b));
        };
      })(function (_) {
        return c;
      })(function (a) {
        return a;
      });
    };
  };
};

// `add` takes two numerals and returns their sum
// ```javascript
// add(four)(three) // => seven
// ```
var add = function add(a) {
  return function (b) {
    return function (c) {
      return function (d) {
        return b(c)(a(c)(d));
      };
    };
  };
};

// `sub` takes two numerals and returns their difference. Again there is catch in that if the difference is negative then zero will be returned
// ```javascript
// sub(three)(one) // => two
// sub(three)(two) // => one
// sub(three)(three) // => zero
// sub(three)(four) // => zero
// ```
var sub = function sub(a) {
  return function (b) {
    return b(pred)(a);
  };
};

// `mult` takes two numerals and returns their product. This is the B combinator
// ```javascript
// mult(two)(five) // => ten
// ```
var mult = function mult(a) {
  return function (b) {
    return function (c) {
      return a(b(c));
    };
  };
};

// `exp` takes two numerals and returns the first to the power of the second. This is the T combinator
// ```javascript
// exp(ten)(zero) // => one
// exp(two)(two) // => four
// exp(three)(two) // => nine
// ```
var exp = function exp(a) {
  return function (b) {
    return b(a);
  };
};

// ## Encoding & Decoding

// `encodeNumeral` takes a JS number and returns the corresponding Church encoded numeral
// ```javascript
// encodeNumeral(3) // => three
// ```
var encodeNumeral = function encodeNumeral(n) {
  return function (f) {
    return function (x) {
      return Array.apply(null, { length: n }).reduce(f, x);
    };
  };
};

// `decodeNumeral` takes a Church encoded numeral and returns the corresponding JS number
// ```javascript
// decodeNumeral(three) // => 3
// ```
var decodeNumeral = function decodeNumeral(a) {
  return a(function (b) {
    return b + 1;
  })(0);
};

// `isZero` takes a value and returns Church encoded `True` if it is a Church encoded `zero` and `False` otherwise
// ```javascript
// isZero(zero) // => True
// isZero(one) // => False
// ```
var isZero = function isZero(a) {
  return a(function (_) {
    return False;
  })(True);
};

// `lte` takes two numerals and returns True if the first is less than or equal to the first and False otherwise
// ```javascript
// lte(two)(three) // => True
// lte(three)(three) // => True
// lte(four)(three) // => False
// ```
var lte = function lte(a) {
  return function (b) {
    return isZero(sub(a)(b));
  };
};

// `gte` takes two numerals and returns True if the first is greater than or equal to the first and False otherwise
// ```javascript
// gte(two)(three) // => False
// gte(three)(three) // => True
// gte(four)(three) // => True
// ```
var gte = function gte(a) {
  return function (b) {
    return isZero(sub(b)(a));
  };
};

// `lt` takes two numerals and returns True if the first is less than the first and False otherwise
// ```javascript
// lt(two)(three) // => True
// lt(three)(three) // => False
// lt(four)(three) // => False
// ```
var lt = function lt(a) {
  return function (b) {
    return not(gte(a)(b));
  };
};

// `gt` takes two numerals and returns True if the first is greater than the first and False otherwise
// ```javascript
// gt(two)(three) // => False
// gt(three)(three) // => False
// gt(four)(three) // => True
// ```
var gt = function gt(a) {
  return function (b) {
    return not(lte(a)(b));
  };
};

// `eq` takes two numerals and returns True if the first is equal to the first and False otherwise
// ```javascript
// eq(three)(three) // => True
// eq(four)(three) // => False
// ```
var eq = function eq(a) {
  return function (b) {
    return and(lte(a)(b))(lte(b)(a));
  };
};

// `pair` takes two values which are effectively stored as a two-tuple that can then be accessed by `first` and `second` detailed below. This is the V combinator
// ```javascript
// pair('first value')('second value')
// // => pair('first value')('second value')
// ```
var pair = function pair(a) {
  return function (b) {
    return function (c) {
      return c(a)(b);
    };
  };
};

// when a pair is applied with `first` the first value in the pair is returned. This is TK in combinatory logic
// ```javascript
// pair('first value')('second value')(first)
// // => 'first value'
// ```
var first = function first(a) {
  return a(function (b) {
    return function (_) {
      return b;
    };
  });
};

// when a pair is applied with `second` the first value in the pair is returned. This is TKI in combinatory logic
// ```javascript
// pair('first value')('second value')(second)
// // => 'second value'
// ```
var second = function second(a) {
  return a(function (_) {
    return function (b) {
      return b;
    };
  });
};

// Now lists are really cool.
// There are a few ways to implement them, this is how I've done it

// ## Basics

// `nil` represents the end of a list.
// It's necessary to define this so iterating functions know when to complete.
// All other nodes will have `False` as the first value in their pair
var nil = pair(True)(True);

// `isNil` returns `True` if applied to `nil` and `False` otherwise
// ```javascript
// isNil(nil) // => True
// isNil(pair(False)(someValue)) // => False
// ```
var isNil = first;

// `cons` takes two values and returns a new node of those values
// ```javascript
// const list123 = cons(one)(cons(two)(cons(three)(nil)))
// // => This is our basic list of [one two three]
// ```
var cons = function cons(a) {
  return function (b) {
    return pair(False)(pair(a)(b));
  };
};

// `head` takes returns the first value in a list
// ```javascript
// head(list123) // => one
// ```
var head = function head(a) {
  return first(second(a));
};

// `tail` takes a list and returns a list of all values except the first
// ```javascript
// tail(list123) // => list of [two three]
// ```
var tail = function tail(a) {
  return second(second(a));
};

// So now we have these simple functions defined we can build all our favourite list functions!

// ## Creating lists

// `range` takes two numerals and returns a new list of numbers from the first argument up to and including the second
// ```javascript
// range(one)(three) // => list of [one two three]
// range(three)(four) // => list of [three four]
// ```
var range = function range(a) {
  return function (b) {
    return sub(succ(b))(a)(function (c) {
      return cons(sub(b)(length(c)))(c);
    })(nil);
  };
};

// `repeat` takes a value and a numeral and returns a new list of length specified by second arguments filled with the provided value
// ```javascript
// repeat(one)(three) // => list of [one one one]
// repeat(True)(four) // => list of [True True True True]
// ```
var repeat = function repeat(a) {
  return function (b) {
    return b(function (c) {
      return cons(a)(c);
    })(nil);
  };
};

// ## Folds

// When you can fold you can derive all sorts of useful functions as we shall see shortly

// This is the Y combinator which we use to recursively call lambda exressions in our definitions below
var Y = function Y(a) {
  return function (b) {
    return b(b);
  }(function (b) {
    return a(function (c) {
      return b(b)(c);
    });
  });
};

// `foldr` takes a reducing function (this takes two argumens, the list element then the accumulator), an initial value and a list. It then iterates over the list from right to left applying the reducing funcion to the initial value / result of previous reducing function and the current value in the list.
// ```javascript
// foldr(sum)(zero)(list123) // => six
// ```
var foldr = Y(function (r) {
  return function (f) {
    return function (a) {
      return function (xs) {
        return If(isNil(xs))(function (_) {
          return a;
        })(function (_) {
          return f(head(xs))(r(f)(a)(tail(xs)));
        })();
      };
    };
  };
});

// `foldl` behaves the same as `foldr` except it iterates across the list starting from the left and the reducing function takes the accumulator before the list element. The fact it can be defined in terms of `foldr` is pretty awesome
// ```javascript
// foldl(sum)(zero)(list123) // => six
// ```
var foldl = function foldl(f) {
  return function (a) {
    return function (xs) {
      return foldr(function (x) {
        return function (g) {
          return function (y) {
            return g(f(y)(x));
          };
        };
      })(function (x) {
        return x;
      })(xs)(a);
    };
  };
};

// ## Growing a list

// `append` takes a value and a list then returns a list with the value appended
// ```javascript
// append(four)(list123) // => list of [one two three four]
// ```
var append = function append(x) {
  return function (xs) {
    return foldr(cons)(cons(x)(nil))(xs);
  };
};

// `prepend` takes a value and a list then returns a list with the value prepended
// ```javascript
// prepend(zero)(list123) // => list of [zero one two three]
// ```
var prepend = cons;

// ## Shrinking a list

// `drop` takes a numeral n and a list and returns a new list with all but the first n values
// ```javascript
// drop(two)(list123) // => list of [three]
// ```
var drop = function drop(n) {
  return function (xs) {
    return n(tail)(xs);
  };
};

// `slice` takes two numerals and returns a new list starting from the first index up to and excluding the second index
// ```javascript
// slice(one)(three)(list123) // => list of [two three]
// slice(one)(two)(list123) // => list of [two]
// ```
var slice = function slice(n) {
  return function (m) {
    return function (xs) {
      return take(pred(m))(drop(n)(xs));
    };
  };
};

// `take` takes a numeral n and a list and returns a new list of only the first n values
// ```javascript
// take(two)(list123) // => list of [one two]
// ```
var take = function take(n) {
  return foldl(function (acc) {
    return function (val) {
      return If(lt(length(acc))(n))(append(val)(acc))(acc);
    };
  })(nil);
};

// ## Combining lists

// `concat` takes two lists and joins them together
// ```javascript
// concat(list123)(list123)
// // => list of [one two three one two three]
// ```
var concat = function concat(xs) {
  return function (ys) {
    return foldr(cons)(ys)(xs);
  };
};

// `zip` takes two lists and returns a list where each value is a list of the correspondingly indexed values in the input lists. The returned list is the length of the shorter input lists
// ```javascript
// zip(list123)(list246)
// // => list of lists [[1 2] [2 4] [3 6]]
// ```
var zip = function zip(xs) {
  return function (ys) {
    return map(function (i) {
      return cons(nth(i)(xs))(cons(nth(i)(ys))(nil));
    })(range(zero)(pred(If(lt(length(xs))(length(ys)))(length(xs))(length(ys)))));
  };
};

// `zipWith` takes a function and two lists and returns a list where each value is the value returned when the values in each of the given lists at the relevant index is applied to the supplied function. The returned list is the length of the shorter input lists
// ```javascript
// zipWith(add)(list123)(list246) // => list of [3 6 9]
// ```
var zipWith = function zipWith(f) {
  return function (xs) {
    return function (ys) {
      return map(function (i) {
        return f(nth(i)(xs))(nth(i)(ys));
      })(range(zero)(pred(If(lt(length(xs))(length(ys)))(length(xs))(length(ys)))));
    };
  };
};

// ## Querying lists

// `all` takes a predicate and a list and returns `True` if every value applied with the predicate returns `True` and returns `False` otherwise
// ```javascript
// all(lt(zero))(list123) // => True
// all(lt(three))(list123) // => False
// ```
var all = function all(f) {
  return foldl(function (a) {
    return function (b) {
      return and(a)(f(b));
    };
  })(True);
};

// `last` returns the last value in a list
// ```javascript
// last(list123) // => three
// ```
var last = foldl(function (a) {
  return function (b) {
    return b;
  };
})(nil);

// `length` returns the length of a list
// ```javascript
// length(list123) // => three
// ```
var length = foldl(function (a) {
  return function (b) {
    return succ(a);
  };
})(zero);

// `none` takes a predicate and a list and returns `True` if every value applied with the predicate returns `False` and returns `True` otherwise
// ```javascript
// all(lt(five))(list123) // => False
// all(lt(three))(list123) // => True
// ```
var none = function none(f) {
  return function (xs) {
    return not(all(f)(xs));
  };
};

// `nth` takes a numeral n and a list and returns the value at index n
// ```javascript
// nth(zero)(list123) // => one
// nth(two)(list123) // => three
// ```
var nth = function nth(n) {
  return function (xs) {
    return head(n(tail)(xs));
  };
};

// `sum` takes a list of numerals and sums it
// ```javascript
// sum(list123) // => six
// ```
var sum = foldl(add)(zero);

// ## Transforming lists

// `filter` takes a predicate and a list and returns a list comprised only by those values for which the predicate returns `True`
// ```javascript
// filter(lt(two)(list123) // => list of [three]
// ```
var filter = function filter(f) {
  return foldr(function (val) {
    return function (acc) {
      return If(f(val))(cons(val)(acc))(acc);
    };
  })(nil);
};

// `map` takes a function and a list and returns a new list with the function applied to every function in the given list
// ```javascript
// map(mult(two))(list123) // => list of [two four six]
// ```
var map = function map(f) {
  return foldr(function (val) {
    return function (acc) {
      return cons(f(val))(acc);
    };
  })(nil);
};

// `reverse` takes a list and reverses it
// ```javascript
// reverse(list123) // => list of [three two one]
// ```
var reverse = foldl(function (a) {
  return function (b) {
    return cons(b)(a);
  };
})(nil);

// `reject` takes a predicate and a list and returns a list comprised only by those values for which the predicate returns `False`
// ```javascript
// reject(gte(two)(list123) // => list of [three]
// ```
var reject = function reject(f) {
  return foldr(function (val) {
    return function (acc) {
      return If(f(val))(acc)(cons(val)(acc));
    };
  })(nil);
};

// ## Encoding & Decoding

// `encodeList` takes a JS array and returns a corresponding Church encoded list
// ```javascript
// encodeList([1, 2, 3]) // => list of [1 2 3]
// ```
var encodeList = function encodeList(xs) {
  return xs.reduceRight(function (ys, x) {
    return prepend(x)(ys);
  }, nil);
};

// `decodeList` takes a Church encoded list and returns a corresponding JS array (notw that this will not decode any Church encoded values in the list)
// ```javascript
// decodeList(list123) // => [One, Two, Three]
// ```
var decodeList = foldl(function (xs) {
  return function (x) {
    return xs.concat([x]);
  };
})([]);

exports.False = False;
exports.If = If;
exports.True = True;
exports.add = add;
exports.all = all;
exports.and = and;
exports.append = append;
exports.concat = concat;
exports.cons = cons;
exports.decodeBoolean = decodeBoolean;
exports.decodeList = decodeList;
exports.decodeNumeral = decodeNumeral;
exports.drop = drop;
exports.eight = eight;
exports.encodeBoolean = encodeBoolean;
exports.encodeList = encodeList;
exports.encodeNumeral = encodeNumeral;
exports.eq = eq;
exports.exp = exp;
exports.filter = filter;
exports.first = first;
exports.five = five;
exports.foldl = foldl;
exports.foldr = foldr;
exports.four = four;
exports.gt = gt;
exports.gte = gte;
exports.head = head;
exports.isNil = isNil;
exports.isZero = isZero;
exports.last = last;
exports.length = length;
exports.lt = lt;
exports.lte = lte;
exports.map = map;
exports.mult = mult;
exports.nil = nil;
exports.nine = nine;
exports.none = none;
exports.not = not;
exports.nth = nth;
exports.one = one;
exports.or = or;
exports.pair = pair;
exports.pred = pred;
exports.prepend = prepend;
exports.range = range;
exports.reject = reject;
exports.repeat = repeat;
exports.reverse = reverse;
exports.second = second;
exports.seven = seven;
exports.six = six;
exports.slice = slice;
exports.sub = sub;
exports.succ = succ;
exports.sum = sum;
exports.tail = tail;
exports.take = take;
exports.ten = ten;
exports.three = three;
exports.two = two;
exports.xor = xor;
exports.zero = zero;
exports.zip = zip;
exports.zipWith = zipWith;
