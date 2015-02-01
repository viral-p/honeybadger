// Use Parse.Cloud.define to define as many cloud functions as you want.
//create new user
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!" + request.params.yolo);
});

Parse.Cloud.define("newUserSignUp", function(request, response){
    var user = new Parse.User();
    var img = new Image();
    img.src = "../public/defaultUserImg.png";
    user.set("username", request.params.username);
    user.set("password", request.params.password);
    user.set("email", request.params.email);
    user.set("name", request.params.name);
    user.set("profilePic", img)
    user.signUp(null, {
        success: function(user) {
            // Hooray! Let them use the app now.
        },
        error: function(user, error) {
            // Show the error message somewhere and let the user try again.
            alert("Error: " + error.code + " " + error.message);
        }
    });
});

//create new post
Parse.Cloud.define("createNewPost", function(request, response){
    var Post = Parse.Object.extend("Post");
    var post = new Post();
    var user = Parse.User.current();
    var prompt = request.params.prompt;
    var tagsArray = request.params.tags.split(',');
    
    post.set("Title", request.params.title);
    post.set("subtitle", request.params.subtitle);
    //post.set("coverImg", request.params.coverImg);
    post.set("creator", user.id);
    post.set("tags", tagsArray);
    post.set("prompt", request.params.prompt);
    post.set("textContent", request.params.textContent);
    post.set("wordCount", request.params.textContent.split(" ").length);
    post.set("charCount", request.params.textContent.split("").length);
    
    post.save(null, {
        success: function(post) {
        // The object was saved successfully.
            if(typeof prompt)
            prompt.relation("postResponses").add(post);
            user.relation("posts").add(post);
            user.save();
            prompt.save();
            response.success("post created with id " + post.id);
        },
        error: function(post, error) {
            // The save failed.
            // error is a Parse.Error with an error code and description.
            response.error(error.code + "post was not created"  + error.message);
        }
    });
});

//create new Prompt
Parse.Cloud.define("createNewPrompt", function(request, response){
    var Prompt = Parse.Object.extend("Prompt");
    var prompt = new Prompt();
    var content = request.params.content;
    prompt.set("content", content);
    prompt.set("type", request.params.type);
    prompt.save(null, {
        success: function(prompt) {
            // Execute any logic that should take place after the object is saved.
            alert('New object created with objectId: ' + prompt.id);
        },
        error: function(prompt, error) {
            // Execute any logic that should take place if the save fails.
            // error is a Parse.Error with an error code and message.
            alert('Failed to create new object, with error code: ' + error.message);
        }
    });
});

//retrieve user with specific objectId
Parse.Cloud.define("getUserWithID", function(request,response){
    var user = new Parse.User();
    var query = new Parse.Query(user);
    query.get(request.params.id, {
        success: function(results) {
            response.success(results);
            // The object was retrieved successfully.
        },
        error: function(object, error) {
            response.error("no User found");
            // The object was not retrieved successfully.
            // error is a Parse.Error with an error code and message.
        }
    });
});

//retrieve specifi post by objectId
Parse.Cloud.define("getPostWithID", function(request,response){
    var Post = Parse.Object.extend("Post");
    var post = new Post();
    var query = new Parse.Query(post);
    query.get(request.params.id, {
        success: function(results) {
            response.success(results);
            // The object was retrieved successfully.
        },
        error: function(object, error) {
            response.error("no Post found");
            // The object was not retrieved successfully.
            // error is a Parse.Error with an error code and message.
        }
    });
});

//retrieve specific post by objectId
Parse.Cloud.define("getPromptWithID", function(request,response){
    var Prompt = Parse.Object.extend("Prompt");
    var prompt = new Prompt();
    var query = new Parse.Query(prompt);
    query.get(request.params.id, {
        success: function(results) {
            response.success(results);
            // The object was retrieved successfully.
        },
        error: function(object, error) {
            response.error("no Prompt found");
            // The object was not retrieved successfully.
            // error is a Parse.Error with an error code and message.
        }
    });
});

