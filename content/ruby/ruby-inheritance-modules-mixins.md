---
slug: ruby-inheritance-modules-mixins
id: ruby-09
track: ruby
order: 9
title: Inheritance, Modules, and Mixins
description: Use <, super, modules, include/extend/prepend, and the method resolution chain; understand method_missing safely.
difficulty: intermediate
estMinutes: 195
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=fmyvWz5TUWg&t=5500s
whyItMatters: Use <, super, modules, include/extend/prepend, and the method resolution chain; understand method_missing safely.
deepDiveResources:
  - label: W3Schools Ruby
    url: https://www.w3schools.com/ruby/
    kind: course
  - label: Ruby Official Docs
    url: https://www.ruby-doc.org/
    kind: doc
---

# Inheritance, Modules, and Mixins

## Inheritance, Modules, and Mixins

### Why It Matters

Use <, super, modules, include/extend/prepend, and the method resolution chain; understand method_missing safely.

Use <, super, modules, include/extend/prepend, and the method resolution chain; understand method_missing safely.

### Prerequisites

- Stage 8: Classes, Objects, and attr_accessor
- Familiarity with classes, instances, and self.

### Topics

- Single inheritance via <
- super (with and without parens) and the method chain
- Modules as namespaces and as mixins
- include (instance methods) vs extend (class methods) vs prepend
- The ancestors chain and method lookup order
- method_missing and respond_to_missing?
- Object, Kernel, BasicObject at the top of the chain
- Module#const_get and dynamic dispatch

### Key Concepts

- Ruby has SINGLE inheritance; modules provide multiple-inheritance-like behavior via mixins.
- `super` (no parens) forwards all args; `super()` (parens) passes NONE; `super(a, b)` passes specific args.
- include adds the module BELOW the class in lookup; prepend adds it ABOVE (so module methods can use super to wrap the class).
- extend adds module methods as CLASS (singleton) methods rather than instance methods.
- method_missing is a powerful but dangerous hook — always pair with respond_to_missing? for correct respond_to? behavior.
- The ancestors chain determines lookup: [prepended modules, class, included modules (reverse order), parent, ..., Object, Kernel, BasicObject].

```ruby
class Animal
  attr_reader :name

  def initialize(name)
    @name = name
  end

  def speak = "#{name} makes a sound"
end

class Dog < Animal   # < denotes inheritance
  def speak = "#{name} says Woof!"   # override
end

class Puppy < Dog
  def speak
    super + " (small bark)"   # super calls parent's version
  end
end

puts Dog.new("Rex").speak    # Rex says Woof!
puts Puppy.new("Buddy").speak  # Buddy says Woof! (small bark)
```
Caption: Inheritance and super

### Common Pitfalls

- Forgetting to define respond_to_missing? with method_missing — Override respond_to_missing? so respond_to?(:dynamic_method) returns true; otherwise duck-typing checks fail.
- Using super without parens when you meant to pass no args — `super` forwards all args; `super()` passes zero. Pick the right one or you'll get unexpected ArgumentError.
- Including modules in the wrong order — Last-include wins for method lookup — order modules so the most specific overrides the least.
- Overusing method_missing — It's slower than regular methods and hides errors; prefer define_method for known dynamic method names.
- Confusing include with extend — include adds instance methods; extend adds singleton (class) methods — mixing them up breaks DSLs.

### Real-World Applications

- Rails uses modules extensively: ApplicationRecord includes Enumerable-like behaviors via ActiveRecord::Relation.
- Shopify's multi-tenant code uses prepend to wrap save methods with tenant-scoping logic across hundreds of models.
- GitHub's authentication system uses method_missing (with respond_to_missing?) for dynamic permission checks like can_edit_repo?.
- Stripe's API resource classes extend Findable to add class methods like Charge.find, Charge.list, etc.

### Interview Questions

- 1. What's the difference between include and extend? — include adds module methods as INSTANCE methods; extend adds them as CLASS (singleton) methods.
- 2. What does `super` (no parens) do? — Forwards all arguments to the parent's method; use `super()` to pass zero args explicitly.
- 3. Where does prepend place the module in the lookup chain? — ABOVE the class — so the module method can use super to wrap the class method.
- 4. Why must method_missing be paired with respond_to_missing? — So respond_to?(:dynamic) returns true; otherwise duck-typing checks (e.g., in enumerable) fail.
- 5. What's the ancestors chain order for a class with include and prepend? — [prepended modules, class, included modules (reverse order), parent class, Object, Kernel, BasicObject].

### Mini Project

Build a Plugin System with Modules: A small framework where plugins
(modules) are mixed into a base Renderer class via include, supporting
hooks like before_render and after_render. Suggested approach:
Suggested approach:
  - Define BaseRenderer with render method that calls hooks
  - Create 2-3 plugin modules (Logging, Caching, Analytics)
  - Use prepend for the Caching plugin so it can wrap render
  - Use extend to add class-level configuration methods
  - Demonstrate the ancestors chain to show ordering

### Exercises

