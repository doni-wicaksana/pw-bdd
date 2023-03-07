Feature: An example of running an API with BDD.

  Scenario: Run single API request
  #   Given set API method "POST" and endpoint "https://reqres.in/api/users"
  #   Given set API request data:
  #     | type | key | value |
  #     | data | name | nama gw |
  #     | data | job | pekerjaan gw |
  #   When send API request
    # When save response data "" to ""

    Given set API method "get" and endpoint "https://reqres.in/api/users"
    Given set API request data:
      | type | key | value |
      | param | page | 1 |
    When send API request
    When save response data "data[1].id" to "data_id"
    When console log "{{data_id}}"
    # When send API request and keep response to ""

  # When set value "varible1" to variable "var"
  # When console log "var"
  # When console log "{var}"
  # When console log "{{var}}"
  # When console log "tes{{var}}"
  # When console log "tes{{var}} xx"
  # When console log "tes{{{var}}}"   
  # When console log "tes{{var}}dnd{{ddd}}"
  # When console log "tes{{var}}dnd{{ddd}} and {{var}}"