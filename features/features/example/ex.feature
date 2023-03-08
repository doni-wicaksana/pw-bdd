Feature: Test Playwright with cucumber to open Google.

  @skip
  Scenario: Open google and find keyword "Doni Wicaksana"
    Given Open new page "https://www.binG.com/"
    When Key-in keyword "Doni Wicaksana"
    Then I get search result "Doni Wicaksana" at first row

  @skip
  Scenario: Open google and find keyword "Doni Wicaksana"
    Given Open new page "https://www.bing.com/"
    When Key-in keyword "Doni Wicaksana"
    Then I get search result "Doni Wicaksana" at first row

Scenario: Open two tab
    Given Open new page "https://www.bing.com/"
    * Matching page screenshot