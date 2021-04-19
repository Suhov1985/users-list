import '../css/style.scss'
import './stars'
import Backbone from 'backbone'
import _, {forEach} from 'underscore'
import $ from 'jquery'
const axios = require('axios').default

let app = {}

function validatePhone(phone){
  let regex = /^(\+7|\+3|7|8)?[\s\-]?\(?[489][0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/
  return regex.test(phone)
}
$(function (){
  app.listModel = Backbone.Model.extend({
    defaults: {
      users: [
        {
          id: 0,
          name: 'Вася',
          phone: '+380635000000'
        },
        {
          id: 1,
          name: 'Петя',
          phone: '+380635000000'
        },
        {
          id: 2,
          name: 'Коля',
          phone: '+380635000000'
        },
        {
          id: 3,
          name: 'Саша',
          phone: '+380635000000'
        },
      ],
    },
  })
  app.usersListView = Backbone.View.extend({
    initialize: function (){
      this.template = _.template("\n" +
          "\t\t\t<li class=\"list-group-item d-flex justify-content-between align-items-center\">\n" +
          "\t\t\t\t<div class=\"ms-2 me-auto\">\n" +
          "\t\t\t\t\t<div class=\"name\"><b class=\"fw-bold\">Name:</b> <span><%- name %></span></div>\n" +
          "\t\t\t\t\t<div class=\"phone\"><b class=\"fw-bold\">Phone:</b> <span><%- phone %></span></div>\n" +
          "\t\t\t\t</div>\n" +
          "\t\t\t\t<div class=\"actions column\">\n" +
          "\t\t\t\t\t<button data-num='<%- id %>' class=\"editeUser btn btn-info\">Edite</button>\n" +
          "\t\t\t\t\t<button data-num='<%- id %>' class=\"removeUser btn btn-danger\">Remove</button>\n" +
          "\t\t\t\t</div>\n" +
          "\t\t\t</li>"
      )
      this.listenTo(this.model, 'change', this.render)
      this.listenTo(this.model, 'destroy', this.remove)
      this.render()
    },
    events: {
      "click .editeUser": "editeUser",
      "click .removeUser": "removeUser",
      "click #saveNewUser": "saveNewUser",
      "click .saveUser": "saveUser",
    },
    render: function() {
      this.$el.html()
      let json = this.model.toJSON()

      let templateForm = "\t<div id=\"form\" class=\"row\">\n" +
          "\t\t\t<div class=\"input-wrap mb-3 col-sm-6\">\n" +
          "\t\t\t\t<label for=\"nameInput\" class=\"form-label\">Name</label>\n" +
          "\t\t\t\t<input type=\"text\" class=\"form-control\" id=\"nameInput\">\n" +
          "\t\t\t\t<div id=\"nameHelp\" class=\"form-text error-text\">Please enter name.</div>\n" +
          "\t\t\t</div>\n" +
          "\t\t\t<div class=\"input-wrap mb-3 col-sm-6\">\n" +
          "\t\t\t\t<label for=\"phoneInput\" class=\"form-label\">Phone</label>\n" +
          "\t\t\t\t<input type=\"tel\" class=\"form-control\" id=\"phoneInput\">\n" +
          "\t\t\t\t<div id=\"phoneHelp\" class=\"form-text error-text\">Please enter phone (only numbers).</div>\n" +
          "\t\t\t</div>\n" +
          "\t\t\t<div class=\"mb-3 col-sm-3\"><button id=\"saveNewUser\" class=\"btn btn-primary btn-block\">Submit</button></div>\n" +
          "\t\t</div>"

      let view = '<h2>Users List</h2><ol class="list-group list-group-numbered" id="users-list">'
      let viewEnd = '</ol>'
      let tmp = this.template
      _.mapObject(json.users, function(val, key) {
        return view += tmp(val)
      });
      this.$el.html(view + viewEnd + templateForm)
    },
    editeUser: function (e){
      let idx = e.target.dataset.num
      $(e.target).parent().append("<button data-num='" + idx + "' " + "class='saveUser btn btn-success'>Save</button>")
      let users = this.model.get('users')
      let nameEdite = $('.list-group-item')[idx].children[0].children[0].children[1]
      let phoneEdite = $('.list-group-item')[idx].children[0].children[1].children[1]
      $(nameEdite).html(`<input id="editNameInput" class="form-control" type="text" value="${users[idx].name}">`)
      $(phoneEdite).html(`<input id="editPhoneInput" class="form-control" type="text" value="${users[idx].phone}">`)
      // axios.post('/user/edit/' + idx, newUser)
      //     .then(function (response) {
      //       console.log(response);
      //     })
      //     .catch(function (error) {
      //       console.log(error);
      //     });
    },
    removeUserByIdx: function (idx){
      let users = this.model.get('users')
      let updatedUsers = []
      _.pick(users, function(value, key, object) {
        return key !== idx ? updatedUsers.push(value) : null
      });
      return updatedUsers
    },
    removeUser: function (e){
      let idx = e.target.dataset.num
      let updatedUsers = this.removeUserByIdx(idx)
      this.model.set({
        'users' : updatedUsers
      });
      // axios.post('/user/remove', {
      //   id: idx
      // }).then(function (response) {
      //       console.log(response);
      //     })
      //     .catch(function (error) {
      //       console.log(error);
      //     });
    },
    saveNewUser: function (){
      let name = $('#nameInput')
      let phone = $('#phoneInput')
      let users = this.model.get('users')
      let newUser = {
        name: '',
        phone: '',
        id: ++users[users.length - 1].id,
      }
      if(!name.val()){
        name.addClass('is-invalid')
        $('#nameHelp').show()
      } else {
        name.removeClass('is-invalid')
        newUser.name = name.val()
        $('#nameHelp').hide()
      }
      if(!phone.val() || !validatePhone(phone.val())){
        phone.addClass('is-invalid')
        $('#phoneHelp').show()
        return false
      } else {
        phone.removeClass('is-invalid')
        $('#phoneHelp').hide()
        newUser.phone = phone.val()
      }
      if(name.val().length > 0 && phone.val().length > 0) {
        this.model.set({
          'users' : this.model.get('users').concat(newUser)
        });
        // axios.post('/user/add', newUser)
        //     .then(function (response) {
        //       console.log(response);
        //     })
        //     .catch(function (error) {
        //       console.log(error);
        //     });
      }
    },
    saveUser: function (e){
      let idx = e.target.dataset.num
      let name = $('#editNameInput')
      let phone = $('#editPhoneInput')
      let users = this.model.get('users')

      let newUser = {
        name: '',
        id: idx,
        phone: ''
      }
      if(!name.val()){
        name.addClass('is-invalid')
      } else {
        name.removeClass('is-invalid')
        newUser.name = name.val()
      }
      if(!phone.val() || !validatePhone(phone.val())){
        phone.addClass('is-invalid')
        return false
      } else {
        phone.removeClass('is-invalid')
        newUser.phone = phone.val()
      }
      if(name.val().length > 0 && phone.val().length > 0) {
        let updatedUsers = []
        _.pick(users, function(value, key, object) {
          return key !== idx ? updatedUsers.push(value) : updatedUsers.push(newUser)
        });
        this.model.set({
          'users' : updatedUsers
        });
        // axios.post('/user/edit/' + idx, newUser)
        //     .then(function (response) {
        //       console.log(response);
        //     })
        //     .catch(function (error) {
        //       console.log(error);
        //     });
      }
    }
  })

  let usersListModel = new app.listModel()
  app.myApp = new app.usersListView({
    model: usersListModel,
    el: '#users'
  })
})



