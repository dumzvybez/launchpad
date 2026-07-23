---
slug: ruby-gem-management-bundler
id: ruby-14
track: ruby
order: 14
title: Gem Management and Bundler
description: Manage Ruby dependencies with gem, Gemfile, Bundler, and gemspec; understand version specifiers and Gemfile.lock.
difficulty: intermediate
estMinutes: 270
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=fmyvWz5TUWg&t=9000s
whyItMatters: Manage Ruby dependencies with gem, Gemfile, Bundler, and gemspec; understand version specifiers and Gemfile. lock.
deepDiveResources:
  - label: W3Schools Ruby
    url: https://www.w3schools.com/ruby/
    kind: course
  - label: Ruby Official Docs
    url: https://www.ruby-doc.org/
    kind: doc
---

# Gem Management and Bundler

## Gem Management and Bundler

### Why It Matters

Manage Ruby dependencies with gem, Gemfile, Bundler, and gemspec; understand version specifiers and Gemfile. lock.

Manage Ruby dependencies with gem, Gemfile, Bundler, and gemspec; understand version specifiers and Gemfile.lock.

### Prerequisites

- Stage 13: Metaprogramming (for understanding gem internals)
- Stage 12: File I/O (for reading gem files).

### Topics

- gem install, gem list, gem uninstall
- The Gemfile: source, ruby version, gem declarations
- Version specifiers: exact, ~>, >=, <, ranges
- Bundler: bundle install, bundle exec, bundle update
- Gemfile.lock and why you commit it
- Authoring a gemspec for your own gem
- Groups (development, test, production)
- RubyGems.org publishing (gem build, gem push)

### Key Concepts

- Always use `bundle exec <cmd>` so your command uses the Gemfile.lock versions — bare `rspec` may use a different version.
- `~> 1.2` (pessimistic) means >= 1.2 and < 2.0; `~> 1.2.3` means >= 1.2.3 and < 1.3.0.
- Commit Gemfile.lock so all machines use identical versions; don't commit it for gems (only for apps).
- Groups let you skip dev-only gems in production: `bundle install --without development test`.
- A gemspec is required to publish a gem; Gemfile in a gem project just references the gemspec.
- Use `bundle add <gem>` to add a gem and install in one step (Bundler 1.10+).

```ruby
# Gemfile
source 'https://rubygems.org'

ruby '3.3.0'                  # pin Ruby version

# Pinned exact version
gem 'rails', '7.1.0'

# Pessimistic version (~> = >= X.Y, < X+1.0)
gem 'puma', '~> 6.4'          # >= 6.4, < 7.0

# Range
gem 'pg', '>= 1.4', '< 2.0'

# Git source
gem 'sidekiq', github: 'sidekiq/sidekiq', branch: 'main'

# Groups (only loaded in specific environments)
group :development, :test do
  gem 'rspec'
  gem 'pry'
  gem 'rubocop', require: false
end

group :production do
  gem 'newrelic_rpm'
end
```
Caption: Gemfile structure

### Common Pitfalls

- Running bare `rspec` instead of `bundle exec rspec` — Use `bundle exec` so the command loads the Gemfile.lock versions; otherwise you may get unexpected gem versions.
- Forgetting to commit Gemfile.lock — Commit Gemfile.lock in apps to guarantee identical versions across machines; don't commit it for gems (only the gemspec).
- Using open-ended `>= 1.0` version specifiers — Use `~> 1.2` (pessimistic) to allow patches but block majors; `>=` invites breakage when upstream releases a major bump.
- Running `bundle update` carelessly — Update one gem at a time with `bundle update <gem>` so you can attribute breakage; `bundle update` churns everything.
- Mixing :git and version specifiers — Git-sourced gems don't resolve versions through RubyGems; if you switch back to a released version, remove the git line.

### Real-World Applications

- GitHub uses Bundler to manage thousands of gems in its monolith, with `bundle install --deployment` for reproducible prod installs.
- Shopify's CI runs `bundle exec` for every test command to ensure Gemfile.lock versions are used across hundreds of build agents.
- Stripe publishes its Ruby SDK as a gem via `gem push` to RubyGems.org, versioned per the semver convention.
- Airbnb's monorepo uses a single Gemfile.lock across 50+ Rails apps to ensure consistent gem versions.

