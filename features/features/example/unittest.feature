@apiOnly
# @skip
Feature: Unit test

  Scenario Outline: test save object part by path to variable
    * set API method "get" and endpoint "https://reqres.in/api/users?page=2"
    When send API request
    Then save response data "<Object_Path>" to "<variable_Name>"
    # Then console log "{{<variable_Name>}}"
    Examples: 
      | Object_Path | variable_Name |
      | data[2]     | data2         |
      | data        | data          |
      # | data[1000]  | data1         |

  Scenario Outline: run test set variable
    When set value "varible1" to variable "var"
    When expect "<value>" = "<expect>"
    # Then console log "<value>"
    Examples: 
      | value                            | expect                             |
      | var                              | var                                |
      | {var}                            | {var}                              |
      | {{var}}                          | varible1                           |
      | tes{{var}}                       | tesvarible1                        |
      | tes{{var}} xx                    | tesvarible1 xx                     |
      | tes{{{var}}}                     | tes{varible1}                      |
      | tes{{var}}dnd{{ddd}}             | tesvarible1dnd{{ddd}}              |
      | tes{{var}}dnd{{ddd}} and {{var}} | tesvarible1dnd{{ddd}} and varible1 |
@skip
  Scenario Outline: faker
    Then console log "<value>"
    Examples: 
      | value                                             |expect|
      | {{@faker.name.firstName}}                         |success|
      | {{@faker.datatype.number({'min': 10,'max': 50})}} |error|
      | {{@faker.random.numeric(5)}}                      |success|
      | {{@faker.random.words(5)}}                        |success|
