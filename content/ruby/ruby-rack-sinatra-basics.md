---
slug: ruby-rack-sinatra-basics
id: ruby-18
track: ruby
order: 18
title: Rack and Sinatra Basics
description: Build web apps with the Rack spec (a callable returning [status, headers, body]) and Sinatra's lightweight DSL.
difficulty: advanced
estMinutes: 330
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=fmyvWz5TUWg&t=11800s
whyItMatters: Build web apps with the Rack spec (a callable returning [status, headers, body]) and Sinatra's lightweight DSL.
deepDiveResources:
  - label: W3Schools Ruby
    url: https://www.w3schools.com/ruby/
    kind: course
  - label: Ruby Official Docs
    url: https://www.ruby-doc.org/
    kind: doc
---

# Rack and Sinatra Basics

## Rack and Sinatra Basics

### Why It Matters

Build web apps with the Rack spec (a callable returning [status, headers, body]) and Sinatra's lightweight DSL.

Build web apps with the Rack spec (a callable returning [status, headers, body]) and Sinatra's lightweight DSL.

### Prerequisites

- Stage 17: Regex and String Processing
- Stage 14: Gem Management and Bundler.

### Topics

- Rack spec: app responds to call(env) -> [status, headers, body]
- Rack::Request and Rack::Response helpers
- config.ru (rackup file)
- Sinatra DSL: get/post/put/delete, route params
- Sinatra helpers, before/after filters, halt
- Modular Sinatra::Base vs classic top-level
- Rack middleware: initialize(app) and call(env)
- Sessions, cookies, and static files

### Key Concepts

- Rack is the foundation of every Ruby web framework (Rails, Sinatra, Hanami) — a Rack app is any object with `call(env)` returning `[status, headers, body]`.
- Sinatra's classic style (top-level get/post) is fine for tiny apps; use Sinatra::Base for modular, testable apps.
- Middleware wraps the app: `use MiddlewareClass` in config.ru or inside `class App < Sinatra::Base`.
- halt(status, body) immediately stops the request in Sinatra — useful for auth and validation.
- Use content_type :json and `.to_json` to return JSON; Sinatra sets Content-Type automatically.
- Route params (e.g., /:id) come in as strings in `params` hash — convert with .to_i for numeric use.

```ruby
# Rack: a minimal spec — an app is any object that responds to #call(env)
# and returns [status, headers, body]

class HelloWorld
  def call(env)
    [
      200,
      { 'Content-Type' => 'text/plain' },
      ["Hello, #{env['PATH_INFO']}!\n"]
    ]
  end
end

# config.ru — Rack-up file to run with `rackup`:
#   run HelloWorld.new

# Use Rack::Request and Rack::Response for convenience:
require 'rack'

class App
  def call(env)
    req = Rack::Request.new(env)
    res = Rack::Response.new
    res.write("Path: #{req.path}\n")
    res.write("Params: #{req.params.inspect}\n")
    res.finish   # returns [status, headers, body]
  end
end
```
Caption: Rack basics

### Common Pitfalls

- Forgetting to set Content-Type for JSON — Add `content_type :json` before returning JSON, or browsers may try to render as HTML.
- Using classic Sinatra in tests — Classic top-level Sinatra pollutes global state; use `Sinatra::Base` for testable, mountable apps.
- Returning a non-Array from a Rack app — Rack requires [status, headers, body] where body responds to .each; use Rack::Response to build it correctly.
- Trusting route params as integers — params[:id] is always a string; call .to_i explicitly or use Integer() for validation.
- Forgetting to call `request.body.rewind` before reading — Some middleware reads the body first; rewind before re-reading or you'll get an empty body.

### Real-World Applications

- Sinatra is used by GitHub for internal microservices and API prototypes (lighter than Rails for tiny services).
- Shopify uses Rack middleware extensively for tenant routing, rate limiting, and request ID injection.
- Stripe's early API was Sinatra-based before migrating to a custom Rails stack.
- Airbnb uses Rack::Attack for rate limiting and IP blocking across its Ruby services.

### Interview Questions

- 1. What's the Rack spec? — An app is any object responding to call(env) and returning [status, headers, body].
- 2. What's the difference between classic Sinatra and Sinatra::Base? — Classic uses top-level DSL (pollutes global state); Sinatra::Base is modular and testable.
- 3. What does `halt 401, 'Unauthorized'` do in Sinatra? — Immediately stops the request and returns [401, headers, ['Unauthorized']] — useful for auth checks.
- 4. What's Rack middleware? — A class with initialize(app) and call(env) that wraps the app — can modify env before and the response after.
- 5. How do you return JSON in Sinatra? — Set `content_type :json` and return a hash's `.to_json` — Sinatra sets the Content-Type header.

### Mini Project

Build a JSON API with Sinatra: A CRUD API for a Todo resource with GET
/todos, POST /todos, GET /todos/:id, PATCH /todos/:id, DELETE
/todos/:id. Use in-memory storage. Suggested approach:
Suggested approach:
  - Use modular Sinatra::Base style
  - Store todos in a class variable @@todos = {}
  - Use before filter for content_type :json
  - Parse JSON request body with JSON.parse(request.body.read)
  - Add basic error handling with halt 404 for missing todos

### Exercises

