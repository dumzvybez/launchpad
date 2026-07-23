---
slug: ruby-testing-minitest-rspec
id: ruby-15
track: ruby
order: 15
title: Testing — Minitest, RSpec
description: Write unit tests with Minitest and RSpec, use mocks and doubles, set up factories, and measure coverage.
difficulty: advanced
estMinutes: 285
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=fmyvWz5TUWg&t=9700s
whyItMatters: Write unit tests with Minitest and RSpec, use mocks and doubles, set up factories, and measure coverage.
deepDiveResources:
  - label: W3Schools Ruby
    url: https://www.w3schools.com/ruby/
    kind: course
  - label: Ruby Official Docs
    url: https://www.ruby-doc.org/
    kind: doc
---

# Testing — Minitest, RSpec

## Testing — Minitest, RSpec

### Why It Matters

Write unit tests with Minitest and RSpec, use mocks and doubles, set up factories, and measure coverage.

Write unit tests with Minitest and RSpec, use mocks and doubles, set up factories, and measure coverage.

### Prerequisites

- Stage 14: Gem Management and Bundler
- Stage 11: Exception Handling (for testing raise).

### Topics

- Minitest::Test with assert_equal, assert_raises
- Minitest::Spec (describe/it/expect) style
- RSpec describe/context/it/expect/should
- subject, let, before/after hooks
- Doubles, mocks, stubs (allow/expect/receive)
- FactoryBot for test data (build vs create)
- Coverage with SimpleCov
- Pending tests, skip, and focus

### Key Concepts

- Minitest ships with Ruby (no gem needed for basic tests); RSpec is the de-facto Rails standard.
- Use `expect { ... }.to raise_error(ErrorClass)` to test that code raises.
- `let(:name) { ... }` is lazy — evaluated only when first referenced; `let!` is eager.
- build(:factory) doesn't hit the DB; create(:factory) does. Prefer build when persistence isn't tested.
- Use `allow(obj).to receive(:method).and_return(value)` to stub; add `expect(obj).to have_received(:method)` to verify.
- before(:each) runs before every example; before(:all) runs once per group (rarely needed, careful with state).

```ruby
require 'minitest/autorun'
require_relative 'calculator'

class CalculatorTest < Minitest::Test
  def setup
    @calc = Calculator.new
  end

  def test_add
    assert_equal 5, @calc.add(2, 3)
  end

  def test_divide_by_zero_raises
    assert_raises(ZeroDivisionError) { @calc.divide(10, 0) }
  end

  def test_truthy
    assert @calc.valid?   # passes if truthy
  end

  # Spec-style (Minitest::Spec):
  # describe Calculator do
  #   it 'adds' do
  #     _(Calculator.new.add(2,3)).must_equal 5
  #   end
  # end
end
```
Caption: Minitest

### Common Pitfalls

- Using let in before(:all) — let is lazy and per-example — it doesn't work in before(:all); use before(:each) or instance variables.
- Stubbing the system under test — Don't stub the method you're testing — you end up testing the mock, not the code.
- Forgetting to verify mocks — allow alone doesn't verify the call was made; add `expect(obj).to have_received(:method)` or use `expect(obj).to receive(:method)` upfront.
- Using create(:factory) when build suffices — build(:user) is faster than create(:user) (no DB write); use build when persistence isn't being tested.
- Stubbing time-dependent code without travel_to — Use Timecop.travel or `Time.travel_to` (Rails 5+) so tests are deterministic; relying on Time.now makes tests flaky.

### Real-World Applications

- Rails uses Minitest as the default test framework; GitHub, Shopify, and Stripe primarily use RSpec.
- Stripe's RSpec suite has 50,000+ examples with parallel execution; coverage gates block PRs below 80%.
- Shopify uses FactoryBot with thousands of factories to generate test data for its order pipeline.
- Airbnb's migration suite uses Minitest specs to verify zero-downtime schema changes against production replicas.

### Interview Questions

- 1. What's the difference between Minitest and RSpec? — Minitest is xUnit-style (assert_equal) and ships with Ruby; RSpec is BDD-style (describe/it/expect) and is the Rails community default.
- 2. What does `let(:user) { build(:user) }` do? — Lazily defines a method `user` that builds (no DB write) a user factory on first reference in each example.
- 3. How do you test that code raises an exception in RSpec? — Use `expect { code }.to raise_error(ErrorClass)` — note the block form, not a method call.
- 4. What's the difference between allow and expect in RSpec mocks? — allow stubs a method without verifying; expect sets up an expectation that the method MUST be called.
- 5. What does SimpleCov measure? — Line (and branch) coverage — the percentage of code lines executed by your test suite.

### Mini Project

Build a Test Suite for a Bank Account Class: Write 10+ tests covering
deposit, withdraw (with insufficient-funds error), transfer, and
statement printing. Use both Minitest and RSpec. Suggested approach:
Suggested approach:
  - Define Account class with deposit/withdraw/transfer
  - Write Minitest tests with setup method
  - Write RSpec tests with subject and let
  - Use allow/double for a Logger dependency
  - Add SimpleCov and aim for >=90% coverage

### Exercises

