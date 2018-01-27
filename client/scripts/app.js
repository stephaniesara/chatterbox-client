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
      data: message,
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
  
  fetch() {
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
            var $roomname = $('<option value="' + roomname.replace(/ /g, '_') + '">' + roomname + '</option>');
            $('#roomSelect').append($roomname);
          }
          app.renderMessage(chat);
        }
        
        var $room = $('#roomSelect').val();
        if ($room !== 'showAll') {
          $('.chat').hide();
          $('.' + $room).show();
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
    var roomname = _.escape(message.roomname).replace(/ /g, '_');
    $message.append($username);
    $message.append($text);
    $message.addClass( (_.escape(message.username)).replace(/ /g, '_') || 'anonymous');
    $message.addClass(roomname);
    $('#chats').append($message);
  }
  
  renderRoom(roomname) {
    var $node = document.createElement('p');
    $node.innerHTML = roomname;
    $('#roomSelect').append($node); 
  }
  
  handleUsernameClick(username) {
    $('.' + _.escape(username).replace(/ /g, '_')).each(function() {
      $(this).addClass('friend');
    });
  }
  
  handleSubmit(text) {
    var username = (window.location.search).substring(10);
    var roomname = $('#roomSelect').val();
    var message = {
      roomname: roomname,
      text: text,
      username: username
    };
    
    this.send(JSON.stringify(message));
    // var $room = $('#roomSelect').val();
    // console.log($room);
    //console.log(roomname);
    // if (roomname === 'showAll') {
    //   $('.chat').show();
    //   return;
    // }
    // if (roomname !== 'showAll') {
    //   $('.chat').hide();
    //   $('.' + roomname).show();
    // }
  }
  
  
}



var app = new App();

$(document).ready(function() {
  app.init();

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
    var $room = $('#roomSelect').val();
    if ($room === 'newRoom') {
      var newRoom = prompt('What do you want to name the room?');
      return;
    }
    if ($room === 'showAll') {
      $('.chat').show();
      return;
    }
    $('.chat').hide();
    $('.' + $room).show();
  });
});




