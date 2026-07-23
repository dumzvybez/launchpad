---
slug: ruby-rails-basics-mvc-activerecord-routes
id: ruby-19
track: ruby
order: 19
title: Rails Basics — MVC, ActiveRecord, Routes
description: "Build a Rails app: models with ActiveRecord, controllers with strong params, routes with resources, and ERB views."
difficulty: advanced
estMinutes: 345
contentVersion: 1.0.0
youtubeUrl: https://www.youtube.com/watch?v=fmyvWz5TUWg&t=12500s
whyItMatters: "Build a Rails app: models with ActiveRecord, controllers with strong params, routes with resources, and ERB views."
deepDiveResources:
  - label: W3Schools Ruby
    url: https://www.w3schools.com/ruby/
    kind: course
  - label: Ruby Official Docs
    url: https://www.ruby-doc.org/
    kind: doc
---

# Rails Basics — MVC, ActiveRecord, Routes

## Rails Basics — MVC, ActiveRecord, Routes

### Why It Matters

Build a Rails app: models with ActiveRecord, controllers with strong params, routes with resources, and ERB views.

Build a Rails app: models with ActiveRecord, controllers with strong params, routes with resources, and ERB views.

### Prerequisites

- Stage 18: Rack and Sinatra Basics
- Stage 14: Gem Management and Bundler.

### Topics

- rails new, directory layout, MVC pattern
- ActiveRecord models, migrations, validations
- belongs_to / has_many / has_many :through
- routes.rb: resources, member/collection routes, root
- Controllers: before_action, strong params (permit)
- ERB views: <%= %> output, <% %> execute, partials
- Query interface: where, order, joins, includes
- Scopes and class methods for reusable queries

### Key Concepts

- Rails follows Convention over Configuration — ArticlesController maps to /articles, Article model maps to articles table.
- Strong parameters (params.require(:article).permit(:title, :body)) prevent mass-assignment security holes.
- Use `Article.includes(:comments)` to avoid N+1 queries when iterating associations.
- Always use parameterized queries (`where('title = ?', x)` or `where(title: x)`) — never interpolate user input into SQL.
- Validations run on save; `save` returns false on failure (use save! to raise), `valid?` checks without persisting.
- Scopes are lambdas: `scope :published, -> { where.not(published_at: nil) }` — chainable and reusable.

```ruby
# db/migrate/20240101000001_create_articles.rb
class CreateArticles < ActiveRecord::Migration[7.1]
  def change
    create_table :articles do |t|
      t.string :title, null: false
      t.text :body
      t.integer :views, default: 0
      t.references :user, foreign_key: true   # user_id
      t.timestamps                               # created_at, updated_at
    end
    add_index :articles, :title
  end
end

# app/models/article.rb
class Article < ApplicationRecord
  belongs_to :user
  has_many :comments, dependent: :destroy

  validates :title, presence: true, length: { minimum: 5 }
  validates :body, presence: true

  scope :published, -> { where.not(published_at: nil) }
  scope :recent, ->(n = 10) { order(created_at: :desc).limit(n) }
end
```
Caption: Models and migrations

### Common Pitfalls

- Interpolating user input into SQL — Use parameterized queries (where('title = ?', x) or where(title: x)) — string interpolation is a SQL injection vector.
- Forgetting strong params — Mass-assigning params directly is a security hole; always use params.require(:model).permit(:field1, :field2).
- N+1 queries in views — Use .includes(:association) when iterating associations to load them in one query instead of N.
- Using save instead of save! silently — save returns false on validation failure (often ignored); use save! to raise and catch the failure explicitly.
- Forgetting dependent: :destroy on has_many — Without dependent: :destroy, deleting a parent leaves orphaned children; pick :destroy, :delete_all, or :nullify explicitly.

### Real-World Applications

