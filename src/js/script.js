{
  ('use strict');

  const select = {
    templateOf: {
      bookProduct: '#template-book',
    },
    containerOf: {
      bookList: '.books-list',
    },
    images: {
      bookImage: 'book_image',
    },
    filters: '.filters',
  };

  const className = {
    bookImageClass: 'favorite',
    hidden: 'hidden',
  };

  const templates = {
    menuBook: Handlebars.compile(
      document.querySelector(select.templateOf.bookProduct).innerHTML
    ),
  };
  const favoriteBooks = [];
  const filters = [];

  class BooksList {
    constructor(id) {
      const thisBook = this;
      thisBook.id = id;

      thisBook.initData();
      thisBook.getElements();
      thisBook.initActions();
      thisBook.filterBooks();
      thisBook.determineRatingBgc();
    }

    initData() {
      const thisBook = this;
      thisBook.data = dataSource.books;

      // for every book dataSource.books
      for (let book of this.data) {
        const thisBook = this;

        //  get rating based on book.rating
        book.ratingBgc = thisBook.determineRatingBgc(book.rating);
        book.ratingWidth = book.rating * 10;

        //  generate HTML based on template
        const generatedHTML = templates.menuBook(book);

        //  create element using utils.createElementFromHTML
        thisBook.bookParams = utils.createDOMFromHTML(generatedHTML);

        //  find book container
        const bookContainer = document.querySelector(
          select.containerOf.bookList
        );

        //  add element to book
        bookContainer.appendChild(thisBook.bookParams);
      }
    }

    getElements() {
      const thisBook = this;

      thisBook.container = document.querySelector(select.containerOf.bookList);
      thisBook.bookImages = thisBook.container.querySelectorAll(
        select.images.bookImage
      );
      thisBook.filter = document.querySelector(select.filters);
    }

    initActions() {
      const thisBook = this;

      // add eventListener to bookList
      thisBook.container.addEventListener('dblclick', function (event) {
        event.preventDefault();

        // get book of bookList
        const book = event.target.offsetParent;

        // check if book contains class book__image
        if (book.classList.contains('book__image')) {
          // toggle class favorite
          book.classList.toggle(className.bookImageClass);

          // get bookImageId attribute based on book attribute
          const bookImageId = book.getAttribute('data-id');

          // check if bookImageId is already in favoriteBooks
          if (favoriteBooks.includes(bookImageId)) {
            // get index of bookImageId
            const index = favoriteBooks.indexOf(bookImageId);

            // remove book from favoriteBooks array
            favoriteBooks.splice(index, 1);
          } else {
            // add book to favoriteBooks array
            favoriteBooks.push(bookImageId);
          }
        }
      });

      // add eventListener to form
      thisBook.filter.addEventListener('click', function (event) {
        // get form info
        const bookFilter = event.target;

        // check if clicked elem is form checkbox
        if (
          bookFilter.tagName == 'INPUT' &&
          bookFilter.type == 'checkbox' &&
          bookFilter.name == 'filter'
        ) {
          // check if input is checked
          if (bookFilter.checked == true) {
            // add bookFilter.value to filters array
            filters.push(bookFilter.value);

            // if filters array already get bookFilter.value
          } else if (filters.includes(bookFilter.value)) {
            //  get index of bookFilter.value
            const index = filters.indexOf(bookFilter.value);

            // remove bookFilter.value of filters array
            filters.splice(index, 1);
          }
        }
        // execute filterBooks method
        thisBook.filterBooks();
      });
    }

    filterBooks() {
      const books = dataSource.books;
      const bookId = [];

      // for every book in dataSource.books
      for (let book of books) {
        // set variable shouldBeHidden to false
        let shouldBeHidden = false;

        // for filter of filters
        for (let filter of filters) {
          // check if property filter is false
          if (!book.details[filter]) {
            // set shouldBeHidden to true
            shouldBeHidden = true;

            // add property id of book to bookId array
            bookId.push(book.id);

            // break the loop
            break;
          }
        }
        // check if shouldBeHidden is true
        if (shouldBeHidden == true) {
          // get bookImage based on data-id equal to book.id
          const bookImage = document.querySelector(`[data-id="${book.id}"]`);

          // add class hidden to bookImage
          bookImage.classList.add(className.hidden);

          // check if shouldBeHidden is false
        } else if (shouldBeHidden == false) {
          // get bookImage based on data-id equal to book.id
          const bookImage = document.querySelector(`[data-id="${book.id}"]`);

          // remove class hidden form bookImage
          bookImage.classList.remove(className.hidden);
        }
      }
    }

    determineRatingBgc(rating) {
      let ratingBgc = '';
      if (rating < 6) {
        ratingBgc = 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%)';
      } else if (rating > 6 && rating <= 8) {
        ratingBgc = 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';
      } else if (rating > 8 && rating <= 9) {
        ratingBgc = 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
      } else if (rating > 9) {
        ratingBgc = 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)';
      }
      return ratingBgc;
    }
  }
  // eslint-disable-next-line no-unused-vars
  const app = new BooksList();
}
