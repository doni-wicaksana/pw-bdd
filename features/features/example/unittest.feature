Feature: test 
Scenario Outline: run test set variable
  When set value "varible1" to variable "var"
  When expect "var" = "var"
  When expect "{var}" = "{var}"
  When expect "{{var}}" = "varible1"
  When expect "tes{{var}}" = "tesvarible1"
  When expect "tes{{var}} xx" = "tesvarible1 xx"
  When expect "tes{{{var}}}" = "tes{varible1}"   
  When expect "tes{{var}}dnd{{ddd}}" = "tesvarible1dnd{{ddd}}"
  When expect "tes{{var}}dnd{{ddd}} and {{var}}" = "tesvarible1dnd{{ddd}} and varible1"
  # Then exec "expect(this.parseStepParameter('{{var}}')).toEqual('varible1');"
  # Then eval
  # """
  # expect(this.parseStepParameter('{{var}}')).toEqual('varible1');
  # """
  # Then exec "expect(this.parseStepParameter('{{var}}')).toEqual('varible2');"
  # Then eval
  # """
  # expect(this.parseStepParameter('{{var}}')).toEqual('varible2');
  # """