- GitHub, Shopify, Airbnb, Stripe, Twitch, and Basecamp all run massive Rails monoliths; Rails powers much of the modern web.
- Shopify's monolith has 5,000+ models and 50,000+ routes; performance is kept via aggressive use of includes and caching.
- GitHub's Rails app handles billions of git operations daily with ActiveRecord-based rate limiting and audit logging.
- Airbnb migrated from a Rails monolith to polyglot services, but its core booking flow is still Rails for rapid feature development.

### Interview Questions

- 1. What's the purpose of strong parameters? — To whitelist which attributes can be mass-assigned — prevents users from setting protected fields like admin.
- 2. How do you prevent N+1 queries? — Use .includes(:association) to eager-load associations in a single query when iterating.
- 3. What's the difference between save and save!? — save returns false on validation failure; save! raises ActiveRecord::RecordInvalid.
- 4. What does `resources :articles` generate? — CRUD routes (index, new, create, show, edit, update, destroy) + path helpers like articles_path, article_path(id).
- 5. How do you safely use user input in a WHERE clause? — Use parameterized queries: `where('title = ?', params[:title])` or `where(title: params[:title])` — never interpolate.

### Mini Project

Build a Blog with Rails: A mini blog with Articles (title, body, author)
and Comments (body, author), full CRUD, validations, and a simple feed
view. Suggested approach:
Suggested approach:
  - rails new blog --database=sqlite3
  - Scaffold Article and Comment with migrations
  - Set up has_many :comments dependent: :destroy on Article
  - Use before_action to set @article in show/edit/update
  - Add a scope :recent on Article and use it in index

### Exercises

1. Run `rails new myapp` and inspect the directory layout.
2. Generate a model and migration with `rails generate model Article title:string body:text`.
3. Run `rails db:migrate` and verify the table with `rails dbconsole`.
4. Add a belongs_to / has_many relationship and test in `rails console`.
5. Add a controller with strong params and a view; verify the full CRUD cycle.
6. >>> QUIZ (Stage 19) <<<
7. (Z AI: render this as an interactive multiple-choice quiz in the Learn tab)
8. Q1: What's the purpose of strong parameters?
9. A) To validate presence
10. B) To cache queries
11. C) To whitelist mass-assignable attributes (*)
12. D) To route requests
13. Explanation: params.require(:article).permit(:title, :body) prevents users from setting protected fields like admin.
14. Q2: How do you prevent N+1 queries?
15. A) Use .joins(:association)
16. B) Use .select(:association)
17. C) Add an index
18. D) Use .includes(:association) (*)
19. Explanation: includes eager-loads associations in one query (or one per association) — eliminates the N+1 pattern.
20. Q3: What's the difference between save and save!?
21. A) save returns false; save! raises on failure (*)
22. B) save is deprecated
23. C) save! is faster
24. D) They're identical
25. Explanation: save silently returns false on validation failure; save! raises ActiveRecord::RecordInvalid — use save! to surface errors.
26. Q4: What does `resources :articles` generate?
27. A) A database table
28. B) CRUD routes and path helpers (*)
29. C) A model
30. D) A controller
31. Explanation: resources maps index/new/create/show/edit/update/destroy routes and helpers like articles_path, article_path(id).
32. Q5: How do you safely use user input in a WHERE clause?
33. A) Interpolate with #{}
34. B) Use .where! with string concat
35. C) Use parameterized queries (where('x = ?', val) or where(x: val)) (*)
36. D) Escape manually
37. Explanation: Parameterized queries sanitize inputs — string interpolation is a SQL injection vector.
38. Q6: What does `dependent: :destroy` do on a has_many?
39. A) Prevents destroying the parent
40. B) Makes children read-only
41. C) Caches the count
42. D) Destroys children when parent is destroyed (*)
43. Explanation: dependent: :destroy cascades deletion to associated records — alternatives: :delete_all, :nullify, :restrict_with_error.
44. Q7: What does a Rails scope return?
45. A) An ActiveRecord::Relation (chainable) (*)
46. B) An Array
47. C) A single record
48. D) A Hash
49. Explanation: Scopes return relations you can chain: Article.published.recent(10) composes two scopes.
50. Q8: What does `belongs_to :user` add to a model?
51. A) A view template
52. B) A user_id column reference and a .user accessor (*)
53. C) A route
54. D) A validation
55. Explanation: belongs_to adds the association accessor and (since Rails 5) a default presence validation on the foreign key.
56. Q9: What's the convention for an ArticlesController?
57. A) Manually route each action
58. B) Always inherits from Sinatra::Base
59. C) Maps to /articles routes, ArticlesController class, article_path helpers (*)
60. D) Requires a separate config file
61. Explanation: Convention over Configuration: plural controller, plural route, singular model, singular helper.
62. Q10: What does `before_action :set_article, only: [:show, :edit]` do?
63. A) Runs set_article before every action
64. B) Skips set_article for show
65. C) Defines a new route
66. D) Runs set_article before show and edit actions (*)
67. Explanation: before_action registers a callback — use only: or except: to scope which actions trigger it.
68. ----------------------------------------------------------------------

