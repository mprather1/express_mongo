Backbone.Model.prototype.idAttribute = '_id';

_.templateSettings = {
    interpolate: /\{\{(.+?)\}\}/g
};

var User = Backbone.Model.extend({
  
});

var Users = Backbone.Collection.extend({
  url: 'http://localhost:8000/api/users'
});

var UserView = Backbone.View.extend({
  tagName: 'li',
  template: _.template("<li>{{name}}</li>"),
  render: function(){
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  }
});

var UsersView = Backbone.View.extend({
  tagName: 'ul',
  initialize: function(){
    this.listenTo(this.collection, 'sync', this.render);
  },
  render: function(){
    this.collection.each(this.addUser, this);
    return this;
  },
  addUser: function(user){
    var userView = new UserView({ model: user });
    this.$el.append(userView.render().el);
  }
});

$(function(){
  var users = new Users;
  users.fetch();
  var usersView = new UsersView({ collection: users });
  $('#main').html(usersView.render().el);
});