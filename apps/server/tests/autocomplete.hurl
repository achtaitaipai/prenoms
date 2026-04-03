# National
GET http://localhost:3000/autocomplete/national?q=Jea

HTTP 200
[Asserts]
jsonpath "$" isCollection
jsonpath "$[0]" isString


# National with limit
GET http://localhost:3000/autocomplete/national?q=Ma&limit=3

HTTP 200
[Asserts]
jsonpath "$" isCollection
jsonpath "$" count <= 3


# Regional
GET http://localhost:3000/autocomplete/regional?q=Jea

HTTP 200
[Asserts]
jsonpath "$" isCollection


# Missing q
GET http://localhost:3000/autocomplete/national

HTTP 422
