---
templateKey: blog-post
title: Everything I Know About JavaScript Promises
date: 2019-09-19T17:35:27.500Z
---
I had to give a little talk about ES6 promises a while back and was forced to organize my thoughts and learn a few things so I thought I might as well share the wealth.  This is a progressive introduction to promises starting from the previous status quo (callbacks), then talking about basic usage, tips and tricks, and `async/await`.

# Why Promises?
Promises are meant to be an easy API for handling async operations such as:

- Network requests
- Database queries
- User input

Basically, when you have some code that should only run when some other code has finished, and maybe needs some data from that previous code.
