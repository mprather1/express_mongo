Backbone.Model.prototype.idAttribute = '_id';

_.templateSettings = {
    interpolate: /\{\{(.+?)\}\}/g
};

var Users = Backbone.Collection.extend({
  url: 'http://localhost:8000/api/users',
  comparator: "name",
});

var UserView = Backbone.View.extend({
  tagName: 'tr',
  render: function(){
    var phone_formatted = this.model.get('phone').replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')
    this.$el.html(_.map([
      this.model.get("firstName") + " " + this.model.get("lastName"),
      phone_formatted,
      this.model.get("email")
    ], function(val, key){
      return "<td>" + val + "</td>";
    }));
    return this;
  }
});

var UsersView = Backbone.View.extend({
  tagName: 'table',
  className: 'table table-bordered',
  initialize: function(){
    this.sortFlag = false;
    this.listenTo(this.collection, 'sync', this.render);
    this.listenTo(this.collection, 'sort', this.render);
    this.listenTo(this.collection, 'add', this.render);
  },
  events: {
    'click #name': 'sortName',
    'click #phone': 'sortName',
    'click #email': 'sortName'
  },
  render: function(){
    this.$el.empty();
    this.$el.append($("<tr></tr>").html(
      _.map(["Name", "Phone", "Email"],
      function(val, key) {
          return "<th id='" + val.toLowerCase() + "'>" + val + "</th>";
      })
    ));
    this.$el.append(
      _.map(this.collection.models, function(model, key){
        return new UserView({ model: model}).render().el;
      })
    );
    return this;
  },
  sortName: function(flag){
    if (flag.target.id == 'name'){
      var name = 'lastName'
    } else {
      var name = flag.target.id
    }
    this.collection.comparator = name;
    if (this.sortFlag == false){
      console.log(false)
      this.collection.sort()
      this.sortFlag = true;
    } else {
      console.log(true)
      this.collection.sort();
      this.sortFlag = false;
    }
  }
});

var UsersFormView = Backbone.View.extend({
  tagName: 'form',
  button: _.template("<button id='showFormButton'>New User</button>"),
  form: _.template($('#userFormTemplate').html()),
  initialize: function(options){
    this.users = options.users;
  },
    events: {
    'click #showFormButton': 'showForm',
    'click #submitUser': 'addUser',
    'click #cancelButton': 'render'
  },
  render: function(){
    this.$el.html(this.button());
    return this;
  },
  showForm: function(){
    this.$el.html(this.form);
    return false;
  },
  addUser: function(){
    var userAttrs = {
      firstName: $('#firstName_input').val(),
      lastName: $('#lastName_input').val(),
      email: $('#email_input').val(),
      phone: $('#phone_input').val()
    }
    this.users.create(userAttrs);
    this.render();
    return false;
  }
});

$(function(){
  var users = new Users;
  users.fetch();
  var usersView = new UsersView({ collection: users });
  var usersFormView = new UsersFormView({ users: users });
  $('#newForm').html(usersFormView.render().el);
  $('#main').html(usersView.render().el);
});