---
templateKey: blog-post
title: Everything I Know About JavaScript Promises
date: 2019-09-19T17:35:27.500Z
---
I had to give a little talk about ES6 promises a while back and was forced to organize my thoughts and learn a few things so I thought I might as well share the wealth.  This is a progressive introduction to promises starting from the previous status quo (callbacks), then talking about basic usage, tips and tricks, and `async/await`.

This guide sort of assumes you already know how callbacks work and does not explain them very well.

# Why Promises?
Promises are meant to be an easy API for handling async operations such as:

- Network requests
- Database queries
- User input

Basically, when you have some code that should only run when some other code has finished, and maybe needs some data from that previous code.

# Using Promises
Before promises, async operations were usually handled with a callback pattern, which looks like this:
```
// Callback pattern
doSomethingThatTakesAWhile((result) => {
  console.log(result);
});
```
where the function `doSomethingThatTakesAWhile` takes a while, and when it's done, it now has some data, and it runs the unnamed function passed to it as an argument, passing the new data into it:
```
(result) => {
  console.log(result);
}
```
A promise that did the same thing would look like this:
```// Promise pattern
doSomethingThatTakesAWhile()
  .then(result => {
    console.log(result);
  });
```
