Feature: Test Playwright with cucumber to open Google.

  Scenario: Open google and find keyword "Doni Wicaksana"
    Given Open new page "https://www.bing.com/"
    When Key-in keyword "Doni Wicaksana"
    Then I get search result "Doni Wicaksana" at first row