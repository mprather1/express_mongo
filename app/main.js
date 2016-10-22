Backbone.Model.prototype.idAttribute = '_id';

_.templateSettings = {
    interpolate: /\{\{(.+?)\}\}/g
};

var User = Backbone.Model.extend({
  urlRoot: 'http://localhost:8000/api/users',
  initialize : function(){
    this.on("invalid",function(model,error){
      console.log(error);
    });
  },
  validation: {
    firstName: {
      required: true
    },
    lastName: {
      required: true
    },
    email: {
      pattern: 'email'
    },
    phone: function(value, attrs, computedState){
      function isNormalInteger(str){
        var n = ~~Number(str);
        return String(n) === str && n >= 0;
      }
      if (isNormalInteger(computedState.phone) === false || computedState.phone.length < 10)
        return 'Phone is invalid....'
    }
  }
});

var Users = Backbone.Collection.extend({
  url: 'http://localhost:8000/api/users',
  comparator: 'name',
});

var UserView = Backbone.View.extend({
  tagName: 'tr',
  render: function(){
    var phone_formatted = this.model.get('phone').replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    var fullName = this.model.get("firstName") + " " + this.model.get("lastName");
    this.$el.html(_.map([
      fullName,
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
  model: User,
  className: 'table table-bordered',
  initialize: function(){
    this.sorted = new SortedCollection(this.collection);
    this.sorted.setSort('lastName', 'asc')
    this.sortFlag = false;
    this.listenTo(this.sorted, 'sorted:add', this.render);
    this.listenTo(this.collection, 'add', this.render);
  },
  events: {
    'click': 'sortUsers',
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
      _.map(this.sorted.models, function(model, key){
        return new UserView({ model: model}).render().el;
      })
    );
    return this;
  },
  sortUsers: function(flag){
    if (flag.target.id === 'name'){
      var name = 'lastName'
    } else {
      var name = flag.target.id
    }
    if (this.sortFlag === false){
      var order = 'asc'
      this.sortFlag = true;
    } else {
      var order = 'desc'
      this.sortFlag = false;
    }
    this.sorted.setSort(name, order)
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
  addUser: function(e){
    e.preventDefault();
    var userAttrs = {
      firstName: $('#firstName_input').val(),
      lastName: $('#lastName_input').val(),
      email: $('#email_input').val(),
      phone: $('#phone_input').val()
    }
    var newUser = new User()
    Backbone.Validation.bind(this, {
      model: newUser
    })
    if (newUser.save(userAttrs)){
      this.users.add(newUser)
      this.render()
      return false;
    }
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