1. Define an Animal class and a Dog subclass that overrides speak and calls super.
2. Create a Walkable module and include it in two unrelated classes (Dog and Robot).
3. Use prepend to add logging before/after a method, then call super inside the module.
4. Override method_missing to handle dynamic find_by_<field> methods — pair with respond_to_missing?.
5. Print SomeClass.ancestors.inspect to see the full method lookup chain.
6. >>> QUIZ (Stage 9) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does `include M` do?
9. A) Adds M's methods as instance methods (*)
10. B) Adds M's methods as class methods
11. C) Adds M as a superclass
12. D) Replaces the class methods
13. Explanation: include inserts the module BELOW the class in the lookup chain — its methods become instance methods.
14. Q2: What does `extend M` do?
15. A) Adds M's methods as instance methods
16. B) Adds M's methods as class (singleton) methods (*)
17. C) Adds M as a superclass
18. D) Freezes the class
19. Explanation: extend adds the module's methods to the class itself, making them class methods.
20. Q3: What does `super` (no parens) do?
21. A) Passes zero args
22. B) Raises
23. C) Passes all args to the parent method (*)
24. D) Skips the parent method
25. Explanation: Bare super forwards all arguments; `super()` passes zero explicitly.
26. Q4: Where does `prepend M` put M in the lookup chain?
27. A) Below the class
28. B) In a separate namespace
29. C) At the very bottom
30. D) Above the class (so M can super to the class) (*)
31. Explanation: prepend inserts M above the class — useful for wrapping methods with before/after logic.
32. Q5: What must you pair with method_missing?
33. A) respond_to_missing? (*)
34. B) define_method
35. C) super
36. D) attr_accessor
37. Explanation: respond_to_missing? makes respond_to? return true for dynamic methods; without it duck-typing breaks.
38. Q6: What's Ruby's inheritance model?
39. A) Multiple inheritance like C++
40. B) Single inheritance only; modules provide mixins (*)
41. C) Prototypal like JavaScript
42. D) Interface-only like Java
43. Explanation: Ruby allows single inheritance via <; modules provide mixin behavior to share methods across unrelated classes.
44. Q7: What's the top of the ancestors chain?
45. A) Object
46. B) Class
47. C) BasicObject (*)
48. D) Module
49. Explanation: BasicObject is the root; Object inherits from BasicObject and mixes in Kernel.
50. Q8: What does `ancestors` return?
51. A) Only the parent classes
52. B) Only included modules
53. C) Only the class itself
54. D) The full method lookup chain (*)
55. Explanation: ancestors lists the class, prepended modules, included modules, superclasses, and Kernel — the full lookup order.
56. Q9: Which is true about `extend self`?
57. A) Module's methods become both instance AND module methods (*)
58. B) It's a syntax error
59. C) It makes all methods private
60. D) It freezes the module
61. Explanation: `extend self` makes module methods callable as ModuleName.method too, useful for namespaced utility modules.
62. Q10: Why prefer define_method over method_missing for known dynamic methods?
63. A) method_missing is deprecated
64. B) Faster and shows up in methods list / introspection (*)
65. C) define_method is private
66. D) They're identical
67. Explanation: define_method creates real methods (visible to methods, faster dispatch); method_missing is reserved for truly dynamic cases.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does `include M` do?
  options:
    - Adds M's methods as instance methods
    - Adds M's methods as class methods
    - Adds M as a superclass
    - Replaces the class methods
  correctIndex: 0
  explanation: include inserts the module BELOW the class in the lookup chain — its methods become instance methods.
- id: q2
  question: What does `extend M` do?
  options:
    - Adds M's methods as instance methods
    - Adds M's methods as class (singleton) methods
    - Adds M as a superclass
    - Freezes the class
  correctIndex: 1
  explanation: extend adds the module's methods to the class itself, making them class methods.
- id: q3
  question: What does `super` (no parens) do?
  options:
    - Passes zero args
    - Raises
    - Passes all args to the parent method
    - Skips the parent method
  correctIndex: 2
  explanation: Bare super forwards all arguments; `super()` passes zero explicitly.
- id: q4
  question: Where does `prepend M` put M in the lookup chain?
  options:
    - Below the class
    - In a separate namespace
    - At the very bottom
    - Above the class (so M can super to the class)
  correctIndex: 3
  explanation: prepend inserts M above the class — useful for wrapping methods with before/after logic.
- id: q5
  question: What must you pair with method_missing?
  options:
    - respond_to_missing?
    - define_method
    - super
    - attr_accessor
  correctIndex: 0
  explanation: respond_to_missing? makes respond_to? return true for dynamic methods; without it duck-typing breaks.
- id: q6
  question: What's Ruby's inheritance model?
  options:
    - Multiple inheritance like C++
    - Single inheritance only; modules provide mixins
    - Prototypal like JavaScript
    - Interface-only like Java
  correctIndex: 1
  explanation: Ruby allows single inheritance via <; modules provide mixin behavior to share methods across unrelated classes.
- id: q7
  question: What's the top of the ancestors chain?
  options:
    - Object
    - Class
    - BasicObject
    - Module
  correctIndex: 2
  explanation: BasicObject is the root; Object inherits from BasicObject and mixes in Kernel.
- id: q8
  question: What does `ancestors` return?
  options:
    - Only the parent classes
    - Only included modules
    - Only the class itself
    - The full method lookup chain
  correctIndex: 3
  explanation: ancestors lists the class, prepended modules, included modules, superclasses, and Kernel — the full lookup order.
- id: q9
  question: Which is true about `extend self`?
  options:
    - Module's methods become both instance AND module methods
    - It's a syntax error
    - It makes all methods private
    - It freezes the module
  correctIndex: 0
  explanation: "`extend self` makes module methods callable as ModuleName.method too, useful for namespaced utility modules."
- id: q10
  question: Why prefer define_method over method_missing for known dynamic methods?
  options:
    - method_missing is deprecated
    - Faster and shows up in methods list / introspection
    - define_method is private
    - They're identical
  correctIndex: 1
  explanation: define_method creates real methods (visible to methods, faster dispatch); method_missing is reserved for truly dynamic cases.
```

