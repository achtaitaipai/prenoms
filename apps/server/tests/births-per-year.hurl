# Default
GET http://localhost:3000/births-per-year

HTTP 200
[Asserts]
jsonpath "$.byYear" isCollection
jsonpath "$.byYear[0].year" isInteger
jsonpath "$.byYear[0].total" isInteger


# With sex filter
GET http://localhost:3000/births-per-year?sex=1

HTTP 200
[Asserts]
jsonpath "$.byYear" isCollection
jsonpath "$.byYear[0].year" isInteger
jsonpath "$.byYear[0].total" isInteger
