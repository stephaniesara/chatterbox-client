class App {
  constructor() {
    this.server = 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages';
    this.roomnames = {};
    this.friendsList = {};
  }
  
  init() {
    this.fetch();
  }

  _displayRoom() {
    var $room = $('#roomSelect').val();
    if ($room !== 'showAll') {
      $('.chat').hide();
      $('.' + $room).show();
    } else {
      $('.chat').show(); 
    }
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
      success: this._fetchSuccess.bind(this)
    });
  }
  
  _addRoom(roomname) {
    this.roomnames[roomname] = true;   
    var $roomname = $('<option value="' + roomname.replace(/ /g, '_') + '">' + roomname + '</option>');
    $('#roomSelect').append($roomname);
  }
  
  _fetchSuccess (data) {
    console.log('chatterbox: Data fetched');
    $('#chats').html('');
    var chatsArr = data.results;
    
    for (var i = 0; i < chatsArr.length; i++) {
      var chat = chatsArr[i];
      var roomname = _.escape(chat.roomname); 
      if (!this.roomnames[roomname]) {
        this._addRoom(roomname);
      }
      this.renderMessage(chat);
    }
    
    this._displayRoom();
    
    
    for (var friend in app.friendsList) {
      $('.' + friend).each(function() {
        $(this).addClass('friend');
      });
    }
  }
    
  clearMessages() {
    $('#chats').children().remove();
  }
  
  renderMessage(message) {
    var $message = $('<div class="chat"></div>');
    var $username = $('<p class="username">' + (_.escape(message.username) || 'anonymous') + '</p>');
    var $text = $('<p class="messageText">' + _.escape(message.text) + '</p>');
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
    if (!this.friendsList[username.replace(/ /g, '_')]) {
      this.friendsList[username.replace(/ /g, '_')] = true;
    }
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
    app.fetch();
  });
  
  $('#roomSelect').on('change', function() {
    var $room = $('#roomSelect').val();
    if ($room === 'newRoom') {
      var newRoom = prompt('What do you want to name the room?');
      if (!app.roomnames[newRoom]) {
        app._addRoom(newRoom);
      }
      $('#roomSelect').val(newRoom);
    }
    app._displayRoom();
  });
});




