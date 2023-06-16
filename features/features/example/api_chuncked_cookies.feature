@noBrowser
Feature: An example of running an API with BDD.
  # @skip
  Scenario: Run single API request
    * set API method "POST" and endpoint "https://demo.finansysapps.id/api/identity/authentication/authenticate"
    * set API request:
      | type | key          | value            |
      | h    | Content-Type | application/json |
      | data | username     | system           |
      | data | password     | P@ssw0rd123#     |
    When send API request

    * set API method "GET" and endpoint "https://demo.finansysapps.id/api/identity/authentication/isauthenticated"
    When send API request
    Then save response data "data.token" to "token"
    # When console log "{{token}}"

    * set API method "GET" and endpoint "https://demo.finansysapps.id/api/form/Editor/ListApplications"
    * set API request:
      | type | key           | value            |
      | h    | Authorization | Bearer {{token}} |
    When send API request
# Then save response data "application_module_category_id" to "application_module_category_id"
# Then save response data "category_name" to "category_name",
# Then save response data "created_by" to "created_by",
# Then save response data "created_on" to "created_on",
# Then save response data "display_name" to "display_name",
# Then save response data "id" to "id",
# Then save response data "module_name" to "module_name"

# Then expect "{{application_module_category_id}}" = "uid",
# Then expect "{{category_name}}" = "Demonstration",
# Then expect "{{created_by}}" = "e1e349999fdd4966bd111c71d9fb123b",
# Then expect "{{created_on}}" = "2021-10-26T06:46:57.426434",
# Then expect "{{display_name}}" = "Sales Invoice Demo",
# Then expect "{{id}}" = "2df4062c330845e7b5462b39aed721ee",
# Then expect "{{module_name}}" = "sales_invoice_demo"