1. Write a Minitest test for an add(a, b) method using assert_equal.
2. Write an RSpec describe block with subject and let for a Calculator class.
3. Use `expect { ... }.to raise_error(ArgumentError)` to test error cases.
4. Use `allow(logger).to receive(:info)` and verify with `have_received`.
5. Set up SimpleCov in spec_helper.rb and run the suite — check coverage report.
6. >>> QUIZ (Stage 15) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Which ships with Ruby by default?
9. A) RSpec
10. B) Both
11. C) Minitest (*)
12. D) Neither
13. Explanation: Minitest is part of Ruby's stdlib; RSpec must be installed as a gem.
14. Q2: What does `let(:user) { build(:user) }` do?
15. A) Creates a user in the DB
16. B) Defines a class method
17. C) Stubs a method
18. D) Lazily builds a user (no DB write) per example (*)
19. Explanation: let is lazy (evaluated on first reference) and memoized per example; build skips DB persistence.
20. Q3: How do you test that code raises in RSpec?
21. A) expect { code }.to raise_error(ErrorClass) (*)
22. B) expect(code).to raise_error
23. C) assert_raises { code }
24. D) rescue ErrorClass
25. Explanation: Use the block form `expect { ... }.to raise_error(...)` — not `expect(code)` which calls code immediately.
26. Q4: What's the difference between allow and expect in RSpec mocks?
27. A) allow is for class methods; expect for instance
28. B) allow stubs without verifying; expect verifies the call was made (*)
29. C) They're identical
30. D) allow is deprecated
31. Explanation: allow sets up a stub; expect sets up an expectation that's verified at the end of the example.
32. Q5: What does SimpleCov measure?
33. A) Test execution time
34. B) Memory usage
35. C) Line (and branch) coverage (*)
36. D) Number of tests
37. Explanation: SimpleCov tracks which lines of code are executed by the suite — reports as a coverage percentage.
38. Q6: What's the difference between build(:user) and create(:user)?
39. A) build is for modules; create for classes
40. B) build raises; create doesn't
41. C) They're identical
42. D) build skips DB; create persists to DB (*)
43. Explanation: build(:user) creates an in-memory instance; create(:user) also saves it to the DB — build is faster.
44. Q7: What does before(:each) do?
45. A) Runs before every example in the group (*)
46. B) Runs once before the group
47. C) Runs after every example
48. D) Runs in production
49. Explanation: before(:each) (or just before) runs before each example — use it to reset state.
50. Q8: What does `subject(:calc) { Calculator.new }` do?
51. A) Skips the test
52. B) Names the subject as `calc` (*)
53. C) Makes calc private
54. D) Creates a class method
55. Explanation: subject with a name lets you reference the subject by name in examples, improving readability.
56. Q9: What does a `double` represent in RSpec?
57. A) A duplicate test
58. B) A type of assertion
59. C) A test double (stub object) standing in for a real dependency (*)
60. D) A class loader
61. Explanation: double('Name') creates a test double you can stub methods on — useful for isolating the SUT.
62. Q10: What's a trait in FactoryBot?
63. A) A type of factory
64. B) A test runner
65. C) A mock
66. D) A named set of attributes to override defaults (*)
67. Explanation: Traits let you compose variants (e.g., :admin trait on :user factory) without defining many factories.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Which ships with Ruby by default?
  options:
    - RSpec
    - Both
    - Minitest
    - Neither
  correctIndex: 2
  explanation: Minitest is part of Ruby's stdlib; RSpec must be installed as a gem.
- id: q2
  question: What does `let(:user) { build(:user) }` do?
  options:
    - Creates a user in the DB
    - Defines a class method
    - Stubs a method
    - Lazily builds a user (no DB write) per example
  correctIndex: 3
  explanation: let is lazy (evaluated on first reference) and memoized per example; build skips DB persistence.
- id: q3
  question: How do you test that code raises in RSpec?
  options:
    - expect { code }.to raise_error(ErrorClass)
    - expect(code).to raise_error
    - assert_raises { code }
    - rescue ErrorClass
  correctIndex: 0
  explanation: Use the block form `expect { ... }.to raise_error(...)` — not `expect(code)` which calls code immediately.
- id: q4
  question: What's the difference between allow and expect in RSpec mocks?
  options:
    - allow is for class methods; expect for instance
    - allow stubs without verifying; expect verifies the call was made
    - They're identical
    - allow is deprecated
  correctIndex: 1
  explanation: allow sets up a stub; expect sets up an expectation that's verified at the end of the example.
- id: q5
  question: What does SimpleCov measure?
  options:
    - Test execution time
    - Memory usage
    - Line (and branch) coverage
    - Number of tests
  correctIndex: 2
  explanation: SimpleCov tracks which lines of code are executed by the suite — reports as a coverage percentage.
- id: q6
  question: What's the difference between build(:user) and create(:user)?
  options:
    - build is for modules; create for classes
    - build raises; create doesn't
    - They're identical
    - build skips DB; create persists to DB
  correctIndex: 3
  explanation: build(:user) creates an in-memory instance; create(:user) also saves it to the DB — build is faster.
- id: q7
  question: What does before(:each) do?
  options:
    - Runs before every example in the group
    - Runs once before the group
    - Runs after every example
    - Runs in production
  correctIndex: 0
  explanation: before(:each) (or just before) runs before each example — use it to reset state.
- id: q8
  question: What does `subject(:calc) { Calculator.new }` do?
  options:
    - Skips the test
    - Names the subject as `calc`
    - Makes calc private
    - Creates a class method
  correctIndex: 1
  explanation: subject with a name lets you reference the subject by name in examples, improving readability.
- id: q9
  question: What does a `double` represent in RSpec?
  options:
    - A duplicate test
    - A type of assertion
    - A test double (stub object) standing in for a real dependency
    - A class loader
  correctIndex: 2
  explanation: double('Name') creates a test double you can stub methods on — useful for isolating the SUT.
- id: q10
  question: What's a trait in FactoryBot?
  options:
    - A type of factory
    - A test runner
    - A mock
    - A named set of attributes to override defaults
  correctIndex: 3
  explanation: Traits let you compose variants (e.g., :admin trait on :user factory) without defining many factories.
```

