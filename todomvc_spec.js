/// <reference types="Cypress" />

var text = "Lorem ipsum dolor sit amet"
var long_text =  "Look, just because I don't be givin' no man a foot massage don't make it right for Marsellus to throw Antwone into a glass motherfuckin' house, fuckin' up the way the nigger talks. Motherfucker do that shit to me, he better paralyze my ass, 'cause I'll kill the motherfucker, know what I'm sayin'?"
var active = 0

context('TodoMVC', () => {
  before(() => {
    cy.visit('http://localhost:3000/');
  });
  it('Verify website elements', () => {
    cy.contains("todos")
    cy.get("[data-cy=new-todo-input]")
    .should("be.visible")
  })
  it('Add one item', () => {
    cy.get("[data-cy=new-todo-input]")
    .should("be.empty")
    .type(text)
    .should("have.value", text)
    .type("{enter}")
    .should("have.text", "")
  })
  it('Verify added item', () => {
    cy.get('[data-cy=todo-item-label]')
    .contains(text)
    .should("be.visible")
    cy.get(':nth-child(1) > .view > [data-cy=toggle]')
    .should("not.be.selected")
    cy.get(':nth-child(1) > .view > [data-cy="todo-item-remove"]')
    .should("not.be.visible")
    .invoke("show")
    .should("be.visible")
    .invoke("hide")
  })
  it('Verify footer menu', () => {
    cy.get('[data-cy=footer]')
    .should("be.visible")
    .contains("1 item left")
    cy.get("[data-cy=filters]")
    .should("be.visible")
    .children().should("have.length", 3)
    cy.get(':nth-child(1) > a')
    .should("have.class", "selected")
    .and("have.html", "All")
  })
  it('Delete one item', () => {
    cy.get(':nth-child(1) > .view > [data-cy="todo-item-remove"]')
    .invoke("show")
    .click()
    cy.get('[data-cy=footer]')
    .should("not.be.visible")
    cy.get('[data-cy=todo-item-label]')
    .should("not.be.visible")
  })
  it('Test filtering', () => {
    var completed = new Array;
    var active_label = new Array;
    for (var i = 1; i <= 15; i++) { 
      var item_text = i + " " + text
      cy.get("[data-cy=new-todo-input]")
      .type(item_text)
      .type("{enter}")
      if (i % 2 === 0) {
        completed.push(item_text)
        cy.get(':nth-child('+ i +') > .view > [data-cy=toggle]')
        .click()
        cy.get(':nth-child('+ i +')[data-cy="todo-item"]')
        .should("have.class", "completed")
      } else {
        active_label.push(item_text)
      }
    }
    active = (15 - completed.length)
    cy.get(':nth-child(2) > a')
    .should("have.html", "Active")
    .should("not.have.class", "selected")
    .click()
    .should("have.class", "selected")
    cy.get(':nth-child(1) > a')
    .should("not.have.class", "selected")
    cy.get(':nth-child(3) > a')
    .should("not.have.class", "selected")
    cy.get('[data-cy=footer]')
    .should("be.visible")
    .contains(active + " items left")
    for (var i = 1; i <= active; i++){
      cy.get(':nth-child('+ i +')[data-cy="todo-item"]')
      .should("have.text", active_label[i - 1])
      .should("not.have.class", "completed")      
    }
    cy.get(':nth-child(3) > a')
    .should("have.html", "Completed")
    .should("not.have.class", "selected")
    .click()
    .should("have.class", "selected")
    cy.get(':nth-child(1) > a')
    .should("not.have.class", "selected")
    cy.get(':nth-child(2) > a')
    .should("not.have.class", "selected")
    cy.get('[data-cy=footer]')
    .should("be.visible")
    .contains(active + " items left")
    for (var i = 1; i <= completed.length; i++){
      cy.get(':nth-child('+ i +')[data-cy="todo-item"]')
      .should("have.text", completed[i - 1])
      .should("have.class", "completed")      
    }
    cy.get(':nth-child(1) > a')
    .should("have.html", "All")
    .should("not.have.class", "selected")
    .click()
    .should("have.class", "selected")
    cy.get(':nth-child(2) > a')
    .should("not.have.class", "selected")
    cy.get(':nth-child(3) > a')
    .should("not.have.class", "selected")
    cy.get(':nth-child(15)[data-cy="todo-item"]')
    .should("have.text", "15 " + text)
    .should("not.have.class", "completed")  
  })
  it('Clear completed items', () => {
    cy.get(':nth-child(3) > a')
    .click()
    cy.get('.clear-completed')
    .click()
    cy.get('[data-cy=footer]')
    .should("be.visible")
    .contains(active + " items left")
    cy.get('[data-cy=todo-item-label]')
    .should("not.be.visible")
    cy.get(':nth-child(1) > a')
    .click()
    cy.get(':nth-child(2)[data-cy="todo-item"]')
    .should("have.text", "3 " + text)
  })
  it('Add very long items', () => {
    cy.get("[data-cy=new-todo-input]")
    .type(long_text)
    .should("have.value", long_text)
    .type("{enter}")
    active++
    cy.get("[data-cy=new-todo-input]")
    .type(long_text)
    .should("have.value", long_text)
    .type("{enter}")
    active++
  })
  it('Add items with exotic chars', () => {
    cy.get("[data-cy=new-todo-input]")
    .type("ฤดูหนาวกำลังจะมา")
    .should("have.value", "ฤดูหนาวกำลังจะมา")
    .type("{enter}")
    active++
    cy.get("[data-cy=new-todo-input]")
    .type("겨울이오고있다.")
    .should("have.value", "겨울이오고있다.")
    .type("{enter}")
    active++
    cy.get("[data-cy=new-todo-input]")
    .type("ਵਿੰਟਰ ਆ ਰਿਹਾ ਹੈ")
    .should("have.value", "ਵਿੰਟਰ ਆ ਰਿਹਾ ਹੈ")
    .type("{enter}")
    active++
    cy.get('[data-cy=footer]')
    .should("be.visible")
    .contains(active + " items left")
  })
  it("Add hundred items",() => {
    for (var i = 0; i < 100; i++) { 
      cy.get("[data-cy=new-todo-input]")
      .type(text)
      .type("{enter}")
      active++
      cy.get('[data-cy=footer]')
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
    cy.get('[data-cy=footer]')
    .should("be.visible")
    .contains(active + " items left")
  })
})

