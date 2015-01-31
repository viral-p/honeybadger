
// Use Parse.Cloud.define to define as many cloud functions as you want.

Parse.Cloud.define("newUserSignUp", function(request, response){
    var user = new Parse.User();
    user.set("username", request.param.username);
    user.set("password", request.param.password);
    user.set("email", request.param.email);
    user.set("tagLine", request.param.tagLine);
    user.set("authorName", request.param.username);
    user.set("followers", []);
    user.set("following", []);
    user.set("posts", []);
    user.set("postsLiked", []);
    user.set("accountSettings", request.param.accountSettings);
    user.set("profilePic", request.param.profilePic);
    post.set("createdAt", Date.now);
    post.set("updatedAt", Date.now);
    
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

Parse.Cloud.define("createNewPost", function(request, response){
    var post = new Parse.Post();
    
    post.set("Title", request.param.title);
    post.set("displayedAuthorName", request.param.displayName);
    post.set("coverImg", request.param.converImg);
    post.set("createdAt", Date.now);
    post.set("updatedAt", Date.now);
    post.set("tags", request.param.tags);
    post.set("likes", []);
    post.set("views", []);
    post.set("prompt", request.param.prompt);
    post.set("wordCount", request.param.wordCount);
    post.set("charCount", request.param.wordCount);
    post.set("textContent", request.param.textContent);
    
    post.save(null, {
        success: function(post) {
            // Execute any logic that should take place after the object is saved.
            alert('New object created with objectId: ' + post.id);
        },
        error: function(post, error) {
            // Execute any logic that should take place if the save fails.
            // error is a Parse.Error with an error code and message.
            alert('Failed to create new object, with error code: ' + error.message);
        }
    });
});

Parse.Cloud.define("createNewPrompt", function(request, response){
    var prompt = new Parse.Prompt();
    
    prompt.set("promptContent", request.param.content);
    prompt.set("postResponses", []);
    prompt.set("tags", []);
    prompt.set("type", request.param.type);
    post.set("createdAt", Date.now);
    post.set("updatedAt", Date.now);
    post.save(null, {
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