---
templateKey: blog-post
title: Procedurally Ruin Other People's Code Using The Magic of ASTs
date: 2019-01-24T18:00:25.539Z
---
I recently made an unexpectedly popular tweet based on the incredibly deep insight of "what if you removed a letter from a popular library?"  Specifically, what if instead of **prettier** it was **pettier**?  Hahaha!  Instead of cleaning up your code, it would belittle it, you see.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">has anyone made a JS formatter called pettier that doesn&#39;t fix any code but just leaves snarky comments like &quot;// 4 nested callbacks, really?&quot; or &quot;// wow just putting it right in the global namespace huh&quot;</p>&mdash; Christina Holland (@americanwombat) <a href="https://twitter.com/americanwombat/status/1086045699437846528?ref_src=twsrc%5Etfw">January 17, 2019</a></blockquote>

Anyway instead of getting the (at most) 5 seconds of laughs it deserved before going to the lazy joke graveyard, it took off for whatever random reason.  I'm as much of a fan of attention as the next person so I decided to implement the damn thing.

# A Teachable Moment, I Guess

And in the course of doing so, I figured, I could maybe help teach other people some of the basic concepts behind linting or formatting or otherwise screwing with source code files, and hell, maybe those people would actually **do something useful **with that skill.

Maybe it would help demystify the intimidating aura around making dev tools if I, an **idiot**, could show how one might stumble one's way through making such a tool, or enough of the scaffolding of one to give someone else the confidence to build a full-featured useful thing.

I apologize if this is more rambly than a direct set of how-to steps but as the purpose is to show how someone might go from zero (domain knowledge at least) to... well, an MVP, the journey is pretty key.

# Step 1: Where do I even start?

Look, if you are a smart computer science person I'm sure you can reason it out from first principles or it'll come to you in a dream.  But for the rest of us idiots, the best thing to do is think of some open source tool that exists that is sort of close to what you want, and then** go look at its Github repo**.

> Note: There's no reason to feel bad about stealing other people's ideas, that's the whole point of open source.  Unless they have some weird license.  Otherwise go ape.  If the bit you're stealing is very clever or unique or you're taking a large chunk verbatim, then you should probably let them know and give credit in your README.

