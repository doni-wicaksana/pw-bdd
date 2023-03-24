@noBrowser
# @skip
Feature: An example of running an API with BDD.
# @skip
  Scenario: Run single API request
    * set API method "POST" and endpoint "https://reqres.in/api/users"
    * set API request:
      | type | key  | value        |
      | data | name | nama gw      |
      | data | job  | pekerjaan gw |
    * set API payload:
    """
    {
      "job"  : "pekerjaan gw2"
    }
    """
    When send API request and keep response to "response1"
# @skip
  Scenario Outline: Run multiple API request with data file
    * set API method "get" and endpoint "https://reqres.in/api/users"
    * set API request:
      | type | key  | value        |
      | p | page | <page>    |
    When send API request
    Then save response data "data[2].id" to "idData2"
    * set API method "get" and endpoint "https://reqres.in/api/users/{{idData2}}"
    When send API request and keep response to "output"

    Examples: 
      | page |
      |    1 |
      |    2 |
