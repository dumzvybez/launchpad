---
slug: ruby-classes-objects-attr-accessor
id: ruby-08
track: ruby
order: 8
title: Classes, Objects, and attr_accessor
description: Define classes, instance methods, attribute accessors, and access control; understand self vs @ and overriding ==.
difficulty: intermediate
estMinutes: 180
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=fmyvWz5TUWg&t=4800s
whyItMatters: Define classes, instance methods, attribute accessors, and access control; understand self vs @ and overriding ==.
deepDiveResources:
  - label: W3Schools Ruby
    url: https://www.w3schools.com/ruby/
    kind: course
  - label: Ruby Official Docs
    url: https://www.ruby-doc.org/
    kind: doc
---

# Classes, Objects, and attr_accessor

## Classes, Objects, and attr_accessor

### Why It Matters

Define classes, instance methods, attribute accessors, and access control; understand self vs @ and overriding ==.

Define classes, instance methods, attribute accessors, and access control; understand self vs @ and overriding ==.

### Prerequisites

- Stage 7: Lambdas and the & Operator
- Familiarity with attr_* methods (preview).

### Topics

- class, def, initialize (the constructor)
- Instance variables (@name) and class variables (@@name)
- attr_accessor / attr_reader / attr_writer
- self: as receiver (self.x=) and for class methods (def self.foo)
- Access control: public, private, protected
- Overriding ==, eql?, hash, to_s
- Class methods vs instance methods
- Endless methods (def foo = expr) since Ruby 3.0

### Key Concepts

- @var is an instance variable; self.var calls the getter (which may have validation); use self.var= to call a setter.
- private methods can ONLY be called without an explicit receiver (no `self.private_method`); protected allows inter-instance calls.
- Default == is identity (same as equal?); override == for value equality, and pair with hash and eql? if used as Hash keys.
- attr_accessor :x generates `def x; @x; end` and `def x=(v); @x = v; end`.
- def self.method_name defines a class method; def method_name defines an instance method.
- Endless method syntax `def foo = expr` (Ruby 3.0+) is sugar for `def foo; expr; end` for single-expression methods.

```ruby
class Person
  # attr_accessor generates both getter and setter
  # attr_reader  generates only getter
  # attr_writer  generates only setter
  attr_accessor :name, :age
  attr_reader :id

  def initialize(name, age)
    @name = name     # @ marks instance variables
    @age = age
    @id = rand(1..1_000_000)
  end

  # self. defines a CLASS method (not instance)
  def self.create_anonymous
    new("Anonymous", 0)
  end

  # Override to_s for nice printing
  def to_s = "#{@name} (age #{@age}, id #{@id})"  # endless method
end

p1 = Person.new("Alice", 30)
puts p1               # Alice (age 30, id 12345)
p1.age = 31           # setter via attr_accessor
puts p1.age           # 31
puts Person.create_anonymous  # Anonymous (age 0, id ...)
```
Caption: Class with attr_accessor and self

### Common Pitfalls

- Forgetting self. on setters — `count = 5` inside a method creates a local; use `self.count = 5` to call the setter, or `@count = 5` to bypass.
- Calling private methods with self.receiver — Private methods can't have an explicit receiver in Ruby — call them bare (validate, not self.validate).
- Overriding == without also overriding hash and eql? — Hash lookups use eql? and hash; if you only override ==, equal-value objects hash differently and break Hash keys.
- Using @@class_variables in subclasses — @@vars are SHARED across the whole class hierarchy; use class instance variables (@var at class scope) per subclass instead.
- Confusing protected with private — private = no receiver at all; protected = callable from other instances of the same class (e.g., a.balance >= b.balance).

### Real-World Applications

- GitHub's User and Repository classes use attr_accessor for hundreds of model attributes with ActiveModel validation hooks.
- Shopify's Money class overrides ==, eql?, and hash to compare currency values across order line items.
- Airbnb's Listing model uses private methods to encapsulate pricing-rule logic that's only called from within the class.
- Stripe's Charge class uses protected methods to compare fee splits between two Charge instances of the same currency.

### Interview Questions

- 1. What does `attr_accessor :x` generate? — Both a getter `def x; @x; end` and setter `def x=(v); @x = v; end`.
- 2. Why use `self.x = 5` instead of `x = 5` inside a method? — Bare `x = 5` creates a local variable; `self.x = 5` calls the setter method (which may validate).
- 3. What's the rule for private methods in Ruby? — They can ONLY be called without an explicit receiver — call them bare (validate, not self.validate).
- 4. When would you use protected over private? — When one instance needs to call a method on ANOTHER instance of the same class (e.g., a.compare(b)).
- 5. What must you override together when using objects as Hash keys? — ==, eql?, AND hash — eql? is what Hash uses for comparison and hash for bucketing.

### Mini Project

Build a Bank Account Class with Transactions: A class that supports
deposit, withdraw, transfer, statement printing, and immutable
transaction history. Suggested approach:
Suggested approach:
  - attr_reader :balance, :transactions (no setters)
  - Private validate_amount method
  - transfer uses protected access to read another account's balance
  - Override == to compare account numbers, hash for Hash-key use
  - Add a class method Account.create_savings that sets a flag

### Exercises

