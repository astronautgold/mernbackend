import { useState, useMemo, useEffect } from "react";

/* ─── DATA ─────────────────────────────────────────────────────────── */
const CATEGORIES = [
  { id: "mutation",  label: "Mutating",       color: "#f87171", icon: "⚡" },
  { id: "iteration", label: "Iteration",      color: "#34d399", icon: "🔄" },
  { id: "search",    label: "Search",         color: "#60a5fa", icon: "🔍" },
  { id: "transform", label: "Transform",      color: "#fbbf24", icon: "✨" },
  { id: "reduce",    label: "Reduce",         color: "#c084fc", icon: "🧮" },
  { id: "slice",     label: "Slice/Splice",   color: "#f472b6", icon: "✂️" },
  { id: "sort",      label: "Sort/Order",     color: "#818cf8", icon: "📊" },
  { id: "check",     label: "Check/Test",     color: "#2dd4bf", icon: "✅" },
  { id: "flat",      label: "Flat/Fill",      color: "#fb923c", icon: "📦" },
  { id: "string",    label: "String",         color: "#a3e635", icon: "🔤" },
];

const METHODS = [
  { id:"push", name:"push()", category:"mutation", tagline:"Add to the end", mutates:true, returns:"New length of array",
    description:"Adds one or more elements to the END of an array and returns the new length. It directly mutates the original array.",
    syntax:"array.push(element1, element2, ...)",
    examples:[
      { title:"Add single element", code:`const fruits = ['apple', 'banana'];\nconst len = fruits.push('cherry');\n\nconsole.log(fruits); // ['apple', 'banana', 'cherry']\nconsole.log(len);    // 3` },
      { title:"Add multiple elements", code:`const nums = [1, 2, 3];\nnums.push(4, 5, 6);\n\nconsole.log(nums); // [1, 2, 3, 4, 5, 6]` },
    ],
    tip:"push() and pop() together make arrays behave like a Stack (LIFO)." },

  { id:"pop", name:"pop()", category:"mutation", tagline:"Remove from the end", mutates:true, returns:"The removed element",
    description:"Removes the LAST element from an array and returns it. If the array is empty, it returns undefined.",
    syntax:"array.pop()",
    examples:[
      { title:"Basic pop", code:`const fruits = ['apple', 'banana', 'cherry'];\nconst last = fruits.pop();\n\nconsole.log(last);   // 'cherry'\nconsole.log(fruits); // ['apple', 'banana']` },
    ],
    tip:"Use push() + pop() for stack (LIFO). Use unshift() + shift() for queue (FIFO)." },

  { id:"shift", name:"shift()", category:"mutation", tagline:"Remove from the front", mutates:true, returns:"The removed first element",
    description:"Removes the FIRST element from an array and returns it. Re-indexes all remaining elements (slower than pop).",
    syntax:"array.shift()",
    examples:[
      { title:"Basic shift", code:`const fruits = ['apple', 'banana', 'cherry'];\nconst first = fruits.shift();\n\nconsole.log(first);  // 'apple'\nconsole.log(fruits); // ['banana', 'cherry']` },
    ],
    tip:"shift() is slower than pop() because it re-indexes every remaining element." },

  { id:"unshift", name:"unshift()", category:"mutation", tagline:"Add to the front", mutates:true, returns:"New length of array",
    description:"Adds one or more elements to the BEGINNING of an array and returns the new length. All existing elements are re-indexed.",
    syntax:"array.unshift(element1, element2, ...)",
    examples:[
      { title:"Add to beginning", code:`const nums = [3, 4, 5];\nnums.unshift(1, 2);\n\nconsole.log(nums); // [1, 2, 3, 4, 5]` },
    ],
    tip:"unshift() + shift() = Queue (FIFO). Add with unshift, remove with shift." },

  { id:"reverse", name:"reverse()", category:"mutation", tagline:"Reverse in place", mutates:true, returns:"The reversed array (same reference)",
    description:"Reverses the order of elements IN PLACE. The first element becomes the last, the last becomes the first. Mutates original.",
    syntax:"array.reverse()",
    examples:[
      { title:"Reverse array", code:`const nums = [1, 2, 3, 4, 5];\nnums.reverse();\n\nconsole.log(nums); // [5, 4, 3, 2, 1]` },
      { title:"Non-destructive reverse", code:`const original = [1, 2, 3];\nconst reversed = [...original].reverse();\n\nconsole.log(original); // [1, 2, 3] ✅ unchanged\nconsole.log(reversed); // [3, 2, 1]` },
    ],
    tip:"To avoid mutating, spread first: [...arr].reverse()" },

  { id:"forEach", name:"forEach()", category:"iteration", tagline:"Loop through each element", mutates:false, returns:"undefined (always)",
    description:"Executes a provided function once for each element. Does NOT return a value. You cannot break out of a forEach — use a regular for loop if needed.",
    syntax:"array.forEach((element, index, array) => { ... })",
    examples:[
      { title:"Basic forEach", code:`const names = ['Ramya', 'Priya', 'Anbu'];\nnames.forEach((name, index) => {\n  console.log(\`\${index + 1}. \${name}\`);\n});\n// 1. Ramya\n// 2. Priya\n// 3. Anbu` },
      { title:"Summing values", code:`const prices = [100, 200, 300];\nlet total = 0;\n\nprices.forEach(price => {\n  total += price;\n});\n\nconsole.log(total); // 600` },
    ],
    tip:"Use forEach() for side effects (logging, DOM). Use map() if you need a new array." },

  { id:"map", name:"map()", category:"transform", tagline:"Transform each element", mutates:false, returns:"A new array with transformed elements",
    description:"Creates a NEW array by calling a function on every element. The original is unchanged. Always returns an array of the same length.",
    syntax:"const newArr = array.map((element, index) => newValue)",
    examples:[
      { title:"Double each number", code:`const nums = [1, 2, 3, 4];\nconst doubled = nums.map(n => n * 2);\n\nconsole.log(doubled); // [2, 4, 6, 8]\nconsole.log(nums);    // [1, 2, 3, 4] unchanged` },
      { title:"Extract property from objects", code:`const students = [\n  { name: 'Ramya', score: 90 },\n  { name: 'Priya', score: 85 },\n];\nconst names = students.map(s => s.name);\n\nconsole.log(names); // ['Ramya', 'Priya']` },
      { title:"Convert types", code:`const strNums = ['1', '2', '3'];\nconst intNums = strNums.map(Number);\n\nconsole.log(intNums); // [1, 2, 3]` },
    ],
    tip:"Always return a value inside map(). No return → array of undefined. Use forEach() for side effects." },

  { id:"filter", name:"filter()", category:"transform", tagline:"Keep only matching elements", mutates:false, returns:"New array with elements that passed test",
    description:"Creates a NEW array with all elements that pass the test function. Returns true to keep, false to remove.",
    syntax:"const newArr = array.filter((element, index) => condition)",
    examples:[
      { title:"Filter even numbers", code:`const nums = [1, 2, 3, 4, 5, 6];\nconst evens = nums.filter(n => n % 2 === 0);\n\nconsole.log(evens); // [2, 4, 6]` },
      { title:"Filter objects by condition", code:`const students = [\n  { name: 'Ramya', score: 90 },\n  { name: 'Priya', score: 55 },\n  { name: 'Anbu',  score: 78 },\n];\nconst passed = students.filter(s => s.score >= 60);\n// [{ name: 'Ramya', ... }, { name: 'Anbu', ... }]` },
    ],
    tip:"filter() always returns an array — even if nothing matches (returns [])." },

  { id:"reduce", name:"reduce()", category:"reduce", tagline:"Boil array down to one value", mutates:false, returns:"A single accumulated value",
    description:"Executes a reducer on each element, passing the result forward. Produces one final value — a number, string, object, or another array.",
    syntax:"array.reduce((accumulator, currentValue, index) => newAcc, initialValue)",
    types:[
      { name:"Sum numbers", code:`const nums = [1, 2, 3, 4, 5];\nconst sum = nums.reduce((acc, cur) => acc + cur, 0);\nconsole.log(sum); // 15` },
      { name:"Count occurrences", code:`const fruits = ['apple', 'banana', 'apple', 'cherry', 'apple'];\nconst count = fruits.reduce((acc, fruit) => {\n  acc[fruit] = (acc[fruit] || 0) + 1;\n  return acc;\n}, {});\nconsole.log(count);\n// { apple: 3, banana: 1, cherry: 1 }` },
      { name:"Flatten nested", code:`const nested = [[1, 2], [3, 4], [5]];\nconst flat = nested.reduce((acc, arr) => acc.concat(arr), []);\nconsole.log(flat); // [1, 2, 3, 4, 5]` },
      { name:"Max value", code:`const nums = [3, 7, 2, 9, 1];\nconst max = nums.reduce((acc, cur) => cur > acc ? cur : acc);\nconsole.log(max); // 9` },
    ],
    examples:[],
    tip:"Always provide an initialValue (2nd argument) to avoid errors on empty arrays." },

  { id:"reduceRight", name:"reduceRight()", category:"reduce", tagline:"Reduce from right to left", mutates:false, returns:"A single accumulated value",
    description:"Same as reduce() but processes elements from RIGHT to LEFT. Useful when order of operations matters.",
    syntax:"array.reduceRight((accumulator, currentValue) => newAcc, initialValue)",
    examples:[
      { title:"Right-to-left", code:`const words = ['World', 'Hello'];\nconst sentence = words.reduceRight((acc, word) => acc + ' ' + word);\nconsole.log(sentence); // 'Hello World'` },
    ],
    tip:"reduceRight() is useful for right-associative operations like function composition." },

  { id:"find", name:"find()", category:"search", tagline:"Find first matching element", mutates:false, returns:"First matching element, or undefined",
    description:"Returns the VALUE of the first element that satisfies the test. Stops searching on first match. Returns undefined if nothing matches.",
    syntax:"const found = array.find((element, index) => condition)",
    examples:[
      { title:"Find object by id", code:`const users = [\n  { id: 1, name: 'Ramya' },\n  { id: 2, name: 'Priya' },\n  { id: 3, name: 'Anbu' },\n];\nconst user = users.find(u => u.id === 2);\n\nconsole.log(user); // { id: 2, name: 'Priya' }` },
      { title:"Returns undefined if not found", code:`const nums = [1, 2, 3];\nconst found = nums.find(n => n > 10);\n\nconsole.log(found); // undefined` },
    ],
    tip:"find() returns the VALUE. Use findIndex() if you need the position." },

  { id:"findIndex", name:"findIndex()", category:"search", tagline:"Find index of first match", mutates:false, returns:"Index of first match, or -1",
    description:"Returns the INDEX of the first element that passes the test. Returns -1 if no element matches.",
    syntax:"const index = array.findIndex((element, index) => condition)",
    examples:[
      { title:"Find index of matching object", code:`const users = [\n  { id: 1, name: 'Ramya' },\n  { id: 2, name: 'Priya' },\n];\nconst idx = users.findIndex(u => u.id === 2);\n\nconsole.log(idx); // 1` },
    ],
    tip:"Returns -1 (not undefined) when not found. Always check: if (idx !== -1) before using." },

  { id:"indexOf", name:"indexOf()", category:"search", tagline:"Find index of a value", mutates:false, returns:"First index of match, or -1",
    description:"Returns the first index of the element using strict equality (===). Searches left to right. Returns -1 if not found.",
    syntax:"array.indexOf(searchValue, fromIndex?)",
    examples:[
      { title:"Basic indexOf", code:`const fruits = ['apple', 'banana', 'cherry', 'banana'];\nconsole.log(fruits.indexOf('banana')); // 1 (first)\nconsole.log(fruits.indexOf('grape'));  // -1 (not found)` },
      { title:"With fromIndex", code:`const arr = [1, 2, 3, 2, 1];\nconsole.log(arr.indexOf(2, 2)); // 3 (search from index 2)` },
    ],
    tip:"indexOf() uses === strict equality. It won't find NaN — use includes() instead." },

  { id:"lastIndexOf", name:"lastIndexOf()", category:"search", tagline:"Find last occurrence index", mutates:false, returns:"Last index of match, or -1",
    description:"Returns the LAST index of a value, searching backwards from the end. Returns -1 if not found.",
    syntax:"array.lastIndexOf(searchValue, fromIndex?)",
    examples:[
      { title:"Find last occurrence", code:`const fruits = ['apple', 'banana', 'cherry', 'banana'];\nconsole.log(fruits.lastIndexOf('banana')); // 3 (last)` },
    ],
    tip:"Use lastIndexOf() when you need the most recent occurrence of a value." },

  { id:"includes", name:"includes()", category:"search", tagline:"Check if element exists", mutates:false, returns:"true or false",
    description:"Checks if an array contains a certain element. Returns true or false. Unlike indexOf(), it correctly detects NaN.",
    syntax:"array.includes(searchValue, fromIndex?)",
    examples:[
      { title:"Basic includes", code:`const fruits = ['apple', 'banana', 'cherry'];\nconsole.log(fruits.includes('banana')); // true\nconsole.log(fruits.includes('grape'));  // false` },
      { title:"Handles NaN (indexOf can't)", code:`const arr = [1, NaN, 3];\nconsole.log(arr.includes(NaN));  // true  ✅\nconsole.log(arr.indexOf(NaN));   // -1    ❌` },
    ],
    tip:"includes() is cleaner than indexOf() !== -1 for simple existence checks." },

  { id:"some", name:"some()", category:"check", tagline:"Does ANY element match?", mutates:false, returns:"true or false",
    description:"Returns true if AT LEAST ONE element passes the test. Stops as soon as it finds the first match. Think of it like OR.",
    syntax:"const result = array.some((element, index) => condition)",
    examples:[
      { title:"Check if any number is negative", code:`const nums = [1, -2, 3, 4];\nconst hasNegative = nums.some(n => n < 0);\n\nconsole.log(hasNegative); // true` },
      { title:"Check role in users", code:`const users = [\n  { name: 'Ramya', role: 'user' },\n  { name: 'Admin', role: 'admin' },\n];\nconst hasAdmin = users.some(u => u.role === 'admin');\n\nconsole.log(hasAdmin); // true` },
    ],
    tip:"some() = OR. If any element passes → true. Think: 'Is there at least one?'" },

  { id:"every", name:"every()", category:"check", tagline:"Do ALL elements match?", mutates:false, returns:"true or false",
    description:"Returns true only if ALL elements pass the test. Returns false as soon as it finds the first failure. Think of it like AND.",
    syntax:"const result = array.every((element, index) => condition)",
    examples:[
      { title:"Check all scores passing", code:`const scores = [85, 90, 78, 92];\nconst allPassed = scores.every(s => s >= 60);\n\nconsole.log(allPassed); // true` },
      { title:"One fail = false", code:`const scores = [85, 90, 45, 92];\nconst allPassed = scores.every(s => s >= 60);\n\nconsole.log(allPassed); // false (45 < 60)` },
    ],
    tip:"every() = AND. ALL must pass for true. Think: 'Do all of them qualify?'" },

  { id:"isArray", name:"Array.isArray()", category:"check", tagline:"Check if value is an array", mutates:false, returns:"true or false",
    description:"The ONLY reliable way to check if a value is an Array. Returns true or false.",
    syntax:"Array.isArray(value)",
    examples:[
      { title:"Check various types", code:`console.log(Array.isArray([1, 2, 3])); // true\nconsole.log(Array.isArray('hello'));   // false\nconsole.log(Array.isArray({ a: 1 })); // false\n\n// Why not typeof?\nconsole.log(typeof [1,2,3]); // 'object' ❌ misleading!` },
    ],
    tip:"Always use Array.isArray() not typeof. typeof [] returns 'object' which is misleading." },

  { id:"slice", name:"slice()", category:"slice", tagline:"Copy a portion of array", mutates:false, returns:"New array with selected elements",
    description:"Returns a SHALLOW COPY of a portion of an array. Takes start (inclusive) and end (exclusive) index. Original is not modified.",
    syntax:"array.slice(start?, end?)",
    examples:[
      { title:"Basic slice", code:`const fruits = ['apple', 'banana', 'cherry', 'mango'];\nconst sliced = fruits.slice(1, 3);\n\nconsole.log(sliced); // ['banana', 'cherry']\nconsole.log(fruits); // unchanged ✅` },
      { title:"Negative index (from end)", code:`const nums = [1, 2, 3, 4, 5];\nconsole.log(nums.slice(-2));     // [4, 5] (last 2)\nconsole.log(nums.slice(-3, -1)); // [3, 4]` },
      { title:"Copy entire array", code:`const original = [1, 2, 3];\nconst copy = original.slice();\nconsole.log(copy); // [1, 2, 3] (new array)` },
    ],
    tip:"slice(start, end) — end index is EXCLUDED. Great for safely copying arrays." },

  { id:"splice", name:"splice()", category:"slice", tagline:"Add/remove elements in place", mutates:true, returns:"Array of removed elements",
    description:"Changes array contents by removing, replacing, or adding elements IN PLACE. Mutates original and returns removed elements.",
    syntax:"array.splice(start, deleteCount?, item1?, item2?, ...)",
    types:[
      { name:"Remove elements", code:`const fruits = ['apple', 'banana', 'cherry'];\nconst removed = fruits.splice(1, 1);\n\nconsole.log(removed); // ['banana']\nconsole.log(fruits);  // ['apple', 'cherry']` },
      { name:"Insert elements", code:`const fruits = ['apple', 'cherry'];\nfruits.splice(1, 0, 'banana'); // insert at 1, delete 0\n\nconsole.log(fruits); // ['apple', 'banana', 'cherry']` },
      { name:"Replace elements", code:`const fruits = ['apple', 'banana', 'cherry'];\nfruits.splice(1, 1, 'mango', 'grape');\n\nconsole.log(fruits); // ['apple', 'mango', 'grape', 'cherry']` },
    ],
    examples:[],
    tip:"slice() = non-mutating copy. splice() = mutating cut/insert. Don't confuse them!" },

  { id:"sort", name:"sort()", category:"sort", tagline:"Sort array in place", mutates:true, returns:"The sorted array (same reference)",
    description:"Sorts elements IN PLACE. Default converts to strings and sorts lexicographically. ALWAYS provide a comparator for numbers.",
    syntax:"array.sort((a, b) => a - b)",
    types:[
      { name:"Alphabetical (default)", code:`const fruits = ['cherry', 'apple', 'banana'];\nfruits.sort();\nconsole.log(fruits); // ['apple', 'banana', 'cherry']` },
      { name:"Numeric ascending", code:`const nums = [10, 1, 21, 2];\nnums.sort((a, b) => a - b);\nconsole.log(nums); // [1, 2, 10, 21]` },
      { name:"Numeric descending", code:`const nums = [10, 1, 21, 2];\nnums.sort((a, b) => b - a);\nconsole.log(nums); // [21, 10, 2, 1]` },
      { name:"Sort objects by property", code:`const students = [\n  { name: 'Priya', score: 90 },\n  { name: 'Ramya', score: 75 },\n];\nstudents.sort((a, b) => b.score - a.score);\n// Sorted high to low: Priya, Ramya` },
    ],
    examples:[],
    tip:"⚠️ Default sort converts to strings! '10' < '2' alphabetically. ALWAYS use a comparator for numbers." },

  { id:"flat", name:"flat()", category:"flat", tagline:"Flatten nested arrays", mutates:false, returns:"A new flattened array",
    description:"Creates a new array with all sub-array elements recursively concatenated up to the specified depth.",
    syntax:"array.flat(depth?)",
    types:[
      { name:"Depth 1 (default)", code:`const nested = [1, [2, 3], [4, [5, 6]]];\nconsole.log(nested.flat()); // [1, 2, 3, 4, [5, 6]]` },
      { name:"Depth 2", code:`const nested = [1, [2, [3, [4]]]];\nconsole.log(nested.flat(2)); // [1, 2, 3, [4]]` },
      { name:"Flatten all (Infinity)", code:`const deep = [1, [2, [3, [4, [5]]]]];\nconsole.log(deep.flat(Infinity)); // [1, 2, 3, 4, 5]` },
    ],
    examples:[],
    tip:"Use flat(Infinity) to fully flatten any nested array, no matter how deep." },

  { id:"flatMap", name:"flatMap()", category:"flat", tagline:"Map then flatten by 1 level", mutates:false, returns:"New mapped and flattened array",
    description:"Maps each element with a function, then flattens the result by one level. More efficient than map() followed by flat(1).",
    syntax:"array.flatMap((element, index) => { return [...] })",
    examples:[
      { title:"Split words into letters", code:`const words = ['Hello', 'World'];\nconst letters = words.flatMap(word => word.split(''));\nconsole.log(letters);\n// ['H','e','l','l','o','W','o','r','l','d']` },
      { title:"flatMap vs map + flat", code:`const arr = [1, 2, 3];\n\n// flatMap (one step):\narr.flatMap(x => [x, x * 2]); // [1, 2, 2, 4, 3, 6]\n\n// Same, two steps:\narr.map(x => [x, x * 2]).flat(); // [1, 2, 2, 4, 3, 6]` },
    ],
    tip:"flatMap() only flattens ONE level. Use flat(Infinity) if you need deeper flattening." },

  { id:"fill", name:"fill()", category:"flat", tagline:"Fill with a static value", mutates:true, returns:"The modified array (same reference)",
    description:"Changes all elements (or a range) in an array to a static value, mutating the original.",
    syntax:"array.fill(value, start?, end?)",
    examples:[
      { title:"Fill entire array", code:`const arr = [1, 2, 3, 4, 5];\narr.fill(0);\nconsole.log(arr); // [0, 0, 0, 0, 0]` },
      { title:"Fill a range", code:`const arr = [1, 2, 3, 4, 5];\narr.fill(9, 2, 4); // from index 2 to 4 (4 excluded)\nconsole.log(arr); // [1, 2, 9, 9, 5]` },
      { title:"Create pre-filled array", code:`const zeros = new Array(5).fill(0);\nconsole.log(zeros); // [0, 0, 0, 0, 0]` },
    ],
    tip:"new Array(5).fill(0) is a clean way to create an array pre-filled with a value." },

  { id:"join", name:"join()", category:"string", tagline:"Join elements into string", mutates:false, returns:"A string with all elements joined",
    description:"Joins all elements of an array into a string with the given separator (default is comma).",
    syntax:"array.join(separator?)",
    examples:[
      { title:"Default join (comma)", code:`const fruits = ['apple', 'banana', 'cherry'];\nconsole.log(fruits.join());    // 'apple,banana,cherry'` },
      { title:"Custom separator", code:`const words = ['Hello', 'World', 'JS'];\nconsole.log(words.join(' '));   // 'Hello World JS'\nconsole.log(words.join(' - ')); // 'Hello - World - JS'\nconsole.log(words.join(''));    // 'HelloWorldJS'` },
    ],
    tip:"join() is the reverse of split(). string.split(',') → array. array.join(',') → string." },

  { id:"toString", name:"toString()", category:"string", tagline:"Convert array to string", mutates:false, returns:"Comma-separated string of elements",
    description:"Returns a string representing the array. Elements are joined by commas. Equivalent to join(',').",
    syntax:"array.toString()",
    examples:[
      { title:"Basic toString", code:`const nums = [1, 2, 3, 4];\nconsole.log(nums.toString()); // '1,2,3,4'\n\nconst fruits = ['apple', 'banana'];\nconsole.log(fruits.toString()); // 'apple,banana'` },
    ],
    tip:"Use join() instead of toString() when you need a custom separator." },

  { id:"concat", name:"concat()", category:"transform", tagline:"Merge arrays together", mutates:false, returns:"A new merged array",
    description:"Merges two or more arrays into a NEW array. Does not change existing arrays. Can also add non-array values.",
    syntax:"const newArr = array.concat(array2, array3, ...)",
    examples:[
      { title:"Merge two arrays", code:`const a = [1, 2, 3];\nconst b = [4, 5, 6];\nconst merged = a.concat(b);\n\nconsole.log(merged); // [1, 2, 3, 4, 5, 6]\nconsole.log(a);      // [1, 2, 3] unchanged` },
      { title:"Modern spread alternative", code:`const a = [1, 2];\nconst b = [3, 4];\nconst merged = [...a, ...b];\n// Same result, cleaner syntax ✅` },
    ],
    tip:"The spread operator [...a, ...b] is the modern, cleaner alternative to concat()." },

  { id:"from", name:"Array.from()", category:"transform", tagline:"Create array from iterable", mutates:false, returns:"A new Array",
    description:"Creates a new Array from an array-like or iterable object (strings, Sets, Maps, NodeLists). Accepts an optional map function.",
    syntax:"Array.from(iterable, mapFn?)",
    types:[
      { name:"From string", code:`const chars = Array.from('hello');\nconsole.log(chars); // ['h', 'e', 'l', 'l', 'o']` },
      { name:"Remove duplicates (Set)", code:`const unique = Array.from(new Set([1, 2, 2, 3, 3]));\nconsole.log(unique); // [1, 2, 3]` },
      { name:"With map function", code:`const nums = Array.from({ length: 5 }, (_, i) => i + 1);\nconsole.log(nums); // [1, 2, 3, 4, 5]` },
    ],
    examples:[],
    tip:"Array.from(new Set(arr)) is the cleanest way to remove duplicates from an array." },

  { id:"of", name:"Array.of()", category:"transform", tagline:"Create array from arguments", mutates:false, returns:"A new Array with given elements",
    description:"Creates a new Array from its arguments, regardless of number or type. Fixes the confusing behavior of the Array() constructor.",
    syntax:"Array.of(element1, element2, ...)",
    examples:[
      { title:"Array.of vs new Array()", code:`// new Array(3) = confusing!\nconsole.log(new Array(3));      // [empty × 3] 😕\n\n// Array.of(3) = clear!\nconsole.log(Array.of(3));       // [3]   ✅\nconsole.log(Array.of(1, 2, 3)); // [1, 2, 3]` },
    ],
    tip:"Use Array.of() instead of new Array() to avoid the single-number confusion." },

  { id:"at", name:"at()", category:"search", tagline:"Access by index (supports negative)", mutates:false, returns:"Element at given index, or undefined",
    description:"Returns the element at the given index. Accepts negative integers (count from end). Cleaner than arr[arr.length - 1].",
    syntax:"array.at(index)",
    examples:[
      { title:"Access last elements cleanly", code:`const fruits = ['apple', 'banana', 'cherry'];\n\nconsole.log(fruits.at(0));   // 'apple'\nconsole.log(fruits.at(-1));  // 'cherry' (last) ✅\nconsole.log(fruits.at(-2));  // 'banana'\n\n// Old verbose way:\nconsole.log(fruits[fruits.length - 1]); // 'cherry'` },
    ],
    tip:"at(-1) is the modern clean way to get the last element. No more arr[arr.length - 1]!" },

  { id:"keys", name:"keys()", category:"iteration", tagline:"Iterate over array indices", mutates:false, returns:"Array Iterator with indices",
    description:"Returns a new Array Iterator that contains the keys (indices) for each element.",
    syntax:"array.keys()",
    examples:[
      { title:"Loop through indices", code:`const fruits = ['apple', 'banana', 'cherry'];\nfor (const index of fruits.keys()) {\n  console.log(index); // 0, 1, 2\n}\n\nconst indices = [...fruits.keys()];\nconsole.log(indices); // [0, 1, 2]` },
    ],
    tip:"keys() returns indices only. Use entries() to get both index and value together." },

  { id:"values", name:"values()", category:"iteration", tagline:"Iterate over array values", mutates:false, returns:"Array Iterator with values",
    description:"Returns a new Array Iterator that contains the values for each index in the array.",
    syntax:"array.values()",
    examples:[
      { title:"Loop through values", code:`const fruits = ['apple', 'banana', 'cherry'];\nfor (const val of fruits.values()) {\n  console.log(val); // apple, banana, cherry\n}` },
    ],
    tip:"values() is similar to using for...of directly on the array." },

  { id:"entries", name:"entries()", category:"iteration", tagline:"Iterate [index, value] pairs", mutates:false, returns:"Array Iterator of [index, value] pairs",
    description:"Returns a new Array Iterator that yields [index, value] pairs for each element. Great when you need both.",
    syntax:"array.entries()",
    examples:[
      { title:"Get index + value together", code:`const fruits = ['apple', 'banana', 'cherry'];\nfor (const [index, value] of fruits.entries()) {\n  console.log(\`\${index}: \${value}\`);\n}\n// 0: apple\n// 1: banana\n// 2: cherry` },
    ],
    tip:"entries() is great when you need both index and value inside a for...of loop." },

  { id:"copyWithin", name:"copyWithin()", category:"mutation", tagline:"Copy elements within array", mutates:true, returns:"The modified array (same reference)",
    description:"Copies part of an array to another location in the SAME array without changing its length. Rarely used in day-to-day code.",
    syntax:"array.copyWithin(target, start?, end?)",
    examples:[
      { title:"Basic copyWithin", code:`const arr = [1, 2, 3, 4, 5];\narr.copyWithin(0, 3); // copy from index 3 → position 0\n\nconsole.log(arr); // [4, 5, 3, 4, 5]` },
    ],
    tip:"copyWithin() is useful for typed arrays and performance-sensitive low-level code." },
];

