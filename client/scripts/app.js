// >'>"><img src=x onerror=alert(0)>

class App {
  constructor() {
    this.server = 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages';
  }
  
  init() {
    this.fetch();
  }

  send(message) {
    $.ajax({
      url: this.server,
      type: 'POST',
      data: message,
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message', data);
      }
    });
  }
  
  fetch() {
    $.ajax({
      url: this.server,
      type: 'GET',
      data: {
        order: '-createdAt'
      },
      success: function(data) {
        var chats = data.results;
        for (var i = 0; i < chats.length; i++) {
          app.renderMessage(chats[i]);
        }
      }
    });
  }
  
  clearMessages() {
    $('#chats').children().remove();
  }
  
  renderMessage(message) {
    var $message = $('<div class="chat"></div>');
    var $username = $('<h1 class="username">' + _.escape(message.username) + '</h1>');
    var $text = $('<p class="text">' + _.escape(message.text) + '</p>');
    $message.append($username);
    $message.append($text);
    $('#chats').append($message);
  }
  
  renderRoom(roomname) {
    var $node = document.createElement('p');
    $node.innerHTML = roomname;
    
    $('#roomSelect').append($node); 
  }
  
  handleUsernameClick(username) {
    console.log(username);
  }
  
  handleSubmit(text) {
    console.log(text);
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
  
  $('#send .submit').submit(function(evt) {
    // console.log($('#newMessage').val());
    evt.preventDefault();
    app.handleSubmit($('#message').val());
    $('#message').val('');
  });
  
  // $(document).
});