//retrieve array of post that contain the tag specified
Parse.Cloud.define("retrievePostsWithTag", function(request,response){
    var Post = Parse.Object.extend("Post");
    var post = new Post();
    var query = new Parse.Query(post);
    query.equalTo("tags", request.params.tag);
    query.find({
        success: function(results) {
            response.success(results);
            // The object was retrieved successfully.
        },
        error: function(object, error) {
            response.error("no Post found");
            // The object was not retrieved successfully.
            // error is a Parse.Error with an error code and message.
        }
    });
});

//retrieve aray of prompts with specified tag
Parse.Cloud.define("retrievePromptsWithTag", function(request,response){
    var Prompt = Parse.Object.extend("Prompt");
    var prompt = new Prompt();
    var query = new Parse.Query(prompt);
    query.equalTo("tags", request.params.tag);
    query.find( {
        success: function(results) {
            response.success(results);
            // The object was retrieved successfully.
        },
        error: function(object, error) {
            response.error("no Prompt found");
            // The object was not retrieved successfully.
            // error is a Parse.Error with an error code and message.
        }
    });
});

//search for Users by Name
Parse.Cloud.define("searchUsersbyName", function(request,response){
    var user = new Parse.User();
    
    var query1 = new Parse.Query(user);
    var query2 = new Parse.Query(user);
    var query3 = new Parse.Query(user);
    query1.contains("username", request.params.name);
    query2.contains("authorName", request.params.name);
    query3.contains("name", request.params.name);
    
    var query = new Parse.Query.or(query1,query2, query3);
    query.find({
        success: function(results) {
            response.success(results);
            // The object was retrieved successfully.
        },
        error: function(object, error) {
            response.error("no Post found");
            // The object was not retrieved successfully.
            // error is a Parse.Error with an error code and message.
        }
    });
});

//get array of followers of given user
Parse.Cloud.define("getFollowers", function(request, response){
    var user = new Parse.User.current();
    var relation = user.relation("followers");
    relation.query().find({
    success: function(list) {
        // list contains the followers of the current user
        response.success(list);
        }
    });
});

//get array of users that given user is following
Parse.Cloud.define("getFollowing", function(request, response){
    var user = new Parse.User.current();
    
    var relation = user.relation("following");
    relation.query().find({
        success: function(list){
            response.success(list);
        }
    });
});

//get array of posts written by author name
Parse.Cloud.define("getPostsbyUser", function(request, response){
    var Post = Parse.Object.extend("Post");
    var post = new Post();
    var query = new Parse.Query(post);
    
    query.equalTo("displayedAuthorName", request.params.author);
    
    query.find({
       success: function(results){
           response.success(results);
       },
        error: function(object, error) { 
            response.error("error in search");
        }
    });
});

//edit Posts
Parse.Cloud.define("editPost", function(request, response){
    var Post = Parse.Object.extend("Post");
    var post = new Post();
    var query = new Parse.Query(post);
    var _post = query.get(request.params.id, {
        success: function(results) {
            response.success(results);
            // The object was retrieved successfully.
        },
        error: function(object, error) {
            response.error("no Post found");
            // The object was not retrieved successfully.
            // error is a Parse.Error with an error code and message.
        }
    });
    
    _post.set("Title", request.params.title);
    _post.set("subtitle", request.params.subtitle);
    _post.set("coverImg", request.params.coverImg);
    _post.set("updatedAt", Date.now);
    _post.set("tags", request.params.tags);
    _post.set("wordCount", request.params.wordCount);
    _post.set("charCount", request.params.charCount);
    _post.set("textContent", request.params.textContent);
    
    _post.save(null, {
        success: function(post) {
            // Execute any logic that should take place after the object is saved.
            alert('Upated object with objectId: ' + post.id);
        },
        error: function(post, error) {
            // Execute any logic that should take place if the save fails.
            // error is a Parse.Error with an error code and message.
            alert('Failed to update object, with error code: ' + error.message);
        }
    });
});

