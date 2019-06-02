/// <reference types="Cypress" />

const text = "Lorem ipsum dolor sit amet"
const long_text = "Look, just because I don't be givin' no man a foot massage don't make it right for Marsellus to throw Antwone into a glass motherfuckin' house, fuckin' up the way the nigger talks. Motherfucker do that shit to me, he better paralyze my ass, 'cause I'll kill the motherfucker, know what I'm sayin'?"
const exoticItems = ["ฤดูหนาวกำลังจะมา", "겨울이오고있다.", "ਵਿੰਟਰ ਆ ਰਿਹਾ ਹੈ"]
const pageTitle = "todos"
const pageFooter = "[data-cy=footer]"
const input = "[data-cy=new-todo-input]"
const allFilter = ":nth-child(1) > a"
const activeFilter = ":nth-child(2) > a"
const completedFilter = ":nth-child(3) > a"
const itemsForFilteringTest = 15
const todoItem = "[data-cy='todo-item']"
const longItemsAmount = 2
const toogleButton = "> .view > [data-cy=toggle]"
const removeItemButton = "> .view > [data-cy='todo-item-remove']"
const filtersBox = "[data-cy=filters]"
const filtersCount = 3
var active = 0

context('TodoMVC', () => {
  before(() => {
    cy.visit('http://localhost:3000/');
  });

  it('Verify website elements', () => {
    cy.contains(pageTitle)
    cy.get(input)
    .should("be.visible")
  })
  
  it('Add one item', () => {
    cy.get(input)
    .should("be.empty")
    .type(text)
    .should("have.value", text)
    .type("{enter}")
    .should("have.text", "")
  })

  it('Verify added item', () => {
    cy.get(todoItem)
    .contains(text)
    .should("be.visible")
    cy.get(':nth-child(1) ' + toogleButton)
    .should("not.be.selected")
    cy.get(':nth-child(1) ' + removeItemButton)
    .should("not.be.visible")
    .invoke("show")
    .should("be.visible")
    .invoke("hide")
  })

  it('Verify footer menu', () => {
    cy.get(pageFooter)
    .should("be.visible")
    .contains("1 item left")
    cy.get(filtersBox)
    .should("be.visible")
    .children().should("have.length", filtersCount)
    cy.get(allFilter)
    .should("have.class", "selected")
    .and("have.html", "All")
  })

  it('Delete one item', () => {
    cy.get(':nth-child(1) ' + removeItemButton)
    .invoke("show")
    .click()
    cy.get(pageFooter)
    .should("not.be.visible")
    cy.get(todoItem)
    .should("not.be.visible")
  })

  it('Test filtering', () => {
    var completed = new Array;
    var active_label = new Array;
    for (var i = 1; i <= itemsForFilteringTest; i++) { 
      var item_text = i + text
      cy.get(input)
      .type(item_text)
      .type("{enter}")
      if (i % 2 === 0) {
        completed.push(item_text)
        cy.get(':nth-child('+ i +') ' + toogleButton)
        .click()
        cy.get(':nth-child('+ i +')' + todoItem)
        .should("have.class", "completed")
      } else {
        active_label.push(item_text)
      }
    }
    active = (itemsForFilteringTest - completed.length)
    cy.get(activeFilter)
    .should("have.html", "Active")
    .should("not.have.class", "selected")
    .click()
    .should("have.class", "selected")
    cy.get(allFilter)
    .should("not.have.class", "selected")
    cy.get(completedFilter)
    .should("not.have.class", "selected")
    cy.get(pageFooter)
    .should("be.visible")
    .contains(active + " items left")
    for (var i = 1; i <= active; i++){
      cy.get(':nth-child('+ i + ')' + todoItem)
      .should("have.text", active_label[i - 1])
      .should("not.have.class", "completed")      
    }
    cy.get(completedFilter)
    .should("have.html", "Completed")
    .should("not.have.class", "selected")
    .click()
    .should("have.class", "selected")
    cy.get(allFilter)
    .should("not.have.class", "selected")
    cy.get(activeFilter)
    .should("not.have.class", "selected")
    cy.get(pageFooter)
    .should("be.visible")
    .contains(active + " items left")
    for (var i = 1; i <= completed.length; i++){
      cy.get(':nth-child('+ i +')' + todoItem)
      .should("have.text", completed[i - 1])
      .should("have.class", "completed")      
    }
    cy.get(allFilter)
    .should("have.html", "All")
    .should("not.have.class", "selected")
    .click()
    .should("have.class", "selected")
    cy.get(activeFilter)
    .should("not.have.class", "selected")
    cy.get(completedFilter)
    .should("not.have.class", "selected")
    cy.get(':nth-child(' + itemsForFilteringTest + ')' + todoItem)
    .should("have.text", itemsForFilteringTest + text)
    .should("not.have.class", "completed")  
  })

  it('Clear completed items', () => {
    cy.get(completedFilter)
    .click()
    cy.get('.clear-completed')
    .click()
    cy.get(pageFooter)
    .should("be.visible")
    .contains(active + " items left")
    cy.get(todoItem)
    .should("not.be.visible")
    cy.get(allFilter)
    .click()
    cy.get(':nth-child(2)' + todoItem)
    .should("have.text", "3" + text)
  })

  it('Add very long items', () => {
    for (var i = 1; i <= longItemsAmount; i++){
      cy.get(input)
      .type(long_text)
      .should("have.value", long_text)
      .type("{enter}")
      active++
    }
  })

  it('Add items with exotic chars', () => {
    for (var i = 0; i < exoticItems.length; i++){
      cy.get(input)
      .type(exoticItems[i])
      .should("have.value", exoticItems[i])
      .type("{enter}")
      active++
    }
    cy.get(pageFooter)
    .should("be.visible")
    .contains(active + " items left")
  })

  it("Add hundred items",() => {
    for (var i = 0; i < 100; i++) { 
      cy.get(input)
      .type(text)
      .type("{enter}")
      active++
      cy.get(pageFooter)
      .should("be.visible")
      .contains(active + " items left")
    }
  })
  it("Delete several items",() => {
    for (var i = 5; i < 50; i += 5) { 
      cy.get(':nth-child('+ i +') > .view > [data-cy="todo-item-remove"]')
      .invoke("show")
      .click()
      active-- 
    }
    cy.get(pageFooter)
    .should("be.visible")
    .contains(active + " items left")
  })
})