1. Write a Rack app (plain Ruby class) that returns 'Hello' for any path.
2. Run it with `rackup` and a config.ru file.
3. Add a Sinatra route `get '/hello/:name'` that greets by name.
4. Add a `before` filter that logs the request path.
5. Write a Rack middleware that adds an X-Response-Time header.
6. >>> QUIZ (Stage 18) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What's the Rack spec?
9. A) A specific class to inherit from
10. B) An object responding to call(env) returning [status, headers, body] (*)
11. C) A gem for SQL
12. D) A view template engine
13. Explanation: Rack is a protocol: any object with `call(env)` returning `[status, headers, body]` is a Rack app.
14. Q2: What's the difference between classic Sinatra and Sinatra::Base?
15. A) Classic is faster
16. B) Base is deprecated
17. C) Classic is top-level; Base is modular and testable (*)
18. D) They're identical
19. Explanation: Classic pollutes global state with top-level routes; Sinatra::Base lets you mount multiple apps and test them.
20. Q3: What does `halt 401, 'Unauthorized'` do?
21. A) Logs and continues
22. B) Raises an error
23. C) Skips the next filter
24. D) Immediately stops the request and returns 401 (*)
25. Explanation: halt short-circuits the request — perfect for auth and validation checks in before filters.
26. Q4: What's Rack middleware?
27. A) A class with initialize(app) and call(env) that wraps the app (*)
28. B) A type of database
29. C) A view template
30. D) A session store
31. Explanation: Middleware wraps the app: it can modify env before calling the app and modify the response after.
32. Q5: How do you return JSON in Sinatra?
33. A) Just return a hash
34. B) Set content_type :json and return hash.to_json (*)
35. C) Use render json:
36. D) JSON is the default
37. Explanation: Set content_type :json explicitly so the browser/client knows it's JSON; then return hash.to_json.
38. Q6: What does `params[:id]` return for `/users/42`?
39. A) The integer 42
40. B) nil
41. C) The string "42" (*)
42. D) A Symbol
43. Explanation: Route params are always strings — call .to_i or Integer() to convert.
44. Q7: What's the purpose of config.ru?
45. A) To define routes
46. B) To set up the database
47. C) To run tests
48. D) To configure the Rack app and run it with rackup (*)
49. Explanation: config.ru is the Rackup file that builds the middleware stack and runs the app via `rackup`.
50. Q8: What does `use Rack::Deflater` do?
51. A) Gzips responses (*)
52. B) Compresses the database
53. C) Caches responses
54. D) Limits request size
55. Explanation: Rack::Deflater adds Content-Encoding: gzip to responses that support it — saves bandwidth.
56. Q9: What does `before '/admin/*' do ... end` do?
57. A) Runs after the route
58. B) Runs the block before any route matching /admin/* (*)
59. C) Skips the route
60. D) Defines a new route
61. Explanation: before filters run before matching routes — useful for auth checks on protected paths.
62. Q10: What's the body of a Rack response?
63. A) Always a String
64. B) Always nil
65. C) An object that responds to .each (e.g., an Array of strings) (*)
66. D) A Hash
67. Explanation: Rack body must respond to .each and yield strings — supports streaming responses.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What's the Rack spec?
  options:
    - A specific class to inherit from
    - An object responding to call(env) returning [status, headers, body]
    - A gem for SQL
    - A view template engine
  correctIndex: 1
  explanation: "Rack is a protocol: any object with `call(env)` returning `[status, headers, body]` is a Rack app."
- id: q2
  question: What's the difference between classic Sinatra and Sinatra::Base?
  options:
    - Classic is faster
    - Base is deprecated
    - Classic is top-level; Base is modular and testable
    - They're identical
  correctIndex: 2
  explanation: Classic pollutes global state with top-level routes; Sinatra::Base lets you mount multiple apps and test them.
- id: q3
  question: What does `halt 401, 'Unauthorized'` do?
  options:
    - Logs and continues
    - Raises an error
    - Skips the next filter
    - Immediately stops the request and returns 401
  correctIndex: 3
  explanation: halt short-circuits the request — perfect for auth and validation checks in before filters.
- id: q4
  question: What's Rack middleware?
  options:
    - A class with initialize(app) and call(env) that wraps the app
    - A type of database
    - A view template
    - A session store
  correctIndex: 0
  explanation: "Middleware wraps the app: it can modify env before calling the app and modify the response after."
- id: q5
  question: How do you return JSON in Sinatra?
  options:
    - Just return a hash
    - Set content_type :json and return hash.to_json
    - "Use render json:"
    - JSON is the default
  correctIndex: 1
  explanation: Set content_type :json explicitly so the browser/client knows it's JSON; then return hash.to_json.
- id: q6
  question: What does `params[:id]` return for `/users/42`?
  options:
    - The integer 42
    - nil
    - The string "42"
    - A Symbol
  correctIndex: 2
  explanation: Route params are always strings — call .to_i or Integer() to convert.
- id: q7
  question: What's the purpose of config.ru?
  options:
    - To define routes
    - To set up the database
    - To run tests
    - To configure the Rack app and run it with rackup
  correctIndex: 3
  explanation: config.ru is the Rackup file that builds the middleware stack and runs the app via `rackup`.
- id: q8
  question: What does `use Rack::Deflater` do?
  options:
    - Gzips responses
    - Compresses the database
    - Caches responses
    - Limits request size
  correctIndex: 0
  explanation: "Rack::Deflater adds Content-Encoding: gzip to responses that support it — saves bandwidth."
- id: q9
  question: What does `before '/admin/*' do ... end` do?
  options:
    - Runs after the route
    - Runs the block before any route matching /admin/*
    - Skips the route
    - Defines a new route
  correctIndex: 1
  explanation: before filters run before matching routes — useful for auth checks on protected paths.
- id: q10
  question: What's the body of a Rack response?
  options:
    - Always a String
    - Always nil
    - An object that responds to .each (e.g., an Array of strings)
    - A Hash
  correctIndex: 2
  explanation: Rack body must respond to .each and yield strings — supports streaming responses.
```

