import type { DailyChallenge } from "./types";

// 7 rotating challenges — one per day of the week
export const DAILY_CHALLENGES: DailyChallenge[] = [
  {
    id: "mon-fizzbuzz",
    title: "Monday: FizzBuzz",
    prompt: "Print numbers 1 to 50. For multiples of 3, print 'Fizz'. For multiples of 5, print 'Buzz'. For multiples of both, print 'FizzBuzz'.",
    starterCode: `// Print numbers 1 to 50 with FizzBuzz rules
for (let i = 1; i <= 50; i++) {
  // Your code here
  console.log(i);
}`,
    language: "javascript",
    hint: "Use the modulo operator (%) to check divisibility. Check both 3 and 5 first.",
    solution: `for (let i = 1; i <= 50; i++) {
  if (i % 15 === 0) console.log("FizzBuzz");
  else if (i % 3 === 0) console.log("Fizz");
  else if (i % 5 === 0) console.log("Buzz");
  else console.log(i);
}`,
    difficulty: 1,
  },
  {
    id: "tue-reverse-string",
    title: "Tuesday: Reverse a String",
    prompt: "Write a function that reverses a string without using the built-in reverse() method.",
    starterCode: `function reverseString(str) {
  // Your code here
  return str;
}

console.log(reverseString("hello"));  // should print "olleh"`,
    language: "javascript",
    hint: "You can use a loop, or split into array, swap, and join.",
    solution: `function reverseString(str) {
  let reversed = "";
  for (let i = str.length - 1; i >= 0; i--) {
    reversed += str[i];
  }
  return reversed;
}

console.log(reverseString("hello"));  // "olleh"`,
    difficulty: 2,
  },
  {
    id: "wed-palindrome",
    title: "Wednesday: Palindrome Check",
    prompt: "Write a function that returns true if a string is a palindrome (reads the same forwards and backwards), ignoring case and spaces.",
    starterCode: `function isPalindrome(str) {
  // Your code here
  return false;
}

console.log(isPalindrome("Racecar"));      // true
console.log(isPalindrome("hello"));         // false
console.log(isPalindrome("A man a plan a canal Panama"));  // true`,
    language: "javascript",
    hint: "Lowercase the string, remove non-alphanumeric characters, then compare to its reverse.",
    solution: `function isPalindrome(str) {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, "");
  return cleaned === cleaned.split("").reverse().join("");
}

console.log(isPalindrome("Racecar"));      // true
console.log(isPalindrome("hello"));         // false
console.log(isPalindrome("A man a plan a canal Panama"));  // true`,
    difficulty: 2,
  },
  {
    id: "thu-factorial",
    title: "Thursday: Factorial",
    prompt: "Write a function that computes the factorial of a number (n! = n * (n-1) * ... * 1). Try both iterative and recursive versions.",
    starterCode: `function factorial(n) {
  // Your code here
  return 1;
}

console.log(factorial(5));  // 120
console.log(factorial(0));  // 1`,
    language: "javascript",
    hint: "Iterative: use a loop. Recursive: base case is n === 0 returns 1.",
    solution: `// Iterative
function factorial(n) {
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

// Recursive
function factorialRecursive(n) {
  if (n <= 1) return 1;
  return n * factorialRecursive(n - 1);
}

console.log(factorial(5));  // 120
console.log(factorial(0));  // 1`,
    difficulty: 2,
  },
  {
    id: "fri-find-max",
    title: "Friday: Find the Maximum",
    prompt: "Write a function that finds the largest number in an array without using Math.max().",
    starterCode: `function findMax(arr) {
  // Your code here
  return 0;
}

console.log(findMax([3, 1, 4, 1, 5, 9, 2, 6]));  // 9
console.log(findMax([-5, -2, -9]));              // -2`,
    language: "javascript",
    hint: "Initialize with the first element, then iterate and compare.",
    solution: `function findMax(arr) {
  if (arr.length === 0) return undefined;
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) max = arr[i];
  }
  return max;
}

console.log(findMax([3, 1, 4, 1, 5, 9, 2, 6]));  // 9
console.log(findMax([-5, -2, -9]));              // -2`,
    difficulty: 2,
  },
  {
    id: "sat-anagram",
    title: "Saturday: Anagram Check",
    prompt: "Write a function that returns true if two strings are anagrams of each other (same letters, different order).",
    starterCode: `function isAnagram(str1, str2) {
  // Your code here
  return false;
}

console.log(isAnagram("listen", "silent"));    // true
console.log(isAnagram("hello", "world"));      // false`,
    language: "javascript",
    hint: "Sort both strings' characters and compare, or count character frequencies.",
    solution: `function isAnagram(str1, str2) {
  const normalize = s => s.toLowerCase().split("").sort().join("");
  return normalize(str1) === normalize(str2);
}

console.log(isAnagram("listen", "silent"));    // true
console.log(isAnagram("hello", "world"));      // false`,
    difficulty: 3,
  },
  {
    id: "sun-prime",
    title: "Sunday: Prime Numbers",
    prompt: "Write a function that returns all prime numbers up to N. A prime is a number > 1 with no divisors other than 1 and itself.",
    starterCode: `function primesUpTo(n) {
  // Your code here
  return [];
}

console.log(primesUpTo(20));  // [2, 3, 5, 7, 11, 13, 17, 19]`,
    language: "javascript",
    hint: "For each number, check if it's divisible by any smaller number up to its square root.",
    solution: `function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }
  return true;
}

function primesUpTo(n) {
  const primes = [];
  for (let i = 2; i <= n; i++) {
    if (isPrime(i)) primes.push(i);
  }
  return primes;
}

console.log(primesUpTo(20));  // [2, 3, 5, 7, 11, 13, 17, 19]`,
    difficulty: 3,
  },
];

export function getTodayChallenge(): DailyChallenge {
  // Day of week: 0=Sunday, 1=Monday, ..., 6=Saturday
  // Our array starts with Monday (index 0), so map Sunday(0) -> index 6
  const dayOfWeek = new Date().getDay();
  const index = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  return DAILY_CHALLENGES[index];
}

export function getChallengeByDay(dayOfWeek: number): DailyChallenge {
  const index = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  return DAILY_CHALLENGES[index];
}