1. Define a Person class with attr_accessor :name and an initialize; create two instances and print them.
2. Add a private method `validate` and demonstrate that calling it with `self.validate` raises NoMethodError.
3. Override == and hash on a Point class; verify two equal points work as Hash keys.
4. Use `self.count = 5` inside an `increment` method, and observe what happens with bare `count = 5`.
5. Define a class method `Person.create_anonymous` and call it.
6. >>> QUIZ (Stage 8) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What does `attr_accessor :x` generate?
9. A) Only a getter
10. B) Only a setter
11. C) A class variable
12. D) Both getter and setter (*)
13. Explanation: attr_accessor combines attr_reader (getter) and attr_writer (setter) for the named attribute.
14. Q2: Why must you write `self.x = 5` inside a method?
15. A) To call the setter (bare `x = 5` creates a local) (*)
16. B) To make it private
17. C) To make it faster
18. D) To create a class variable
19. Explanation: Without self., `x = 5` is interpreted as a local variable assignment, not a method call.
20. Q3: How are private methods called in Ruby?
21. A) With self. prefix
22. B) Without any receiver (bare call) (*)
23. C) With an explicit receiver
24. D) Only from class methods
25. Explanation: Private methods cannot have an explicit receiver — call them bare inside the class.
26. Q4: When is `protected` appropriate over `private`?
27. A) When the method should be globally callable
28. B) When the method is a class method
29. C) When another instance of the same class needs to call it (*)
30. D) When the method is final
31. Explanation: protected lets one instance call the method on another instance of the same class (e.g., inter-instance comparisons).
32. Q5: Which must you override to use objects as Hash keys?
33. A) Only ==
34. B) Only hash
35. C) Only eql?
36. D) ==, eql?, AND hash (*)
37. Explanation: Hash uses eql? for key comparison and hash for bucketing; override all three consistently.
38. Q6: What does `def self.foo` define?
39. A) A class method (*)
40. B) A private method
41. C) A singleton instance method
42. D) A constant
43. Explanation: def self.foo defines a class method (called as ClassName.foo), not an instance method.
44. Q7: What is `def to_s = "x"` (Ruby 3.0+)?
45. A) A lambda
46. B) An endless method (single-expression shorthand) (*)
47. C) A class method
48. D) A syntax error
49. Explanation: Endless method syntax: `def name = expr` is shorthand for `def name; expr; end` for single-expression methods.
50. Q8: What's the danger of `@@var` in subclasses?
51. A) It's automatically private
52. B) It's read-only
53. C) It's shared across the entire class hierarchy (*)
54. D) It can't be reset
55. Explanation: @@ class variables are shared by all subclasses; override surprises are common — prefer class instance variables.
56. Q9: What's the default `==` behavior?
57. A) Value equality
58. B) Always false
59. C) Raises
60. D) Same as equal? (identity) (*)
61. Explanation: Default == is identity (same as equal?) — override it for value equality.
62. Q10: What does `initialize` do?
63. A) It's the constructor called by new (*)
64. B) It's a class method
65. C) It allocates memory
66. D) It's optional and never called
67. Explanation: Class.new allocates the object then calls initialize on it with the args passed to new.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What does `attr_accessor :x` generate?
  options:
    - Only a getter
    - Only a setter
    - A class variable
    - Both getter and setter
  correctIndex: 3
  explanation: attr_accessor combines attr_reader (getter) and attr_writer (setter) for the named attribute.
- id: q2
  question: Why must you write `self.x = 5` inside a method?
  options:
    - To call the setter (bare `x = 5` creates a local)
    - To make it private
    - To make it faster
    - To create a class variable
  correctIndex: 0
  explanation: Without self., `x = 5` is interpreted as a local variable assignment, not a method call.
- id: q3
  question: How are private methods called in Ruby?
  options:
    - With self. prefix
    - Without any receiver (bare call)
    - With an explicit receiver
    - Only from class methods
  correctIndex: 1
  explanation: Private methods cannot have an explicit receiver — call them bare inside the class.
- id: q4
  question: When is `protected` appropriate over `private`?
  options:
    - When the method should be globally callable
    - When the method is a class method
    - When another instance of the same class needs to call it
    - When the method is final
  correctIndex: 2
  explanation: protected lets one instance call the method on another instance of the same class (e.g., inter-instance comparisons).
- id: q5
  question: Which must you override to use objects as Hash keys?
  options:
    - Only ==
    - Only hash
    - Only eql?
    - ==, eql?, AND hash
  correctIndex: 3
  explanation: Hash uses eql? for key comparison and hash for bucketing; override all three consistently.
- id: q6
  question: What does `def self.foo` define?
  options:
    - A class method
    - A private method
    - A singleton instance method
    - A constant
  correctIndex: 0
  explanation: def self.foo defines a class method (called as ClassName.foo), not an instance method.
- id: q7
  question: What is `def to_s = "x"` (Ruby 3.0+)?
  options:
    - A lambda
    - An endless method (single-expression shorthand)
    - A class method
    - A syntax error
  correctIndex: 1
  explanation: "Endless method syntax: `def name = expr` is shorthand for `def name; expr; end` for single-expression methods."
- id: q8
  question: What's the danger of `@@var` in subclasses?
  options:
    - It's automatically private
    - It's read-only
    - It's shared across the entire class hierarchy
    - It can't be reset
  correctIndex: 2
  explanation: "@@ class variables are shared by all subclasses; override surprises are common — prefer class instance variables."
- id: q9
  question: What's the default `==` behavior?
  options:
    - Value equality
    - Always false
    - Raises
    - Same as equal? (identity)
  correctIndex: 3
  explanation: Default == is identity (same as equal?) — override it for value equality.
- id: q10
  question: What does `initialize` do?
  options:
    - It's the constructor called by new
    - It's a class method
    - It allocates memory
    - It's optional and never called
  correctIndex: 0
  explanation: Class.new allocates the object then calls initialize on it with the args passed to new.
```