In my case I went to the [prettier](https://github.com/prettier/prettier) repo because, duh, that's what I was ripping off in the first place.  I had heard of a thing called an **Abstract Syntax Tree (AST)** before, which is where all your code gets turned into a tree where each node is like a function or an expression or a param or an if-block or whatever.  Turning code text into an AST sounds like a pretty tall order so I assumed **prettier** probably used some other package to do it.

I was wrong, it actually used several packages to do it, because prettier works on quite a few different languages.  But one of these packages was **`@babel/parser`**, which I figured was the one I wanted for modern JavaScript.

So I started a new repo

```
mkdir pettier
cd pettier
npm init
```

enter enter enter enter enter...

and then immediately `npm install @babel/parser`

or possibly yarn add, who can remember.

Anyway, off to a great start with nary a line of code.

# Step 2: Research (Documentation and Google)

The first thing I wanted to know was of course, how does \`@babel/parser\` work.  I found the [official documentation](https://babeljs.io/docs/en/babel-parser) which was pretty clear, you go `parse.code([your code here])` and then it returns an AST.

This seemed like a good time to figure out what an AST looks like so I googled that too and found a helpful tool called [AST Explorer](https://astexplorer.net/) where you can type in some code on the left and see the AST representation on the right.  I typed in some functions and function calls and it made them all into little nodes and then I was like, okay I get the idea.  I had to come back many times during the process later to see what kind of things get turned into what kind of nodes and what properties they have but whatever, later is later.

I also googled a lot of crap like "search ASTs" or whatever, and browsed around the table of contents of the page where I found the **`@babel/parser` **documentation to see what else they got.  They had a thing called **`@babel/traverse`** which I thought was intriguing.

It traverses the tree for you, which would be really handy in a whiteboard interview, or at least provides a compelling argument for why you don't often need to implement your own recursion on the job and why can't they ask about a project you did.  You provide `traverse()` with the AST, and one or more functions called **visitors **that do stuff when they enter a node, exit a node, or enter/exit a specific type of node.

I knew I would need this because one of the things in the tweet, which I was now considering a spec, was callback depth, which I had some idea would involve traversing a tree, because I've read _Cracking the Coding Interview_.

# Step 3: Type Some Code

So I imported `@babel/traverse` and typed `traverse(` somewhere in my code and ignored the linting error while I looked up the documentation and found an example to copy.  I found an example that visited all the nodes so sure, let's go with that.

## Counting Callback Depth

At first I was thinking about some clever recursiony way to get at this, but finally I just settled for making a **visitor **that would run on exiting every node and it would bail if the node's type didn't include the string **FunctionExpression** (there's two types that represent a function reference, regular **FunctionExpression** and **ArrowFunctionExpression**).

When it found one of these, it would check the **path**, the only argument provided to traverse visitor functions, containing each node's whole path down the tree and a bunch of other metadata.  It would walk up all its ancestors, counting **CallExpression** nodes it found along the way, until it got to the top of the tree (node type "**Program**").  **CallExpression** nodes are function call expressions, and arguments are its children.

Now that I'm writing this out I'm pretty sure I did something wrong and it's going to catch some steps that aren't callbacks.  Oh well.  I'll figure it out at some point.

## Counting Function Lines

This one wasn't as weird and would be a terrible interview question.  I added an visitor to `traverse` that would run on nodes of type **FunctionDeclaration** which contains all the code for declaring and implementing a function.

I clicked around in the ol' AST Explorer and found that all nodes have a field called `loc`, which contains a `start` and `end`, which each contain a `line` and `column`.  So the current node is `path.node` so

```
const length = path.node.loc.end.line - path.node.loc.start.line;
```

et voila, function length.  Then I just write a big old `if-else` block to say different mean things at different ranges.

# Step 4: The Thing You Thought Was Gonna Work Isn't Gonna Work

Since I was just grabbing babel libraries left and right and they were doing all the work for me, I figured I could keep going with it when it came time to output code with snarky comments.  I had inserted the comments as comment nodes attached to whatever line they were about, and it was time to turn the AST back into lines.

The tool that does that is `@babel/generator` where you just go `generate(ast)` and poof! it returns code text.

Unfortunately all the whitespacing is all weird, especially around preexisting comments.  Which totally makes sense because the whole main point of babel is to generate usable working code for production, not formatting.  That's what **prettier** is for.

So what does **prettier** do?  Again, open source is wonderful, I went and looked at it.  Unfortunately they implement the formatting themselves.  Which again makes sense because that is the main point of that library, so you'd want full control over it.  I'm saying it's unfortunate for me because I'm too dumb to understand the details of how they did it and do my own version.

> If you are making a tool to change code functionality though, so the appearance of the resulting code doesn't really matter, @babel/generate is a great way to go. It even minifies and does source maps and stuff.

# Step 5: Just Do Whatever Works

Instead I just put all the locations (`start.line`, `start.column`) of all the offending lines in a `Map` as I found them and then at the end I went through all the lines of the original code and inserted them in.  Is this the best way to do it? Probably not!

But you know what, when I run it on the command line, it makes a new file with all my dumb words in the right place.  So whatevs.

# Step 6: Go Public

I only recommend this if you're publishing a joke library or you're trying to impress someone you have a date with tomorrow and you want to be able to pull the npm page up on your phone and show them.  If you're making like an Important Thing you should like code review and test and optimize and stage and whatever.

Anyway

```
git push origin master
```

And then you have to put it on npm so you can further pretend this is a Real Thing so it'll be funnier.  All you really need is a `package.json` with whatever default stuff it fills in when you `npm init`.

> Oh, uh, the "name" field is going to be the official npm package name so make sure it's the one you want and no conflicts or whatever.

But if you want people to be able to call it from the command line or npm scripts (like have it in `node_modules/.bin`) then add a bin option in the ol' `package.json` that points to your main executable:

```
  "bin": {
    "petty-af": "./src/index.js"
  },
```

and put this at the top of said executable:

```
#!/usr/bin/env node
```

and there you go, it's a Real Tool you can get on the npm.

Then you (supposing you've set up an npm account already) `npm publish --access public` and now it belongs to the world.

# Step 7: Flog It

NPM: <https://www.npmjs.com/package/petty-af>

Github: <https://github.com/hsubox76/petty-af>

Sorry I don't have a Soundcloud.