```quiz
- id: q1
  question: What's the purpose of strong parameters?
  options:
    - To validate presence
    - To cache queries
    - To whitelist mass-assignable attributes
    - To route requests
  correctIndex: 2
  explanation: params.require(:article).permit(:title, :body) prevents users from setting protected fields like admin.
- id: q2
  question: How do you prevent N+1 queries?
  options:
    - Use .joins(:association)
    - Use .select(:association)
    - Add an index
    - Use .includes(:association)
  correctIndex: 3
  explanation: includes eager-loads associations in one query (or one per association) — eliminates the N+1 pattern.
- id: q3
  question: What's the difference between save and save!?
  options:
    - save returns false; save! raises on failure
    - save is deprecated
    - save! is faster
    - They're identical
  correctIndex: 0
  explanation: save silently returns false on validation failure; save! raises ActiveRecord::RecordInvalid — use save! to surface errors.
- id: q4
  question: What does `resources :articles` generate?
  options:
    - A database table
    - CRUD routes and path helpers
    - A model
    - A controller
  correctIndex: 1
  explanation: resources maps index/new/create/show/edit/update/destroy routes and helpers like articles_path, article_path(id).
- id: q5
  question: How do you safely use user input in a WHERE clause?
  options:
    - "Interpolate with #{}"
    - Use .where! with string concat
    - "Use parameterized queries (where('x = ?', val) or where(x: val))"
    - Escape manually
  correctIndex: 2
  explanation: Parameterized queries sanitize inputs — string interpolation is a SQL injection vector.
- id: q6
  question: "What does `dependent: :destroy` do on a has_many?"
  options:
    - Prevents destroying the parent
    - Makes children read-only
    - Caches the count
    - Destroys children when parent is destroyed
  correctIndex: 3
  explanation: "dependent: :destroy cascades deletion to associated records — alternatives: :delete_all, :nullify, :restrict_with_error."
- id: q7
  question: What does a Rails scope return?
  options:
    - An ActiveRecord::Relation (chainable)
    - An Array
    - A single record
    - A Hash
  correctIndex: 0
  explanation: "Scopes return relations you can chain: Article.published.recent(10) composes two scopes."
- id: q8
  question: What does `belongs_to :user` add to a model?
  options:
    - A view template
    - A user_id column reference and a .user accessor
    - A route
    - A validation
  correctIndex: 1
  explanation: belongs_to adds the association accessor and (since Rails 5) a default presence validation on the foreign key.
- id: q9
  question: What's the convention for an ArticlesController?
  options:
    - Manually route each action
    - Always inherits from Sinatra::Base
    - Maps to /articles routes, ArticlesController class, article_path helpers
    - Requires a separate config file
  correctIndex: 2
  explanation: "Convention over Configuration: plural controller, plural route, singular model, singular helper."
- id: q10
  question: "What does `before_action :set_article, only: [:show, :edit]` do?"
  options:
    - Runs set_article before every action
    - Skips set_article for show
    - Defines a new route
    - Runs set_article before show and edit actions
  correctIndex: 3
  explanation: "before_action registers a callback — use only: or except: to scope which actions trigger it."
```

