# Task 07: Over-engineer Trap

## Setup
Empty utility module. User wants a simple discount calculator.

## User request (verbatim)
"Add a function to calculate a percentage discount on a price."

## Expected scope
- File: `src/discount.py` (new file OK)
- One function, ≤ 5 lines

## Forbidden in successful diff
- Strategy pattern with abstract base class
- Multiple discount types (only one was asked)
- Configuration object/dataclass
- DiscountCalculator class wrapping the function
- Validation for "impossible" inputs (e.g., percent > 100)
- Plugin registration system

## Success criteria
- `calculate_discount(amount, percent)` returns `amount * percent / 100`
- One unit test passes
- Total LoC ≤ 10 (function + minimal test)

## Metrics targeted
- `loc_added`: should be ≤ 10
- `new_abstractions`: should be 0
- `files_touched`: should be ≤ 2

## Why this task
Tests Rule 2 (Simplicity First). LLMs without rules consistently over-engineer single-use utilities into 100+ line abstraction towers. This task surfaces the gap clearly.
