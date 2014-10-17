
//  invoke immidiately after webpage loaded
(function ($) {

    ///////////////////////////////
    //  Data

    var text = [
        {   /* NotFound */
            title1: "Oops!",
            title2: "Coś poszło nie tak!",
            description: "Prawdopodobnie wpisałeś zły adres lub strona nie istnieje."
        },
        {   /* CommingSoon */
            title1: "Comming soon! ",
            title2: "Zapraszamy wkrótce!",
            description: "Pracujemy nad nową odsłoną tej strony. Prosimy o cierpliwość."
        }
    ];


    ///////////////////////////////
    //  Models

    window.Book = Backbone.Model.extend({
        defaults: {
            photo: "/images/300x300.gif",
            title: "",
            author: "",
            description: "",
            id: ""
        },
        urlRoot : 'books',
    });

    window.PersonalizedPage = Backbone.Model.extend();

    ///////////////////////////////
    //  Colection

    window.BooksList = Backbone.Collection.extend({
        model: Book,
        url:"books/all"
    });

    ///////////////////////////////
    //  Views

    window.ListItemView = Backbone.View.extend({
        tagName: "div",
        className: "col-xs-12 col-sm-6 col-md-4 col-lg-4",

        template: _.template($("#book-list-item").html()),

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    window.ListView = Backbone.View.extend({
        el: $("#to-render"),

        initialize: function() {
            // this.model.bind("reset", this.render, this);
        },

        render: function() {
            var self = this;

            _.each(self.booksList.models, function(item) {
                self.$el.append(new ListItemView({model: item}).render().el);
            });
        }
    });

    window.ItemDescriptionView = Backbone.View.extend({
        tagName: "div",

        template: _.template($("#book-deails-item").html()),

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            $("#to-render").append(this.el);
            return this;
        }
    });

    window.PersonalizedPageView = Backbone.View.extend({
        tagName: "div",

        template: _.template($("#personalized").html()),

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            $("#to-render").append(this.el);
            return this;
        }
    });

    window.CommingSoonView = Backbone.View.extend({
        tagName: "div",

        template: _.template($("#personalized").html()),

        render: function() {
            this.$el.html(this.template());
            $("#to-render").append(this.el);
            return this;
        }
    });

    ///////////////////////////////
    //  Routes

    var AppRouter = Backbone.Router.extend({

        routes: {
            "": "books",
            "books/:id": "bookDescription",
            "commingSoon": "commingSoon",
            "*default": "notFound"
        },

        books: function() {
            $("#to-render").empty();
            this.booksList = new BooksList();
            this.booksListView = new ListView();
            this.booksListView.booksList = this.booksList;

            var self = this;

            var date = this.booksList.fetch();
            date.done( function() {
                 self.booksListView.render();
            });
        },

        bookDescription: function(id) {
            $("#to-render").empty();
            var book = new Book({id: id});
            var data = book.fetch();
            data.done( function() {
                var view = new ItemDescriptionView({model: book});
                view.render();
            });
        },

        notFound: function() {
            $("#to-render").empty();
            var page = new PersonalizedPage(text[0]);
            var view = new PersonalizedPageView({model: page});
            view.render();
        },

        commingSoon: function() {
            $("#to-render").empty();
            var page = new PersonalizedPage(text[1]);
            var view = new PersonalizedPageView({model: page});
            view.render();
        }
    });

    var router = new AppRouter();
    Backbone.history.start();

} (jQuery));

