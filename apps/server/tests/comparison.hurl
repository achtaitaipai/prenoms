# Basic comparison query
GET http://localhost:3000/comparison?firstname1=Jean&firstname2=Pierre

HTTP 200
[Asserts]
jsonpath "$.firstname1" == "JEAN"
jsonpath "$.firstname2" == "PIERRE"
jsonpath "$.correlation" isFloat


# With sex filter per name
GET http://localhost:3000/comparison?firstname1=Jean&firstname2=Marie&sex1=1&sex2=2

HTTP 200
[Asserts]
jsonpath "$.firstname1" == "JEAN"
jsonpath "$.firstname2" == "MARIE"
jsonpath "$.correlation" isFloat


# Missing firstname2 → validation error
GET http://localhost:3000/comparison?firstname1=Jean

HTTP 422