### Interview Questions

- 1. Why use `bundle exec rspec` instead of bare `rspec`? — bundle exec loads the Gemfile.lock versions — bare rspec may use whatever's installed globally.
- 2. What does `~> 1.2.3` allow? — >= 1.2.3 and < 1.3.0 (patches only); `~> 1.2` allows >= 1.2 and < 2.0.
- 3. Should you commit Gemfile.lock? — Yes for apps (reproducible installs); no for gems (the gemspec declares deps).
- 4. What does `bundle install --without development test` do? — Skips installing dev/test gems — used in production to keep the image small.
- 5. What's in a gemspec? — Metadata (name, version, authors, license), file list, dependencies, required Ruby version — required to build a .gem file.

### Mini Project

Build a Mini Gem: Create a Ruby gem named string_utils with methods like
titleize, truncate, and word_count. Include a gemspec, a Gemfile, RSpec
tests, and publish-ready metadata. Suggested approach:
Suggested approach:
  - Run `bundle gem string_utils` to scaffold
  - Edit string_utils.gemspec with name/version/authors/deps
  - Implement methods in lib/string_utils.rb
  - Add RSpec tests in spec/
  - Build with `gem build` and verify with `gem install ./string_utils-0.1.0.gem`

### Exercises

1. Create a Gemfile with rails '~> 7.1' and puma '~> 6.4'; run `bundle install`.
2. Run `bundle exec irb` and verify require 'json' loads the locked version.
3. Add a gem to a group with `bundle add rspec --group development,test`.
4. Inspect Gemfile.lock after `bundle update puma` — verify only puma changed.
5. Run `bundle gem my_gem` to scaffold a new gem project; inspect the generated gemspec.
6. >>> QUIZ (Stage 14) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: Why use `bundle exec rspec` instead of bare `rspec`?
9. A) It's faster
10. B) To load Gemfile.lock versions (*)
11. C) It's required by RSpec
12. D) To skip tests
13. Explanation: bundle exec ensures the command uses the exact gem versions in Gemfile.lock; bare rspec uses whatever's installed.
14. Q2: What does `~> 1.2.3` allow?
15. A) >= 1.2.3, < 2.0
16. B) >= 1.2.3, < 1.2.4
17. C) >= 1.2.3, < 1.3.0 (*)
18. D) Exactly 1.2.3
19. Explanation: Pessimistic ~>, with two components, bounds the LAST component to < next minor: 1.2.3 -> < 1.3.0.
20. Q3: Should you commit Gemfile.lock in an app?
21. A) No — it's regenerated
22. B) Only in production
23. C) Only for gems
24. D) Yes — guarantees identical versions across machines (*)
25. Explanation: Commit Gemfile.lock in apps so CI, dev, and prod use identical gem versions.
26. Q4: What does `bundle install --without development test` do?
27. A) Skips installing dev/test gems (*)
28. B) Skips writing Gemfile.lock
29. C) Removes dev/test gems from Gemfile
30. D) Forces a fresh install
31. Explanation: --without skips the listed groups — useful in production to keep images lean.
32. Q5: What's required to publish a gem to RubyGems.org?
33. A) A Gemfile only
34. B) A .gem file built from a gemspec (*)
35. C) A Dockerfile
36. D) Just a README
37. Explanation: `gem build my_gem.gemspec` produces my_gem-X.Y.Z.gem; `gem push` uploads it.
38. Q6: What does the pessimistic operator `~> 1.2` allow?
39. A) >= 1.2, < 1.3
40. B) Exactly 1.2
41. C) >= 1.2, < 2.0 (*)
42. D) >= 1.2
43. Explanation: ~> 1.2 (one component after the dot) bounds the second-to-last component: >= 1.2 and < 2.0.
44. Q7: What command adds a gem to the Gemfile and installs it?
45. A) gem add <gem>
46. B) bundle install <gem>
47. C) ruby -e 'Gem.add("<gem>")'
48. D) bundle add <gem> (*)
49. Explanation: bundle add (Bundler 1.10+) appends a gem line to Gemfile and runs install in one step.
50. Q8: Where should you NOT commit Gemfile.lock?
51. A) In a gem project (only the gemspec matters) (*)
52. B) In any project
53. C) In apps
54. D) In production
55. Explanation: For gems, the gemspec declares dependencies — Gemfile.lock would pin versions that consumers may not want.
56. Q9: What does `bundle outdated` show?
57. A) Gems not in the Gemfile
58. B) Gems with newer versions available (*)
59. C) Gems that are unused
60. D) Gems with security issues
61. Explanation: bundle outdated lists gems whose latest version is newer than what's in Gemfile.lock.
62. Q10: What does semantic versioning MAJOR.MINOR.PATCH encode?
63. A) Fix.Feature.Breaking
64. B) Feature.Fix.Breaking
65. C) Breaking.Feature.Fix (*)
66. D) Arbitrary numbers
67. Explanation: MAJOR = breaking, MINOR = backwards-compatible feature, PATCH = backwards-compatible fix.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: Why use `bundle exec rspec` instead of bare `rspec`?
  options:
    - It's faster
    - To load Gemfile.lock versions
    - It's required by RSpec
    - To skip tests
  correctIndex: 1
  explanation: bundle exec ensures the command uses the exact gem versions in Gemfile.lock; bare rspec uses whatever's installed.
