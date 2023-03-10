@apiOnly
@skip
Feature: An example of running an API with BDD.

  Scenario: Run single API request
    * set API method "POST" and endpoint "https://reqres.in/api/users"
    * set API request data:
      | type | key  | value        |
      | data | name | nama gw      |
      | data | job  | pekerjaan gw |
    When send API request and keep response to "response1"
    # Then console log "{{response1}}"

    * set API method "get" and endpoint "https://reqres.in/api/users?page=2"
    When send API request
    Then save response data "data[2].id" to "idData2"
    # Then console log "{{data2}}"
    
    * set API method "get" and endpoint "https://reqres.in/api/users/{{idData2}}"
    When send API request and keep response to "output"
    # Then console log "{{output}}"
