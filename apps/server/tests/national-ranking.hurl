# Default ranking
GET http://localhost:3000/national/ranking

HTTP 200
[Asserts]
jsonpath "$.page" isInteger
jsonpath "$.pageSize" isInteger
jsonpath "$.totalPages" isInteger
jsonpath "$.data" isCollection
jsonpath "$.data[0].firstname" isString
jsonpath "$.data[0].total" isInteger


# With pagination
GET http://localhost:3000/national/ranking?page=2&pageSize=5

HTTP 200
[Asserts]
jsonpath "$.page" == 2
jsonpath "$.pageSize" == 5
jsonpath "$.totalPages" isInteger
jsonpath "$.data" isCollection
jsonpath "$.data[0].firstname" isString
jsonpath "$.data[0].total" isInteger


# With sex filter
GET http://localhost:3000/national/ranking?sex=1

HTTP 200
[Asserts]
jsonpath "$.page" isInteger
jsonpath "$.pageSize" isInteger
jsonpath "$.totalPages" isInteger
jsonpath "$.data" isCollection
jsonpath "$.data[0].firstname" isString
jsonpath "$.data[0].total" isInteger


# With year range
GET http://localhost:3000/national/ranking?yearStart=2000&yearEnd=2010

HTTP 200
[Asserts]
jsonpath "$.page" isInteger
jsonpath "$.pageSize" isInteger
jsonpath "$.totalPages" isInteger
jsonpath "$.data" isCollection
jsonpath "$.data[0].firstname" isString
jsonpath "$.data[0].total" isInteger
