# Basic search
GET http://localhost:3000/ranking/search?firstname=Jean

HTTP 200
[Asserts]
jsonpath "$.firstname" == "JEAN"
jsonpath "$.total" > 0
jsonpath "$.rank" isInteger
jsonpath "$.page" isInteger


# With filters
GET http://localhost:3000/ranking/search?firstname=Jean&sex=1&yearStart=2000&yearEnd=2020

HTTP 200
[Asserts]
jsonpath "$.firstname" == "JEAN"
jsonpath "$.total" > 0
jsonpath "$.rank" isInteger
jsonpath "$.page" isInteger


# Not found
GET http://localhost:3000/ranking/search?firstname=Zzzzznotaname

HTTP 200
``


# Missing firstname
GET http://localhost:3000/ranking/search

HTTP 422