//edit user attributes
Parse.Cloud.define("editUserAttributes", function(request, response){
    var user = new Parse.User();
    var query = new Parse.Query(user);
    var _user = query.get(request.params.id, {
        success: function(results) {
            response.success(results);
            // The object was retrieved successfully.
        },
        error: function(object, error) {
            response.error("no User found");
            // The object was not retrieved successfully.
            // error is a Parse.Error with an error code and message.
        }
    });
    
    _user.set("password", request.params.password);
    _user.set("email", request.params.email);
    _user.set("tagLine", request.params.tagLine);
    _user.set("authorName", request.params.username);
    _user.set("accountSettings", request.params.accountSettings);
    _user.set("profilePic", request.params.profilePic);
    _user.set("updatedAt", Date.now);
    
    _user.save(null, {
        success: function(user) {
            // Execute any logic that should take place after the object is saved.
            alert('Upated object with objectId: ' + user.id);
        },
        error: function(user, error) {
            // Execute any logic that should take place if the save fails.
            // error is a Parse.Error with an error code and message.
            alert('Failed to update object, with error code: ' + error.message);
        }
    });
});

//edit User settings
Parse.Cloud.define("editUserSetting", function(request, response){
    var user = new Parse.User();
    var query = new Parse.Query(user);
    var _user = query.get(request.params.id, {
        success: function(results) {
            response.success(results);
            // The object was retrieved successfully.
        },
        error: function(object, error) {
            response.error("no User found");
            // The object was not retrieved successfully.
            // error is a Parse.Error with an error code and message.
        }
    });
    _user.set("accountSettings", request.params.accountSettings);
    
    _user.save(null, {
        success: function(user) {
            // Execute any logic that should take place after the object is saved.
            alert('Upated object with objectId: ' + user.id);
        },
        error: function(user, error) {
            // Execute any logic that should take place if the save fails.
            // error is a Parse.Error with an error code and message.
            alert('Failed to update object, with error code: ' + error.message);
        }
    });
});

//delete a user
Parse.Cloud.define("deleteUser", function(request, response){
    var user = new Parse.User.current();
    user.destroy({
        success: function(_user) {
            // The object was deleted from the Parse Cloud.
        },
        error: function(_user, error) {
            // The delete failed.
            // error is a Parse.Error with an error code and message.
        }
    });
});

//delete a post
Parse.Cloud.define("deletePost", function(request, response){
    var Post = Parse.Object.extend("Post");
    var post = new Post();
    var query = new Parse.Query(post);
    var _post = query.get(request.params.id, {
        success: function(results) {
            response.success(results);
            // The object was retrieved successfully.
        },
        error: function(object, error) {
            response.error("no Post found");
            // The object was not retrieved successfully.
            // error is a Parse.Error with an error code and message.
        }
    });
    
    _post.destroy({
        success: function(_post) {
            // The object was deleted from the Parse Cloud.
        },
        error: function(_post, error) {
            // The delete failed.
            // error is a Parse.Error with an error code and message.
        }
    });
});

//delete a prompt
Parse.Cloud.define("deletePrompt", function(request, response){
    var Prompt = Parse.Object.extend("Prompt");
    var prompt = new Prompt();
    var query = new Parse.Query(prompt);
    var _prompt = query.get(request.params.id, {
        success: function(results) {
            response.success(results);
            // The object was retrieved successfully.
        },
        error: function(object, error) {
            response.error("no Prompt found");
            // The object was not retrieved successfully.
            // error is a Parse.Error with an error code and message.
        }
    });
    
    _prompt.destroy({
        success: function(_prompt) {
            // The object was deleted from the Parse Cloud.
        },
        error: function(_prompt, error) {
            // The delete failed.
            // error is a Parse.Error with an error code and message.
        }
    });
});

//user login
Parse.Cloud.define("loginUser", function(request, response){
    Parse.User.logIn(request.params.username, request.params.password, {
        success: function(user) {
            // Do stuff after successful login.
        },
        error: function(user, error) {
            // The login failed. Check error to see why.
        }
    });
});