/* ─── SYNTAX COLORIZER ──────────────────────────────────────────────── */
function CodeBlock({ code, title }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  const colorized = code.split("\n").map((line, i) => {
    if (line.trimStart().startsWith("//") || line.trimStart().startsWith("#")) {
      return <div key={i} style={{ color: "#6e7681" }}>{line}</div>;
    }
    const html = line
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/('.*?'|`[^`]*`)/g, '<span style="color:#a5d6ff">$1</span>')
      .replace(/\b(\d+)\b/g, '<span style="color:#f0883e">$1</span>')
      .replace(/\b(const|let|var|function|return|for|of|in|if|else|new|true|false|undefined|null|class|import|export|default|async|await|from)\b/g, '<span style="color:#ff7b72">$1</span>')
      .replace(/(console)\.(log|error|warn)/g, '<span style="color:#d2a8ff">$1</span>.<span style="color:#79c0ff">$2</span>')
      .replace(/(?<![a-zA-Z])\.([a-zA-Z]+)\(/g, '.<span style="color:#d2a8ff">$1</span>(')
      .replace(/=&gt;/g, '<span style="color:#ff7b72">=></span>');
    return <div key={i} dangerouslySetInnerHTML={{ __html: html }} />;
  });

  return (
    <div style={{ background:"#0d0d14", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"10px", overflow:"hidden" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 14px", borderBottom:"1px solid rgba(255,255,255,0.05)", background:"rgba(255,255,255,0.02)" }}>
        <div style={{ display:"flex", gap:"6px" }}>
          {["#ff5f56","#ffbd2e","#27c93f"].map((c,i) => (
            <div key={i} style={{ width:10, height:10, borderRadius:"50%", background:c }} />
          ))}
        </div>
        {title && <span style={{ fontFamily:"monospace", fontSize:11, color:"#555566", letterSpacing:"0.04em" }}>{title}</span>}
        <button onClick={copy} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:6, padding:"3px 10px", color: copied ? "#4ade80" : "#555566", fontSize:11, fontFamily:"monospace", cursor:"pointer" }}>
          {copied ? "✓ Copied!" : "Copy"}
        </button>
      </div>
      <pre style={{ margin:0, padding:"14px 16px", overflowX:"auto", fontSize:13, lineHeight:1.7, fontFamily:"'Space Mono', 'Courier New', monospace", color:"#c9d1d9" }}>
        <code>{colorized}</code>
      </pre>
    </div>
  );
}

/* ─── DETAIL PANEL ──────────────────────────────────────────────────── */
function DetailPanel({ method, onClose }) {
  const [activeType, setActiveType] = useState(0);
  const cat = CATEGORIES.find(c => c.id === method.category);
  const color = cat?.color || "#7c6af7";

  useEffect(() => {
   
    const onKey = e => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [method.id]);

  const Section = ({ label, children }) => (
    <div style={{ marginBottom:28 }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
        <span style={{ fontSize:11, fontFamily:"monospace", color:"#444455", letterSpacing:"0.12em", textTransform:"uppercase" }}>{label}</span>
        <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.05)" }} />
      </div>
      {children}
    </div>
  );

  return (
    <div onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", backdropFilter:"blur(6px)", zIndex:200, display:"flex", justifyContent:"flex-end" }}>
      <style>{`@keyframes panelIn { from { transform:translateX(100%); opacity:0 } to { transform:translateX(0); opacity:1 } }`}</style>
      <div style={{ width:"min(620px,100vw)", height:"100vh", background:"#111118", borderLeft:"1px solid rgba(255,255,255,0.07)", overflowY:"auto", animation:"panelIn 0.22s ease", display:"flex", flexDirection:"column" }}>

        {/* Header */}
        <div style={{ padding:"24px 26px 18px", borderBottom:"1px solid rgba(255,255,255,0.06)", position:"sticky", top:0, background:"#111118", zIndex:10 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
            <div>
              <div style={{ fontFamily:"monospace", fontSize:26, fontWeight:700, color, letterSpacing:"-0.02em" }}>{method.name}</div>
              <div style={{ fontFamily:"monospace", fontSize:12, color:"#555566", marginTop:3 }}>// {method.tagline}</div>
            </div>
            <button onClick={onClose} style={{ background:"#1a1a24", border:"1px solid rgba(255,255,255,0.08)", borderRadius:8, width:34, height:34, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"#666677", fontSize:15, flexShrink:0 }}>✕</button>
          </div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {cat && <span style={{ padding:"4px 12px", borderRadius:100, fontSize:11, fontFamily:"monospace", fontWeight:600, background:`${color}18`, color, border:`1px solid ${color}30` }}>{cat.icon} {cat.label}</span>}
            <span style={method.mutates
              ? { padding:"4px 12px", borderRadius:100, fontSize:11, fontFamily:"monospace", fontWeight:600, background:"rgba(248,113,113,0.12)", color:"#f87171", border:"1px solid rgba(248,113,113,0.25)" }
              : { padding:"4px 12px", borderRadius:100, fontSize:11, fontFamily:"monospace", fontWeight:600, background:"rgba(74,222,128,0.1)", color:"#4ade80", border:"1px solid rgba(74,222,128,0.2)" }}>
              {method.mutates ? "⚡ Mutates original" : "✓ Pure (no mutation)"}
            </span>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding:"24px 26px", flex:1 }}>
          <Section label="Description">
            <p style={{ color:"#8888aa", fontSize:14, lineHeight:1.8, margin:0 }}>{method.description}</p>
          </Section>

          <Section label="Syntax">
            <div style={{ background:"rgba(124,106,247,0.08)", border:"1px solid rgba(124,106,247,0.2)", borderRadius:10, padding:"12px 16px", fontFamily:"monospace", fontSize:13, color:"#c9b8ff", overflowX:"auto", whiteSpace:"pre" }}>
              {method.syntax}
            </div>
          </Section>

          <Section label="Returns">
            <div style={{ background:"#1a1a24", borderRadius:8, padding:"10px 14px", fontFamily:"monospace", fontSize:13, display:"flex", gap:10, alignItems:"center" }}>
              <span style={{ color:"#333344" }}>→</span>
              <span style={{ color:"#c9d1d9" }}>{method.returns}</span>
            </div>
          </Section>

          {method.types?.length > 0 && (
            <Section label="Types / Use Cases">
              <div style={{ background:"#1a1a24", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, overflow:"hidden" }}>
                <div style={{ display:"flex", overflowX:"auto", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
                  {method.types.map((t, i) => (
                    <button key={i} onClick={() => setActiveType(i)}
                      style={{ padding:"9px 16px", fontSize:12, fontFamily:"monospace", cursor:"pointer", whiteSpace:"nowrap", background: activeType===i ? `${color}12` : "none", color: activeType===i ? color : "#555566", borderBottom:`2px solid ${activeType===i ? color : "transparent"}`, border:"none", transition:"all 0.15s" }}>
                      {t.name}
                    </button>
                  ))}
                </div>
                <div style={{ padding:14 }}>
                  <CodeBlock code={method.types[activeType].code} />
                </div>
              </div>
            </Section>
          )}

          {method.examples?.length > 0 && (
            <Section label="Examples">
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                {method.examples.map((ex, i) => (
                  <div key={i}>
                    <div style={{ fontFamily:"monospace", fontSize:11, color:"#444455", marginBottom:8, letterSpacing:"0.04em" }}>
                      Example {i+1}: {ex.title}
                    </div>
                    <CodeBlock code={ex.code} title={ex.title} />
                  </div>
                ))}
              </div>
            </Section>
          )}

          {method.tip && (
            <Section label="Pro Tip">
              <div style={{ background:"rgba(251,191,36,0.06)", border:"1px solid rgba(251,191,36,0.2)", borderRadius:10, padding:"12px 16px", display:"flex", gap:10 }}>
                <span style={{ fontSize:16, flexShrink:0 }}>💡</span>
                <p style={{ fontSize:13, color:"#fbbf24cc", lineHeight:1.7, margin:0 }}>{method.tip}</p>
              </div>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── METHOD CARD ───────────────────────────────────────────────────── */
function MethodCard({ method, onClick }) {
  const [hovered, setHovered] = useState(false);
  const cat = CATEGORIES.find(c => c.id === method.category);
  const color = cat?.color || "#7c6af7";

  return (
    <div onClick={() => onClick(method)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:"#111118", borderRadius:14, padding:"20px 22px", cursor:"pointer",
        border:`1px solid ${hovered ? color + "44" : "rgba(255,255,255,0.07)"}`,
        transform: hovered ? "translateY(-3px)" : "none",
        boxShadow: hovered ? `0 14px 40px rgba(0,0,0,0.4), 0 0 0 1px ${color}18` : "none",
        transition:"all 0.2s ease", position:"relative", overflow:"hidden",
        display:"flex", flexDirection:"column", gap:10,
      }}>
      {/* Top bar */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg, ${color} 0%, transparent 80%)`, borderRadius:"14px 14px 0 0" }} />
      {/* Glow */}
      {hovered && <div style={{ position:"absolute", inset:0, background:`radial-gradient(circle at top left, ${color}0d 0%, transparent 60%)`, pointerEvents:"none", borderRadius:14 }} />}

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8 }}>
        <span style={{ fontFamily:"monospace", fontSize:15, fontWeight:700, color, letterSpacing:"-0.01em" }}>{method.name}</span>
        <div style={{ display:"flex", gap:5, flexWrap:"wrap", justifyContent:"flex-end", flexShrink:0 }}>
          <span style={method.mutates
            ? { fontSize:9, fontFamily:"monospace", padding:"2px 7px", borderRadius:100, fontWeight:700, letterSpacing:"0.06em", background:"rgba(248,113,113,0.12)", color:"#f87171", border:"1px solid rgba(248,113,113,0.2)" }
            : { fontSize:9, fontFamily:"monospace", padding:"2px 7px", borderRadius:100, fontWeight:700, letterSpacing:"0.06em", background:"rgba(74,222,128,0.1)", color:"#4ade80", border:"1px solid rgba(74,222,128,0.2)" }}>
            {method.mutates ? "MUTATES" : "PURE"}
          </span>
          {cat && <span style={{ fontSize:9, fontFamily:"monospace", padding:"2px 7px", borderRadius:100, fontWeight:600, background:`${color}18`, color, border:`1px solid ${color}30` }}>{cat.icon} {cat.label}</span>}
        </div>
      </div>

      <p style={{ fontFamily:"monospace", fontSize:12, color:"#555566", margin:0 }}>// {method.tagline}</p>

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:10, borderTop:"1px solid rgba(255,255,255,0.04)", marginTop:"auto" }}>
        <span style={{ fontSize:11, fontFamily:"monospace", color:"#333344" }}>
          <span>returns </span><span style={{ color:"#555566" }}>{method.returns}</span>
        </span>
        <span style={{ color: hovered ? color : "#333344", transition:"color 0.2s, transform 0.2s", transform: hovered ? "translateX(3px)" : "none", fontSize:13 }}>→</span>
      </div>
    </div>
  );
}

