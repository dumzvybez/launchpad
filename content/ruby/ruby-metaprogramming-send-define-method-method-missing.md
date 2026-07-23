---
slug: ruby-metaprogramming-send-define-method-method-missing
id: ruby-13
track: ruby
order: 13
title: Metaprogramming — send, define_method, method_missing
description: Use send, public_send, define_method, method_missing, class_eval, and open classes for dynamic dispatch and DSLs.
difficulty: intermediate
estMinutes: 255
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=fmyvWz5TUWg&t=8300s
whyItMatters: Use send, public_send, define_method, method_missing, class_eval, and open classes for dynamic dispatch and DSLs.
deepDiveResources:
  - label: W3Schools Ruby
    url: https://www.w3schools.com/ruby/
    kind: course
  - label: Ruby Official Docs
    url: https://www.ruby-doc.org/
    kind: doc
---

# Metaprogramming — send, define_method, method_missing

## Metaprogramming — send, define_method, method_missing

### Why It Matters

Use send, public_send, define_method, method_missing, class_eval, and open classes for dynamic dispatch and DSLs.

Use send, public_send, define_method, method_missing, class_eval, and open classes for dynamic dispatch and DSLs.

### Prerequisites

- Stage 12: File I/O and Serialization
- Stage 9: Inheritance, Modules, and Mixins (for method lookup).

### Topics

- send vs public_send (visibility)
- define_method for dynamic method creation
- method_missing and respond_to_missing?
- Open classes (monkey patching) and class_eval
- instance_eval, instance_exec, class_exec
- const_get / const_set for dynamic constants
- Struct and OpenStruct for quick data classes
- Hook methods: included, prepended, extended, inherited, method_added

### Key Concepts

- send dispatches by name (even to private methods); public_send respects visibility.
- define_method creates a method whose body is a block — the block closes over surrounding variables.
- method_missing catches undefined method calls; ALWAYS pair with respond_to_missing? so respond_to? returns true.
- Open classes let you add methods to String, Integer, etc. — powerful but risky (monkey-patching surprises other code).
- class_eval opens a class for additions; instance_eval opens an object's singleton class (defines class methods).
- Prefer define_method over method_missing when the set of method names is known (faster, introspectable).

```ruby
class Greeting
  def hello(name) = "Hello, #{name}!"

  private
  def secret = "shh"
end

g = Greeting.new

# send dispatches by method name (even private!)
puts g.send(:hello, 'Alice')      # Hello, Alice!
puts g.send('hello', 'Bob')       # Hello, Bob! (string or symbol)
puts g.send(:secret)              # shh (send bypasses private!)

# public_send respects visibility
begin
  g.public_send(:secret)  # NoMethodError: private method
rescue NoMethodError => e
  puts "Caught: #{e.message}"
end
```
Caption: send and public_send

### Common Pitfalls

- Using method_missing without respond_to_missing? — respond_to? returns false for dynamic methods, breaking duck-typing — always pair them.
- Monkey-patching core classes carelessly — Adding methods to String/Integer globally can break other gems; prefer refinements or module mixins.
- Using send to bypass private visibility accidentally — send bypasses private; use public_send when you want to respect visibility rules.
- Forgetting that method_missing is slower than real methods — method_missing adds dispatch overhead and hides methods from .methods; use define_method for known names.
- Raising from method_missing without super — If you don't recognize the method, call super — otherwise you swallow genuine NoMethodError signals.

### Real-World Applications

- Rails ActiveRecord uses method_missing to define dynamic finders like find_by_email — paired with respond_to_missing?.
- Shopify's Liquid template engine uses define_method to register user-defined tags and filters at runtime.
- GitHub's permission system uses send to dispatch can_<action>? checks based on role configuration.
- Stripe's API resource classes use class_eval to add per-resource methods when classes are loaded.

### Interview Questions

- 1. What's the difference between send and public_send? — send bypasses private/protected; public_send raises NoMethodError on private methods.
- 2. Why must method_missing be paired with respond_to_missing? — So respond_to?(:dynamic) returns true; otherwise duck-typing checks fail.
- 3. What does define_method return? — A Symbol (the method name) — it creates the method as a side effect.
- 4. What's the risk of open-class monkey patching? — Modifying String/Integer globally can break other gems and cause subtle bugs; prefer refinements.
- 5. When should you prefer define_method over method_missing? — When the set of method names is known — define_method is faster and shows up in .methods.

### Mini Project

Build a Dynamic Config DSL: A Config class that uses define_method to
generate getters/setters from a YAML schema, plus method_missing for
unknown keys that fall back to a default. Suggested approach:
Suggested approach:
  - Load schema from YAML
  - Use define_method for each known key
  - Use method_missing for unknown keys with a default
  - Pair method_missing with respond_to_missing?
  - Add a class-level define_schema method

### Exercises