//user logout
Parse.Cloud.define("logoutUser", function(request, response){
    Parse.User.logOut();
});

//follow a user
Parse.Cloud.define("followUser", function(request, response){
    var currentUser = Parse.User.curent();
    var toFollow = getUserByID(request.params.toFollow);
    
    currentUser.relation("following").add(toFollow);
    toFollow.relation("followers").add(currentUser);
    
    currentUser.save();
    toFollow.save();
});

//unfollow a user
Parse.Cloud.define("unfollowUser", function(request, response){
    var currentUser = Parse.User.curent();
    var followed = getUserByID(request.params.toRemove);
    
    currentUser.relation("following").remove(followed);
    followed.relation("followers").remove(currentUser);
    
    currentUser.save();
    followed.save();
});

//like a post
Parse.Cloud.define("likePost", function(request, response){
    var currentUser = Parse.User.curent();
    var toLike = getPostByID(request.params.toLike);
    
    currentUser.relation("likes").add(toLike);
    toLike.relation("likes").add(currentUser);
    
    currentUser.save();
    toLike.save();
});

//unlike a post
Parse.Cloud.define("unlikePost", function(request, response){
    var currentUser = Parse.User.curent();
    var liked = getUserByID(request.params.toUnlike);
    
    currentUser.relation("likes").remove(liked);
    liked.relation("likes").remove(currentUser);
    
    currentUser.save();
    liked.save();
});

//twilio text sending
Parse.Cloud.define("sendTextNotification", function(request, response){
    // Require and initialize the Twilio module with your credentials
var client = require('twilio')('ACCOUNT_SID', 'AUTH_TOKEN');
 
// Send an SMS message
client.sendSms({
    to:request.params.toNumber, 
    from: request.params.fromNumber, 
    body: request.params.messageBodyx
  }, function(err, responseData) { 
    if (err) {
      console.log(err);
    } else { 
      console.log(responseData.from); 
      console.log(responseData.body);
    }
  }
);
});

//initialize facebook SDK
Parse.Cloud.define("initFacebook", function(request, response){
     // Initialize Parse
  Parse.initialize("YOUR_APP_ID", "YOUR_JAVASCRIPT_KEY");
 
  window.fbAsyncInit = function() {
    Parse.FacebookUtils.init({ // this line replaces FB.init({
      appId      : '{1598988990312593}', // Facebook App ID
      status     : true,  // check Facebook Login status
      cookie     : true,  // enable cookies to allow Parse to access the session
      xfbml      : true,  // initialize Facebook social plugins on the page
      version    : 'v2.2' // point to the latest Facebook Graph API version
    });
 
    // Run code after the Facebook SDK is loaded.
  };
 
  (function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
});

//facebook login
Parse.Cloud.define("FacebookLogin", function(request, response){
    Parse.FacebookUtils.logIn(null, {
        success: function(user) {
            if (!user.existed()) {
                alert("User signed up and logged in through Facebook!");
            } else {
                alert("User logged in through Facebook!");
            }
        },
        error: function(user, error) {
            alert("User cancelled the Facebook login or did not fully authorize.");
        }
    });
});
    
//check if facebook is logged in
Parse.Cloud.define("FacebookLoginCheck", function(request, response){
    FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
            console.log('Logged in.');
        }
        else {
          FB.login();
        }
    });
});

//push a specified number of feeds
//request contains
Parse.Cloud.define("aggregateBlogs", function(request, response){
    var Post = Parse.Object.extend("Post");
    var post = new Post();
    
    var query = new Parse.Query(post);
    query.exists("Title");
    query.limit(request.param.limit);
    query.find({
        success:function(results){
            response.success("Successfully retrieved " + results.length + " posts");
            //doSomething with with results
            response.success(results);
        },
        error: function(error){
            response.error(error.code + ": " + error.message);
        }
    });
});

Parse.Cloud.define("getRandomPost", function(request,response){
    
});