/* ─── MAIN APP ──────────────────────────────────────────────────────── */
export default function App() {
  const [search, setSearch]           = useState("");
  const [activeCategory, setCategory] = useState(null);
  const [selected, setSelected]       = useState(null);

  const counts = useMemo(() => {
    const c = {};
    METHODS.forEach(m => { c[m.category] = (c[m.category] || 0) + 1; });
    return c;
  }, []);

  const filtered = useMemo(() => {
    let list = METHODS;
    if (activeCategory) list = list.filter(m => m.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.tagline.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [search, activeCategory]);

  return (
    <div style={{ minHeight:"100vh", background:"#0a0a0f", color:"#f0f0ff", fontFamily:"'Syne', 'Segoe UI', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #111118; }
        ::-webkit-scrollbar-thumb { background: #222233; border-radius: 3px; }
      `}</style>

      {/* Hero Header */}
      <header style={{ padding:"36px 40px 28px", borderBottom:"1px solid rgba(255,255,255,0.05)", background:"linear-gradient(180deg, rgba(124,106,247,0.05) 0%, transparent 100%)", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"-60px", left:"50%", transform:"translateX(-50%)", width:700, height:180, background:"radial-gradient(ellipse, rgba(124,106,247,0.12) 0%, transparent 70%)", pointerEvents:"none" }} />
        <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16, position:"relative" }}>
          <div>
            <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(124,106,247,0.15)", border:"1px solid rgba(124,106,247,0.3)", borderRadius:100, padding:"4px 12px", fontSize:11, fontFamily:"monospace", color:"#a78bfa", marginBottom:10, letterSpacing:"0.08em" }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:"#7c6af7", boxShadow:"0 0 6px #7c6af7" }} />
              JavaScript Reference
            </div>
            <h1 style={{ fontSize:"clamp(28px,4vw,44px)", fontWeight:800, letterSpacing:"-0.025em", lineHeight:1.1, background:"linear-gradient(135deg, #f0f0ff 30%, #a78bfa 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              Array Methods
            </h1>
            <p style={{ marginTop:8, color:"#444455", fontSize:13, fontFamily:"monospace" }}>// master every built-in array operation in JavaScript</p>
          </div>
          <div style={{ display:"flex", gap:28, alignItems:"center" }}>
            {[{ n: METHODS.length, l: "Methods" }, { n: CATEGORIES.length, l: "Categories" }].map((s, i) => (
              <div key={i} style={{ textAlign:"center" }}>
                <div style={{ fontSize:32, fontWeight:800, color:"#f0f0ff", lineHeight:1 }}>{s.n}</div>
                <div style={{ fontSize:11, color:"#333344", fontFamily:"monospace", marginTop:4, letterSpacing:"0.06em", textTransform:"uppercase" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Main */}
      <main style={{ maxWidth:1200, margin:"0 auto", padding:"32px 40px" }}>

        {/* Toolbar */}
        <div style={{ marginBottom:24 }}>
          <div style={{ display:"flex", alignItems:"center", gap:14, flexWrap:"wrap", marginBottom:14 }}>
            {/* Search */}
            <div style={{ position:"relative", width:"min(420px, 100%)" }}>
              <span style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:"#333344", fontSize:15, fontFamily:"monospace", pointerEvents:"none" }}>⌕</span>
              <input type="text" placeholder="Search methods..." value={search} onChange={e => setSearch(e.target.value)}
                style={{ width:"100%", background:"#111118", border:"1px solid rgba(255,255,255,0.07)", borderRadius:10, padding:"10px 36px 10px 38px", color:"#f0f0ff", fontSize:14, outline:"none", fontFamily:"'Syne', sans-serif" }}
                onFocus={e => { e.target.style.borderColor="rgba(124,106,247,0.5)"; e.target.style.boxShadow="0 0 0 3px rgba(124,106,247,0.08)"; }}
                onBlur={e => { e.target.style.borderColor="rgba(255,255,255,0.07)"; e.target.style.boxShadow="none"; }}
              />
              {search && <button onClick={() => setSearch("")} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"#1a1a24", border:"none", borderRadius:"50%", width:20, height:20, cursor:"pointer", color:"#444455", fontSize:11, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>}
            </div>
          </div>

          {/* Category filters */}
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {[{ id:null, label:"All", icon:"", color:"#7c6af7" }, ...CATEGORIES].map(cat => {
              const isActive = activeCategory === cat.id;
              const count = cat.id === null ? METHODS.length : (counts[cat.id] || 0);
              return (
                <button key={cat.id ?? "all"} onClick={() => setCategory(isActive && cat.id !== null ? null : cat.id)}
                  style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 13px", borderRadius:100, fontSize:12, fontWeight:600, cursor:"pointer", transition:"all 0.15s", fontFamily:"'Syne', sans-serif", letterSpacing:"0.02em", whiteSpace:"nowrap",
                    background: isActive ? `${cat.color}22` : "#111118",
                    border:`1px solid ${isActive ? cat.color + "55" : "rgba(255,255,255,0.07)"}`,
                    color: isActive ? cat.color : "#444455",
                  }}>
                  {cat.icon && <span style={{ fontSize:12 }}>{cat.icon}</span>}
                  <span>{cat.label}</span>
                  <span style={{ background:"rgba(255,255,255,0.06)", borderRadius:100, padding:"1px 6px", fontSize:10, fontFamily:"monospace" }}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results count */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, padding:"0 2px" }}>
          <span style={{ fontFamily:"monospace", fontSize:12, color:"#333344" }}>{filtered.length} method{filtered.length !== 1 ? "s" : ""} found</span>
          <span style={{ fontFamily:"monospace", fontSize:12, color:"#333344" }}>Click any card to explore →</span>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign:"center", padding:"80px 20px", color:"#333344", fontFamily:"monospace", fontSize:14 }}>
            <div style={{ fontSize:40, marginBottom:16 }}>🔍</div>
            No methods match your search. Try a different term.
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(290px, 1fr))", gap:14 }}>
            {filtered.map(m => <MethodCard key={m.id} method={m} onClick={setSelected} />)}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ padding:"22px 40px", borderTop:"1px solid rgba(255,255,255,0.04)", display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:12, marginTop:20 }}>
        <span style={{ fontFamily:"monospace", fontSize:11, color:"#2a2a35" }}>array-methods.js · JavaScript ES2024 Reference</span>
        <div style={{ display:"flex", gap:18, flexWrap:"wrap" }}>
          {[["#f87171","Mutates original"],["#4ade80","Pure / no mutation"],["#333344","Press ESC to close panel"]].map(([c,l],i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, fontFamily:"monospace", color:"#2a2a35" }}>
              <div style={{ width:8, height:8, borderRadius:2, background:c }} />{l}
            </div>
          ))}
        </div>
      </footer>

      {/* Detail panel */}
      {selected && <DetailPanel method={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
