
Feature: An example of running an API with BDD.

  Scenario: Run single API request
    Given set API method "POST" and endpoint "https://reqres.in/api/users"
    Given set API request data:
      | type | key | value |
      | data | name | nama gw |
      | data | job | pekerjaan gw |
    When send API request

    Given set API method "get" and endpoint "https://reqres.in/api/users?page=2"
    When send API request
    Then save response data "data[2].id" to "variableName"
    Then console log "{{variableName}}"

    
    Given set API method "get" and endpoint "https://reqres.in/api/users/{{variableName}}"
    When send API request and keep response to "output"
    Then console log "{{output}}"