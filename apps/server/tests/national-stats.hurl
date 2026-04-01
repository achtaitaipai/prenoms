# Basic query
GET http://localhost:3000/national/stats?firstname=Jean

HTTP 200
[Asserts]
jsonpath "$.firstname" isString
jsonpath "$.firstname" == "JEAN"
jsonpath "$.totalCount" isInteger
jsonpath "$.totalCount" > 0
jsonpath "$.byYear" isCollection
jsonpath "$.byYear[0].year" isInteger
jsonpath "$.byYear[0].count" isInteger


# With sex filter
GET http://localhost:3000/national/stats?firstname=Jean&sex=1

HTTP 200
[Asserts]
jsonpath "$.firstname" == "JEAN"
jsonpath "$.totalCount" isInteger
jsonpath "$.totalCount" > 0
jsonpath "$.byYear" isCollection
jsonpath "$.byYear[0].year" isInteger
jsonpath "$.byYear[0].count" isInteger


# Missing firstname → validation error
GET http://localhost:3000/national/stats

HTTP 422
