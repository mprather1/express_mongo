Backbone.Model.prototype.idAttribute = '_id';
String.prototype.capitalizedFirstLetter = function(){
  return this.charAt(0).toUpperCase() + this.slice(1);
};

_.templateSettings = {
    interpolate: /\{\{(.+?)\}\}/g
};

var User = Backbone.Model.extend({
  urlRoot: 'http://localhost:8000/api/users',
  initialize : function(){
    this.on("invalid",function(model, error){
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
      required: true,
      pattern: 'email'
    },
    phone: {
      required: true,
      pattern: 'number',
      minLength: 10,
      maxLength: 10
    }
  }
});

var Users = Backbone.Collection.extend({
  url: 'http://localhost:8000/api/users'
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
  className: 'table table-striped',
  template: _.template("<thead></thead><tbody></tbody>"),
  initialize: function(){
    this.sorted = new SortedCollection(this.collection);
    this.sorted.setSort('id', 'asc')
    this.sortFlag = null;
    this.listenTo(this.sorted, 'sorted:add', this.render);
    this.listenTo(this.collection, 'add', this.render);
  },
  events: {
    'click': 'sortUsers',
    'mouseover .table-header': 'mouseoverFunc',
    'mouseout .table-header': 'mouseoutFunc'
  },
  render: function(){
    this.$el.html(this.template());
    var thead = this.$el.find("thead");
    thead.append($("<tr></tr>").html(
      _.map(["Name", "Phone", "Email"],
      function(val, key) {
          return "<th class='table-header' style='background-color:#999999' id='" + val.toLowerCase() + "'>" + val + "</th>";
      })
    ));
    this.$el.append(
      _.map(this.sorted.models, function(model, key){
        return new UserView({ model: model}).render().el;
      })
    );
    thead.prepend("<h3>Users</h3>");
    return this;
  },
  sortUsers: function(flag){
    if (flag.target.id === 'name'){
      var name = 'lastName';
    } else {
      name = flag.target.id;
    }
    if (this.sortFlag === false){
      var order = 'asc';
      this.sortFlag = true;
    } else {
      order = 'desc';
      this.sortFlag = false;
    }
    this.sorted.setSort(name, order);
  },
  mouseoverFunc: function(event){
    $(event.currentTarget).css({"background-color":"yellow","cursor":"pointer"});
  },
  mouseoutFunc: function(event){
    $(event.currentTarget).css("background-color", "#999999");
  }
});

var UsersFormView = Backbone.View.extend({
  tagName: 'form',
  button: _.template("<button class='btn btn-block btn-inverse' id='showFormButton'>Create New User</button>"),
  form: _.template($('#userFormTemplate').html()),
  initialize: function(){
    this.model = new User();
    Backbone.Validation.bind(this, {
      model: this.model
    });
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
      firstName: $('#firstName_input').val().capitalizedFirstLetter(),
      lastName: $('#lastName_input').val().capitalizedFirstLetter(),
      email: $('#email_input').val(),
      phone: $('#phone_input').val()
    };
    this.model.set(userAttrs);
    if(this.model.isValid(true)){
      this.collection.add(this.model)
    } else {
      console.log('error')
    }
  }
});

$(function(){
  var users = new Users;
  users.fetch();
  var usersView = new UsersView({ collection: users });
  var usersFormView = new UsersFormView({ collection: users });
  $('#newForm').html(usersFormView.render().el);
  $('#main').html(usersView.render().el);
});