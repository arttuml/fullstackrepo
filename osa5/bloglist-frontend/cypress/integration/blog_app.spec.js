describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      username: 'arttumatti',
      name: 'Arttu Matti',
      password: 'salasana'
    }
    cy.request('POST', 'http://localhost:3003/api/users', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application')
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('arttumatti')
      cy.get('#password').type('salasana')
      cy.get('#login-button').click()
      cy.contains('Arttu Matti logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('arttumatti')
      cy.get('#password').type('vaarasalasana')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.request('POST','http://localhost:3003/api/login', {
        username: 'arttumatti', password: 'salasana'
      }).then(response => {
        localStorage.setItem('loggedBlogappUser', JSON.stringify(response.body))
        cy.visit('http://localhost:3000')
      })
    })

    it('A blog can be created', function() {
      cy.contains('create new blog').click()

      cy.get('#title').type('Uusi blogi')
      cy.get('#author').type('Testi Blogaaja')
      cy.get('#url').type('http://blogaajanblogi.fi')
      cy.get('#create-blog-button').click()

      cy.contains('Uusi blogi Testi Blogaaja')
    })

    describe('And a new blog has been created', function() {
      beforeEach(function() {
        cy.createBlog({
          title: 'Testi',
          author: 'Testaaja',
          url: 'testiosoite.fi'
        })
      })

      it('The blog can be liked', function() {
        cy.contains('Testi Testaaja').contains('view').click()
        cy.contains('like').click()
        cy.contains('likes 1')
      })

      it('The blog can be removed', function() {
        cy.contains('Testi Testaaja').contains('view').click()
        cy.contains('remove').click()
        cy.get('.success').contains('blog deleted')
      })
    })

    describe('And several blogs exist', function () {
      beforeEach(function () {
        cy.createBlog({ title: 'eka blogi', author: 'Testaaja', url: 'testiosoite1.fi', likes: 10 })
        cy.createBlog({ title: 'toka blogi', author: 'Testaaja', url: 'testiosoite2.fi', likes: 30 })
        cy.createBlog({ title: 'kolmas blogi', author: 'Testaaja', url: 'testiosoite3.fi', likes: 20 })
      })

      it('blogs are ordered by likes', function () {
        cy.get('.moreBlogInfo').then( blogs => {
          cy.wrap(blogs[0]).contains('toka blogi')
          cy.wrap(blogs[1]).contains('kolmas blogi')
          cy.wrap(blogs[2]).contains('eka blogi')
        })
      })
    })
  })
})