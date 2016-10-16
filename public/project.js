// Project requirements https://gist.github.com/svodnik/941eacec73fe15984db8e5b3658981a1

// Initialize Firebase
  var config = {
    apiKey: "AIzaSyAEyeuXqPoud8vf_0K3e9YauOdGSZY1rAc",
    authDomain: "accessible-web-home.firebaseapp.com",
    databaseURL: "https://accessible-web-home.firebaseio.com",
    storageBucket: "accessible-web-home.appspot.com",
    messagingSenderId: "820575297869"
  };
  firebase.initializeApp(config);


var messageAppReference = firebase.database();


// THIS CONTENT BELOW ADDS CONTENT TO THE FIREBASE DB 

$(document).ready(function() {
    $('#message-form').submit(function(event) {
        event.preventDefault();
        var message = $('#message').val();
        $('#message').val('');
        var messagesReference = messageAppReference.ref('messages');

        // testing - APPEARS TO WORK!
        var nickname = $('#nickname').val();
        $('#nickname').val('');
        var messagesReference = messageAppReference.ref('messages');
        // end testing


        messagesReference.push({
            message: message,
            // votes: 0
            nickname: nickname
        });
    });
    messageClass.getPosts();
});

var messageClass = (function() {

    function getPosts() {
        messageAppReference.ref('messages').on('value', function(results) {
            var $messageBoard = $('.message-board');
            var messages = [];
            var allMessages = results.val();
            for (var msg in allMessages) {
                var message = allMessages[msg].message;
            //  var votes = allMessages[msg].votes;
                var nickname = allMessages[msg].nickname;
            //  var $messageListElement = $('<li>');        // old, used <li>s 

                var $messageListElement = $('<div class="box">');  // adds DIV to create box element with box class, layout uses css inline-block 
 
            // DELETE 
                var $deleteElement = $('<i class="fa fa-trash pull-right delete"></i>');
                $deleteElement.on('click', function(e) {
                    var id = $(e.target.parentNode).data('id');
                    deleteMessage(id);
                })
                
            // UPVOTE
                var $upVoteElement = $('<i class="fa fa-thumbs-up pull-right"></i>');
                $upVoteElement.on('click', function(e) {
                    var id = $(e.target.parentNode).data('id');
                    updateMessage(id, ++votes)
                })

            // DOWNVOTE
                var $downVoteElement = $('<i class="fa fa-thumbs-down pull-right"></i>');
                $downVoteElement.on('click', function(e) {
                    var id = $(e.target.parentNode).data('id');
                    updateMessage(id, --votes)
                })
                
                $messageListElement.attr('data-id', msg);
                // $messageListElement.html(message);     // FORMATTED 'MESSAGE' INTO A LINK BELOW 
                $messageListElement.html("<a href=" + message + " target=\"_blank\">" + nickname + "</a>");   // THIS WORKS 


//              $messageListElement.append($deleteElement); // original, this works 
                $messageListElement.prepend($deleteElement); // adds delete icon inside div border


                messages.push($messageListElement);
            }
            $messageBoard.empty();
            for (var i in messages) {
                $messageBoard.append(messages[i]);
            }

        });
    }


function updateMessage(id, votes) {         // try removing "votes" ???? 
    var messageReference = messageAppReference.ref('messages').child(id);
    messageReference.update({
        votes: votes
    })
}

    function deleteMessage(id) {
        var messageReference = messageAppReference.ref('messages').child(id);
        messageReference.remove();        
    }

    return {
        getPosts: getPosts
    }
})();
