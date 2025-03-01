---
order: 1
briefTitle: 'JavaScript'
briefDescription: '通过这些问题测试、评估和提高你的JavaScript知识。'
title: 'JavaScript 题目'
description: '通过这些问题测试、评估和提高你的JavaScript知识。'
isNew: false
seo:
  title: 'JavaScript 题目'
  description: 'Curated list of JavaScript questions to test, rate and improve your knowledge. Questions are based on real world experience and knowledge.'
  keywords:
    - 'javascript quiz'
    - 'javascript questions'
    - 'javascript interview questions'
    - 'javascript interview'
    - 'javascript test'
sitemap:
  priority: 1
  changefreq: 'monthly'
questions:
  - question: JavaScript是什么?
    answer: JavaScript（通常缩写为JS）是一种高级、通用、广泛使用的编程语言，主要以其在web开发中的作用而闻名。它使网站上的互动和动态行为成为可能。.
    topics:
      - '核心'
      - '入门'
  - question: What is the difference between `var`, `let`, and `const` in JavaScript?
    answer: In JavaScript, `var` is function-scoped and was traditionally used to declare variables. `let` and `const` are block-scoped. The key difference between `let` and `const` is that `let` allows for reassignment while `const` creates a read-only reference.
    topics:
      - '核心'
      - '入门'
  - question: What is the difference between `null` and `undefined`?
    answer: The `null` is an assignment value. It can be assigned to a variable as a representation of no value. But the `undefined` is a primitive value that represents the absence of a value, or a variable that has not been assigned a value.
    topics:
      - '核心'
      - '入门'
  - question: What is the difference between `==` and `===`?
    answer: equality-operator.md
    topics:
      - '核心'
      - '入门'
  - question: What are the different ways to declare a variable in JavaScript?
    answer: There are three ways to declare a variable in JavaScript `var`, `let`, and `const`.
    topics:
      - '核心'
      - '中等'
  - question: What are Scopes in JavaScript?
    answer: A scope is a set of variables, objects, and functions that you have access to. There are three types of scopes in JavaScript. Which are Global Scope, Function Scope (Local Scope), and Block Scope.
    topics:
      - '核心'
      - '中等'
  - question: What is ternary operator in JavaScript?
    answer: ternary-operator.md
    topics:
      - '核心'
      - '中等'
  - question: How to implement your own Custom Event in JavaScript?
    answer: custom-event.md
    topics:
      - 'Event'
      - '进阶'
  - question: What is a closure in JavaScript?
    answer: closure.md
    topics:
      - '核心'
      - '进阶'
  - question: Does Arrow functions have their own `this`?
    answer: No, arrow functions do not have their own `this`. Instead, they inherit the `this` of the enclosing lexical scope.
    topics:
      - 'Function'
      - '中等'
  - question: Does `map()` method mutate the original array?
    answer: map-method.md
    topics:
      - '核心'
      - '中等'
  - question: Does `forEach()` method return a new array?
    answer: for-each-method.md
    topics:
      - '核心'
      - '中等'
  - question: How to use `filter()` method?
    answer: filter-method.md
    topics:
      - '核心'
      - '中等'
  - question: What is the difference between `map()` and `forEach()` methods?
    answer: The `map()` method creates a new array with the results of calling a provided function on every element in the calling array. Whereas, the `forEach()` method executes a provided function once for each array element.
    topics:
      - '核心'
      - '中等'
  - question: How to use `reduce()` method?
    answer: reduce-method.md
    topics:
      - '核心'
      - '中等'
  - question: What is the difference between `map()` and `reduce()` methods?
    answer: The `map()` method creates a new array with the results of calling a provided function on every element in the calling array. Whereas, the `reduce()` method executes a reducer function (that you provide) on each element of the array, resulting in a single output value.
    topics:
      - '核心'
      - '中等'
  - question: What is Prototype Chain in JavaScript?
    answer: prototype-chain.md
    topics:
      - 'OOP'
      - '进阶'
  - question: What is IIFE in JavaScript?
    answer: iife.md
    topics:
      - 'Function'
      - '进阶'
  - question: What is Inheritance in JavaScript?
    answer: inheritance.md
    topics:
      - 'OOP'
      - '进阶'
  - question: What is Map in JavaScript?
    answer: map.md
    topics:
      - 'Date Type'
      - '入门'
  - question: What is Set in JavaScript?
    answer: set.md
    topics:
      - 'Data Type'
      - '入门'
  - question: How you can find unique values in an array?
    answer: find-unique-array-values.md
    topics:
      - '核心'
      - '中等'
  - question: What is a JavaScript promise?
    answer: A Promise in JavaScript represents a value that may not be available yet but will be at some point. Promises provide a way to handle asynchronous operations, offering methods like `.then()` and `.catch()` to register callbacks for success and failure.
    topics:
      - 'Promise'
      - '进阶'
  - question: What is the purpose of the `async/await` in JavaScript?
    answer: The `async/await`, introduced in ES2017, provides a more readable and cleaner way to handle asynchronous operations compared to callbacks and promises. An `async` function always returns a promise, and within such a function, you can use `await` to pause execution until a promise settles.
    topics:
      - 'Promise'
      - '进阶'
  - question: What is callback hell in JavaScript?
    answer: callback-hell.md
    topics:
      - '核心'
      - '进阶'
  - question: How to enable strict mode in JavaScript?
    answer: To enable strict mode in JavaScript, you need to add the following line at the top of the file or function `'use strict';`.
    topics:
      - '核心'
      - '入门'
  - question: Explain `alert()`, `prompt()`, and `confirm()` methods in JavaScript?
    answer: alert-prompt-confirm.md
    topics:
      - 'Event'
      - '中等'
  - question: How to handle event bubbling in JavaScript?
    answer: event-bubbling.md
    topics:
      - 'Event'
      - '入门'
  - question: What is Event Capturing in JavaScript?
    answer: Event capturing is the first phase of event propagation. In this phase, the event is captured by the outermost element and propagated to the inner elements. It is also known as trickling. It is the opposite of event bubbling.
    topics:
      - 'Event'
      - '入门'
  - question: What is the spread operator in JavaScript?
    answer: spread-operator.md
    topics:
      - '核心'
      - '中等'
  - question: Is Java and JavaScript the same?
    answer: No, Java and JavaScript are distinct languages. Their similarity in name is coincidental, much like `car` and `carpet`. Java is often used for backend and mobile apps, while JavaScript powers web interactivity and backend.
    topics:
      - '核心'
      - '入门'
  - question: What is `preventDefault()` method in JavaScript?
    answer: prevent-default.md
    topics:
      - 'Event'
      - '中等'
  - question: What is Hoisting in JavaScript?
    answer: hoisting.md
    topics:
      - '核心'
      - '中等'
  - question: What is DOM?
    answer: The Document Object Model (DOM) is a programming interface for HTML and XML documents. It represents the page so that programs can change the document structure, style, and content. The DOM represents the document as nodes and objects.
    topics:
      - 'DOM'
      - '入门'
  - question: Difference between `Promise.all()` and `Promise.allSettled()`?
    answer: promise-all-vs-all-settled.md
    topics:
      - 'Promise'
      - '进阶'
  - question: What is the difference between `Map` and `WeakMap` in JavaScript?
    answer: The `Map` object holds key-value pairs and remembers the original insertion order of the keys. Whereas, the `WeakMap` object is a collection of key/value pairs in which the keys are weakly referenced. You can use any data type as a key or value in a `Map` whereas in `WeakMap` you can only use objects as keys. The `WeakMap` is not iterable whereas `Map` is. In `WeakMap` it holds the weak reference to the original object which means if there are no other references to an object stored in the `WeakMap`, those objects can be garbage collected.
    topics:
      - 'Data Type'
      - '进阶'
  - question: Garbage collection in JavaScript?
    answer: The JavaScript engine uses automatic garbage collection. JavaScript automatically manages memory by freeing up space used by objects no longer needed. This algorithm is called Mark and Sweep, which is performed periodically by the JavaScript engine.
    topics:
      - '核心'
      - '进阶'
  - question: How to make an Object immutable in JavaScript?
    answer: immutable-object.md
    topics:
      - '核心'
      - '进阶'
  - question: What is Type Casting?
    answer: Type conversion (or typecasting) means transfer of data from one data type to another. Implicit conversion happens when the compiler (for compiled languages) or runtime (for script languages like `JavaScript`) automatically converts data types.
    topics:
      - 'Data Type'
      - '中等'
  - question: What are Explicit binding in JavaScript?
    answer: explicit-binding.md
    topics:
      - 'Function'
      - '进阶'
  - question: How to run a piece of code after a specific time interval?
    answer: set-interval.md
    topics:
      - '核心'
      - '入门'
  - question: How to run a piece of code only once after a specific time?
    answer: set-timeout.md
    topics:
      - '核心'
      - '入门'
  - question: What are Labelled Statements in JavaScript?
    answer: labelled-statements.md
    topics:
      - '核心'
      - '中等'
  - question: Difference between `defer` and `async` attributes in JavaScript?
    answer: defer-vs-async.md
    topics:
      - '核心'
      - '入门'
  - question: What is Increment operator in JavaScript?
    answer: increment-operator.md
    topics:
      - '核心'
      - '入门'
  - question: How to accept variable number of arguments in a JavaScript function?
    answer: variable-number-of-arguments.md
    topics:
      - 'Function'
      - '中等'
  - question: How to define multiline strings in JavaScript?
    answer: In order to define multiline strings in JavaScript, you need to use template literals. Template literals are enclosed by the backtick (```` ` ` ````) character instead of double or single quotes. Template literals can contain placeholders. These are indicated by the dollar sign and curly braces (``` `${expression}` ```).
    topics:
      - '核心'
      - '入门'
  - question: Uses of `break` and `continue` statements in JavaScript?
    answer: break-and-continue.md
    topics:
      - 'Loop'
      - '入门'
  - question: How to parse JSON in JavaScript?
    answer: parse-json.md
    topics:
      - '核心'
      - '入门'
  - question: How to debug JavaScript code?
    answer: debug-javascript.md
    topics:
      - 'Debug'
      - '入门'
  - question: How to handle error in Promise?
    answer: error-in-promise.md
    topics:
      - 'Promise'
      - '进阶'
  - question: How to handle error in async/await?
    answer: error-in-async-await.md
    topics:
      - 'Promise'
      - '进阶'
  - question: How to use `finally` block in Promise?
    answer: finally-block-in-promise.md
    topics:
      - 'Promise'
      - '进阶'
  - question: Asynchronous vs Synchronous code?
    answer: async-vs-sync.md
    topics:
      - '核心'
      - '入门'
  - question: What is Event Loop in JavaScript?
    answer: The Event loop is one the most important aspect to understand in JavaScript. It is the mechanism that allows JavaScript to perform non-blocking operations. It is the reason why we can use asynchronous code in JavaScript. The Event loop is a loop that constantly checks if there are any tasks that need to be executed. If there are, it will execute them. If there are no tasks to execute, it will wait for new tasks to arrive.
    topics:
      - '核心'
      - '进阶'
  - question: How does Event Loop work in JavaScript?
    answer: event-loop.md
    topics:
      - '核心'
      - '进阶'
  - question: Is it possible to run JavaScript outside the browser?
    answer: Yes, it is possible to run JavaScript outside the browser. There are several ways to run JavaScript outside the browser. You can use **Node.js**, **Deno**, **Bun**, or any other JavaScript runtime environment.
    topics:
      - '核心'
      - '入门'
  - question: Is it possible to run 2 lines of code at the same time in JavaScript?
    answer: No, it is not possible to run 2 lines of code at the same time in JavaScript. JavaScript is a single-threaded language, which means that it can only execute one line of code at a time. However, it is possible to run 2 lines of code at the same time using asynchronous code.
    topics:
      - '核心'
      - '入门'
  - question: Is JavaScript a compiled or interpreted language?
    answer: JavaScript is an interpreted language. This means that the JavaScript code is not compiled before it is executed. Instead, the JavaScript engine interprets the code at runtime.
    topics:
      - '核心'
      - '入门'
  - question: Are references copied in JavaScript?
    answer: No, references are not copied in JavaScript. When you assign an object to a variable, the variable will contain a reference to the object. If you assign the variable to another variable, the second variable will also contain a reference to the object. If you change the object using one of the variables, the change will be visible using the other variable.
    topics:
      - '核心'
      - '中等'
  - question: What are Heap and Stack in JavaScript?
    answer: heap-and-stack.md
    topics:
      - '核心'
      - '进阶'
  - question: What is Comma Operator in JavaScript?
    answer: comma-operator.md
    topics:
      - 'Operator'
      - '中等'
  - question: What is Nullish Coalescing Operator?
    answer: nullish-coalescing-operator.md
    topics:
      - 'Operator'
      - '入门'
  - question: What are the Logical Operators in JavaScript?
    answer: logical-operators.md
    topics:
      - 'Operator'
      - '入门'
  - question: How to create Infinite Loop in JavaScript?
    answer: infinite-loop.md
    topics:
      - '核心'
      - '入门'
  - question: How to use `do...while` loop in JavaScript?
    answer: do-while-loop.md
    topics:
      - '核心'
      - '入门'
  - question: Switch case statement in JavaScript?
    answer: switch-case.md
    topics:
      - '核心'
      - '入门'
  - question: How to select DOM elements using `querySelector()` and `querySelectorAll()`?
    answer: query-selector.md
    topics:
      - 'DOM'
      - '入门'
  - question: How to create a new Element in DOM?
    answer: create-element.md
    topics:
      - 'DOM'
      - '入门'
  - question: Difference between `appendChild()` and `insertBefore()`?
    answer: append-child-vs-insert-before.md
    topics:
      - 'DOM'
      - '入门'
  - question: How to remove an Element from DOM?
    answer: remove-element.md
    topics:
      - 'DOM'
      - '入门'
  - question: How to scroll to the top of the page using JavaScript?
    answer: scroll-to-top.md
    topics:
      - 'DOM'
      - '入门'
  - question: How to measure dimensions of an Element?
    answer: measure-dimensions.md
    topics:
      - 'DOM'
      - '入门'
  - question: Can you merge multiple arrays in JavaScript?
    answer: merge-arrays.md
    topics:
      - '核心'
      - '中等'
  - question: How to get viewport dimensions in JavaScript?
    answer: You can use `window.innerWidth` and `window.innerHeight` to get the viewport dimensions.
    topics:
      - 'DOM'
      - '入门'
---
