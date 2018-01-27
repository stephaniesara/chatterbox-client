// >'>"><img src=x onerror=alert(0)>

class App {
  constructor() {
    this.server = 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages';
    this.roomnames = {};
    this.friendsList = {};
  }
  
  init() {
    this.fetch();
  }

  send(message) {
    $.ajax({
      url: this.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
        app.fetch();
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message', data);
      }
    });

  }
  
  fetch(room = 'General') {
    $.ajax({
      url: this.server,
      type: 'GET',
      data: {
        order: '-createdAt'
      },
      success: function(data) {
        console.log('chatterbox: Data fetched');
        $('#chats').html('');
        var chats = data.results;
        
        for (var i = 0; i < chats.length; i++) {
          var chat = chats[i];
          var roomname = _.escape(chat.roomname); 
          if (!app.roomnames[roomname]) {
            app.roomnames[roomname] = true;   
            var $roomname = $('<option value="' + roomname + '">' + roomname + '</option>');
            $('#roomSelect').append($roomname);
          }
          if (room === 'General' || roomname === room) {
            app.renderMessage(chat);
          }
        }
      }
    });
  }
  
  clearMessages() {
    $('#chats').children().remove();
  }
  
  renderMessage(message) {
    var $message = $('<div class="chat"></div>');
    var $username = $('<h1 class="username">' + (_.escape(message.username) || 'anonymous') + '</h1>');
    var $text = $('<p class="text">' + _.escape(message.text) + '</p>');
    $message.append($username);
    $message.append($text);
    $message.addClass(_.escape(message.username) || 'anonymous');
    $('#chats').append($message);
  }
  
  renderRoom(roomname) {
    var $node = document.createElement('p');
    $node.innerHTML = roomname;
    
    $('#roomSelect').append($node); 
  }
  
  handleUsernameClick(username) {
    console.log(username);
    $('.' + username).each(function() {
      $(this).addClass('friend');
    });
  }
  
  handleSubmit(text) {
    var username = (window.location.search).substring(10);
    var message = {
      roomname: 'testroom',
      text: text,
      username: username
    };
    this.send(message);
  }
  
  
}



var app = new App();

// var test = "'Curly, Larry &amp; Moe'";
// test = _.escape(test);
// console.log(test);

$(document).ready(function() {
  app.init();

  // $('.username').on('click', function() {
  //   console.log(this);
  // });


  $('#chats').on('click', '.username', function() {
    app.handleUsernameClick(this.innerText);
  });
  
  $('#send').submit(function(evt) {
    evt.preventDefault();
    if ($('#message').val() === '') {
      alert('you gotta type something');
      return;
    }
    app.handleSubmit($('#message').val());
    $('#message').val('');
  });
  
  $('#refresh').on('click', function() {
    var $chats = $('#chats');
    $chats.html('');
    app.fetch();
  });
  
  $('#roomSelect').on('change', function() {
    // console.log($('#roomSelect').val());
    app.fetch($('#roomSelect').val());
  });
  
});




