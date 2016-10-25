Backbone.Model.prototype.idAttribute = '_id';
String.prototype.capitalizedFirstLetter = function(){
  return this.charAt(0).toUpperCase() + this.slice(1);
};

_.templateSettings = {
    interpolate: /\{\{(.+?)\}\}/g
};

_.extend(Backbone.Validation.callbacks, {
  valid: function (view, attr, selector) {
    var $el = view.$('[name=' + attr + ']'), 
        $group = $el.closest('.form-group');
    $group.removeClass('has-error');
    $group.find('.help-block').html('').addClass('hidden');
  },
  invalid: function (view, attr, error, selector) {
    var $el = view.$('[name=' + attr + ']'), 
      $group = $el.closest('.form-group');
    
    $group.addClass('has-error');
    $group.find('.help-block').html(error).removeClass('hidden');
  }
});

var User = Backbone.Model.extend({
  urlRoot: 'http://localhost:8000/api/users',
  initialize : function(){
    // this.on("invalid",function(model, error){
    //   console.log(error);
    // });
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
  },
  set: function(key, value, options) {
    if (_.isObject(key) || key == null) {
      attrs = key;
      options = value;
    } else {
      attrs = {};
      attrs[key] = value;
    }
    for (attr in attrs) {
      if (attr == 'firstName' || attr == 'lastName' || attr == 'email') {
        attrs[attr] = attrs[attr].toLowerCase();
      }
    }
    return Backbone.Model.prototype.set.call(this, attrs, options);
  }
});

var Users = Backbone.PageableCollection.extend({
  model: User,
  url: 'http://localhost:8000/api/users?&'
});

var UserView = Backbone.View.extend({
  tagName: 'tr',
  render: function(){
    var phone_formatted = this.model.get('phone').replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    var fullName = this.model.get("firstName").capitalizedFirstLetter() + " " + this.model.get("lastName").capitalizedFirstLetter();
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
    this.sorted.setSort('id', 'asc');
    this.sortFlag = null;
    this.listenTo(this.sorted, 'sorted:add', this.render);
    this.listenTo(this.collection, 'sync', this.render);
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
  },
    events: {
    'click #showFormButton': 'showForm',
    'click #submitUser': 'addUser',
    'click #cancelButton': 'render'
  },
  render: function(){
    this.$el.html(this.button());
    Backbone.Validation.bind(this, {
      model: this.model
    });
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
    };
    this.model.set(userAttrs);
    if(this.model.isValid(true)){
      this.model.save();
      this.collection.add(this.model);
      Backbone.Validation.unbind(this);
      this.render();
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