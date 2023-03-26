# @skip
Feature: Test Playwright with cucumber to open bing.

  Scenario: Open google and find keyword "Doni Wicaksana"
    Given Open new page "https://www.binG.com/"
    When Key-in keyword "Doni Wicaksana"
    Then I get search result "Doni Wicaksana" at first row

  Scenario: Open two tab
    Given Open new page "https://www.bing.com/"
    * Match screenshot of page "bing"