1. Use send to call a private method (and public_send to confirm it raises).
2. Use define_method in a loop to create getters/setters for [:host, :port, :ssl].
3. Implement method_missing on a class to handle dynamic find_by_<field> methods.
4. Use class_eval to add a method to String (then discuss the risk).
5. Use Struct.new(:name, :age) to create a quick data class with accessors.
6. >>> QUIZ (Stage 13) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What's the difference between send and public_send?
9. A) send bypasses private; public_send respects visibility (*)
10. B) send is faster
11. C) public_send is deprecated
12. D) They're identical
13. Explanation: send invokes any method including private; public_send raises NoMethodError on private methods.
14. Q2: Why must method_missing be paired with respond_to_missing?
15. A) For performance
16. B) So respond_to? returns true for dynamic methods (*)
17. C) It's optional
18. D) To make it private
19. Explanation: Without respond_to_missing?, respond_to?(:dynamic) returns false, breaking duck-typing checks.
20. Q3: What does define_method return?
21. A) The method object
22. B) nil
23. C) A Symbol (the method name) (*)
24. D) The class
25. Explanation: define_method creates a method and returns the symbol name as a side effect.
26. Q4: What's the risk of monkey patching String?
27. A) It's a syntax error
28. B) It only works in modules
29. C) It's deprecated
30. D) It can break other gems and cause subtle bugs (*)
31. Explanation: Global monkey patches affect ALL code — prefer refinements or module mixins to scope changes.
32. Q5: When should you prefer define_method over method_missing?
33. A) When the method names are known in advance (*)
34. B) Never — method_missing is always better
35. C) Only inside modules
36. D) Only for private methods
37. Explanation: define_method creates real methods (faster dispatch, visible in .methods); method_missing is for truly dynamic cases.
38. Q6: What does class_eval do?
39. A) Defines a class method
40. B) Opens a class and evaluates a block in its context (*)
41. C) Creates a subclass
42. D) Loads a class from a file
43. Explanation: class_eval reopens the class — useful for adding methods dynamically or evaluating strings.
44. Q7: What does instance_eval do on a class?
45. A) Defines instance methods
46. B) Creates instances
47. C) Defines class (singleton) methods (*)
48. D) Raises
49. Explanation: On a class, instance_eval opens the singleton class — so def self.foo inside defines class methods.
50. Q8: What does Struct.new(:a, :b) return?
51. A) An instance
52. B) A module
53. C) A Symbol
54. D) A new class with attr_accessor :a, :b (*)
55. Explanation: Struct.new generates a class with accessors, initialize, ==, and to_s; you then call .new on it to make instances.
56. Q9: What does const_get(:Foo) do?
57. A) Returns the constant Foo (or raises NameError) (*)
58. B) Defines a new constant
59. C) Returns a Symbol
60. D) Calls the method Foo
61. Explanation: const_get looks up a constant by name (string or symbol) — useful for dynamic class loading.
62. Q10: What hook method runs when a module is included?
63. A) extended
64. B) included (*)
65. C) prepended
66. D) inherited
67. Explanation: included is called on the module with the includer; extended is for extend, prepended for prepend, inherited for subclasses.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What's the difference between send and public_send?
  options:
    - send bypasses private; public_send respects visibility
    - send is faster
    - public_send is deprecated
    - They're identical
  correctIndex: 0
  explanation: send invokes any method including private; public_send raises NoMethodError on private methods.
- id: q2
  question: Why must method_missing be paired with respond_to_missing?
  options:
    - For performance
    - So respond_to? returns true for dynamic methods
    - It's optional
    - To make it private
  correctIndex: 1
  explanation: Without respond_to_missing?, respond_to?(:dynamic) returns false, breaking duck-typing checks.
- id: q3
  question: What does define_method return?
  options:
    - The method object
    - nil
    - A Symbol (the method name)
    - The class
  correctIndex: 2
  explanation: define_method creates a method and returns the symbol name as a side effect.
- id: q4
  question: What's the risk of monkey patching String?
  options:
    - It's a syntax error
    - It only works in modules
    - It's deprecated
    - It can break other gems and cause subtle bugs
  correctIndex: 3
  explanation: Global monkey patches affect ALL code — prefer refinements or module mixins to scope changes.
- id: q5
  question: When should you prefer define_method over method_missing?
  options:
    - When the method names are known in advance
    - Never — method_missing is always better
    - Only inside modules
    - Only for private methods
  correctIndex: 0
  explanation: define_method creates real methods (faster dispatch, visible in .methods); method_missing is for truly dynamic cases.
- id: q6
  question: What does class_eval do?
  options:
    - Defines a class method
    - Opens a class and evaluates a block in its context
    - Creates a subclass
    - Loads a class from a file
  correctIndex: 1
  explanation: class_eval reopens the class — useful for adding methods dynamically or evaluating strings.
- id: q7
  question: What does instance_eval do on a class?
  options:
    - Defines instance methods
    - Creates instances
    - Defines class (singleton) methods
    - Raises
  correctIndex: 2
  explanation: On a class, instance_eval opens the singleton class — so def self.foo inside defines class methods.
- id: q8
  question: What does Struct.new(:a, :b) return?
  options:
    - An instance
    - A module
    - A Symbol
    - A new class with attr_accessor :a, :b
  correctIndex: 3
  explanation: Struct.new generates a class with accessors, initialize, ==, and to_s; you then call .new on it to make instances.
- id: q9
  question: What does const_get(:Foo) do?
  options:
    - Returns the constant Foo (or raises NameError)
    - Defines a new constant
    - Returns a Symbol
    - Calls the method Foo
  correctIndex: 0
  explanation: const_get looks up a constant by name (string or symbol) — useful for dynamic class loading.
- id: q10
  question: What hook method runs when a module is included?
  options:
    - extended
    - included
    - prepended
    - inherited
  correctIndex: 1
  explanation: included is called on the module with the includer; extended is for extend, prepended for prepend, inherited for subclasses.
```

