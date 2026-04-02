# Basic query
GET http://localhost:3000/repartition?firstname=Jean

HTTP 200
[Asserts]
jsonpath "$.firstname" == "JEAN"
jsonpath "$.data" isCollection
jsonpath "$.data[0].region" isString
jsonpath "$.data[0].count" isInteger
jsonpath "$.data[0].percent" isFloat


# With sex filter
GET http://localhost:3000/repartition?firstname=Jean&sex=1

HTTP 200
[Asserts]
jsonpath "$.firstname" == "JEAN"
jsonpath "$.data" isCollection


# With year range
GET http://localhost:3000/repartition?firstname=Jean&yearStart=2000&yearEnd=2010

HTTP 200
[Asserts]
jsonpath "$.data" isCollection


# Missing firstname → validation error
GET http://localhost:3000/repartition

HTTP 422