- id: q2
  question: What does `~> 1.2.3` allow?
  options:
    - ">= 1.2.3, < 2.0"
    - ">= 1.2.3, < 1.2.4"
    - ">= 1.2.3, < 1.3.0"
    - Exactly 1.2.3
  correctIndex: 2
  explanation: "Pessimistic ~>, with two components, bounds the LAST component to < next minor: 1.2.3 -> < 1.3.0."
- id: q3
  question: Should you commit Gemfile.lock in an app?
  options:
    - No — it's regenerated
    - Only in production
    - Only for gems
    - Yes — guarantees identical versions across machines
  correctIndex: 3
  explanation: Commit Gemfile.lock in apps so CI, dev, and prod use identical gem versions.
- id: q4
  question: What does `bundle install --without development test` do?
  options:
    - Skips installing dev/test gems
    - Skips writing Gemfile.lock
    - Removes dev/test gems from Gemfile
    - Forces a fresh install
  correctIndex: 0
  explanation: --without skips the listed groups — useful in production to keep images lean.
- id: q5
  question: What's required to publish a gem to RubyGems.org?
  options:
    - A Gemfile only
    - A .gem file built from a gemspec
    - A Dockerfile
    - Just a README
  correctIndex: 1
  explanation: "`gem build my_gem.gemspec` produces my_gem-X.Y.Z.gem; `gem push` uploads it."
- id: q6
  question: What does the pessimistic operator `~> 1.2` allow?
  options:
    - ">= 1.2, < 1.3"
    - Exactly 1.2
    - ">= 1.2, < 2.0"
    - ">= 1.2"
  correctIndex: 2
  explanation: "~> 1.2 (one component after the dot) bounds the second-to-last component: >= 1.2 and < 2.0."
- id: q7
  question: What command adds a gem to the Gemfile and installs it?
  options:
    - gem add <gem>
    - bundle install <gem>
    - ruby -e 'Gem.add("<gem>")'
    - bundle add <gem>
  correctIndex: 3
  explanation: bundle add (Bundler 1.10+) appends a gem line to Gemfile and runs install in one step.
- id: q8
  question: Where should you NOT commit Gemfile.lock?
  options:
    - In a gem project (only the gemspec matters)
    - In any project
    - In apps
    - In production
  correctIndex: 0
  explanation: For gems, the gemspec declares dependencies — Gemfile.lock would pin versions that consumers may not want.
- id: q9
  question: What does `bundle outdated` show?
  options:
    - Gems not in the Gemfile
    - Gems with newer versions available
    - Gems that are unused
    - Gems with security issues
  correctIndex: 1
  explanation: bundle outdated lists gems whose latest version is newer than what's in Gemfile.lock.
- id: q10
  question: What does semantic versioning MAJOR.MINOR.PATCH encode?
  options:
    - Fix.Feature.Breaking
    - Feature.Fix.Breaking
    - Breaking.Feature.Fix
    - Arbitrary numbers
  correctIndex: 2
  explanation: MAJOR = breaking, MINOR = backwards-compatible feature, PATCH = backwards-compatible fix.
```

